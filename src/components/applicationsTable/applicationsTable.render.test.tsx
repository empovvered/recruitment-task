import userEvent from "@testing-library/user-event"
import { ApplicationsRequestError } from "api/apiActions/applications/applications.errors"
import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"
import { render, screen, waitFor, within } from "tests"

import { ApplicationsTable } from "./applicationsTable"

const columns: ColumnMeta[] = [
  { key: "loanId", label: "ID wniosku", type: "text", sortable: true, filterable: true },
  { key: "customerName", label: "Klient", type: "text", sortable: true, filterable: true },
  { key: "status", label: "Status", type: "badge", sortable: true, filterable: true, options: ["new", "approved"] },
  { key: "monthlyRate", label: "Rata", type: "currency", sortable: true },
  { key: "hidden", label: "Ukryta", type: "text", visible: false },
  { key: "canEdit", label: "Edycja", type: "action", action: "edit" },
]

const rows: ApplicationRow[] = [
  {
    loanId: "LN-1",
    customerName: "Anna Woźniak",
    status: "approved",
    market: "PL",
    monthlyRate: 1409.27,
    updatedAt: "2026-01-22T19:00:00Z",
    permissions: { canEdit: true },
  },
  {
    loanId: "LN-2",
    customerName: "Marcin Zieliński",
    status: "new",
    market: "CZ",
    monthlyRate: null,
    updatedAt: null,
    permissions: { canEdit: false },
  },
]

const rowFor = (loanId: string) => screen.getByRole("row", { name: new RegExp(loanId) })

describe("ApplicationsTable", () => {
  it("says what the server reported instead of a generic line", () => {
    const error = new ApplicationsRequestError(500, "Usługa wniosków jest chwilowo niedostępna.")

    render(<ApplicationsTable columns={[]} rows={[]} isError error={error} />)

    expect(screen.getByRole("alert")).toHaveTextContent("Usługa wniosków jest chwilowo niedostępna.")
  })

  it("falls back to the generic line when the thrown value is not ours", () => {
    render(<ApplicationsTable columns={[]} rows={[]} isError error={new Error("TypeError: failed to fetch")} />)

    const alert = screen.getByRole("alert")

    expect(alert).toHaveTextContent("Nie udało się pobrać wniosków.")
    expect(alert).not.toHaveTextContent("failed to fetch")
  })

  //INFO: A pasted link can name a column the metadata has not delivered yet; the table must not be
  //handed a sort or a filter for a column that does not exist
  it("ignores a sort from the URL until the column it names exists", () => {
    const warn = vi.spyOn(console, "error").mockImplementation(() => undefined)

    render(<ApplicationsTable columns={[]} rows={[]} isLoading />, { searchParams: "?sort=updatedAt&order=desc" })

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("applies that sort once the metadata arrives", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />, { searchParams: "?sort=customerName&order=desc" })

    expect(screen.getByRole("columnheader", { name: /Klient/ })).toHaveAttribute("aria-sort", "descending")
  })

  it("builds its header from the metadata and omits a hidden column", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />)

    expect(screen.getByRole("columnheader", { name: /ID wniosku/ })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Rata/ })).toBeInTheDocument()
    expect(screen.queryByRole("columnheader", { name: /Ukryta/ })).not.toBeInTheDocument()
  })

  it("disables the row action when the row lacks the permission", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />)

    expect(within(rowFor("LN-1")).getByRole("button", { name: /Edytuj/ })).toBeEnabled()
    expect(within(rowFor("LN-2")).getByRole("button", { name: /Edytuj/ })).toBeDisabled()
  })

  it("renders a placeholder instead of an empty cell for a missing value", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />)

    expect(within(rowFor("LN-2")).getAllByText("—").length).toBeGreaterThan(0)
  })

  it("marks only sortable columns as sortable for assistive technology", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />)

    expect(screen.getByRole("columnheader", { name: /Klient/ })).toHaveAttribute("aria-sort", "none")
    expect(screen.getByRole("columnheader", { name: /Edycja/ })).not.toHaveAttribute("aria-sort", "ascending")
  })

  it("narrows the rows by a search written without diacritics", async () => {
    const user = userEvent.setup()

    render(<ApplicationsTable columns={columns} rows={rows} />)
    await user.type(screen.getByRole("searchbox", { name: /Szukaj/ }), "wozniak")

    //INFO: The view state round-trips through the URL, so the narrowing lands on a later tick
    await waitFor(() => expect(screen.queryByText("LN-2")).not.toBeInTheDocument())
    expect(screen.getByText("LN-1")).toBeInTheDocument()
  })

  it("filters by the status taken from the metadata options", async () => {
    const user = userEvent.setup()

    render(<ApplicationsTable columns={columns} rows={rows} />)
    await user.selectOptions(screen.getByRole("combobox", { name: /Status/ }), "new")

    await waitFor(() => expect(screen.queryByText("LN-1")).not.toBeInTheDocument())
    expect(screen.getByText("LN-2")).toBeInTheDocument()
  })

  it("offers a retry from the error state", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ApplicationsTable columns={columns} rows={[]} isError onRetry={onRetry} />)
    await user.click(screen.getByRole("button", { name: /Spróbuj ponownie/ }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("shows a retry in flight instead of leaving the button looking inert", () => {
    render(<ApplicationsTable columns={columns} rows={[]} isError isRetrying onRetry={() => undefined} />)

    const retry = screen.getByRole("button", { name: /Ponawianie/ })

    expect(retry).toBeDisabled()
    expect(screen.queryByRole("button", { name: /Spróbuj ponownie/ })).not.toBeInTheDocument()
  })

  it("says the loading state out loud, because skeleton cells are visual only", () => {
    const { rerender } = render(<ApplicationsTable columns={columns} rows={[]} isLoading />)

    expect(screen.getByRole("status")).toHaveTextContent("Ładowanie wniosków")

    rerender(<ApplicationsTable columns={columns} rows={rows} />)

    expect(screen.getByRole("status")).toHaveTextContent(`Załadowano ${rows.length} wniosków`)
  })

  it("gives the table an accessible name, so it is not announced as an unlabelled grid", () => {
    render(<ApplicationsTable columns={columns} rows={rows} />)

    expect(screen.getByRole("table", { name: "Lista wniosków kredytowych" })).toBeInTheDocument()
  })
})
