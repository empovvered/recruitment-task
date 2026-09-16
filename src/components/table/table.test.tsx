import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "tests"

import { Table } from "./table"

type Row = { id: string; name: string }

const columns: ColumnDef<Row, unknown>[] = [
  { id: "id", header: "ID", accessorFn: (row) => row.id },
  { id: "name", header: "Nazwa", accessorFn: (row) => row.name },
]

const rows: Row[] = [{ id: "LN-1", name: "Anna" }]

const renderTable = (props: Partial<Parameters<typeof Table<Row, unknown>>[0]> = {}) =>
  render(
    <Table<Row, unknown>
      caption="Wnioski"
      columns={columns}
      data={rows}
      emptyState={<p>Brak wyników.</p>}
      sorting={[]}
      setSorting={() => undefined}
      columnFilters={[]}
      setColumnFilters={() => undefined}
      globalFilter=""
      setGlobalFilter={() => undefined}
      {...props}
    />,
  )

describe("Table", () => {
  it("renders a row per record once the data is there", () => {
    renderTable()

    expect(screen.getByRole("cell", { name: "LN-1" })).toBeInTheDocument()
    expect(screen.queryAllByTestId("skeleton")).toHaveLength(0)
  })

  it("shows the empty state instead of a bare table", () => {
    renderTable({ data: [] })

    expect(screen.getByText("Brak wyników.")).toBeInTheDocument()
  })

  it("keeps the shape and skeletons the cells while loading known columns", () => {
    renderTable({ isLoading: true })

    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
  })

  //INFO: The metadata arrives with the rows, so the first load has no columns to hang cell skeletons on
  it("still shows a loading placeholder when the columns are not known yet", () => {
    renderTable({ isLoading: true, columns: [], data: [] })

    expect(screen.queryAllByRole("columnheader")).toHaveLength(0)
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
  })

  it("marks itself busy and says so for a screen reader", () => {
    renderTable({ isLoading: true, testId: "table" })

    expect(screen.getByTestId("table")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Ładowanie wniosków")
  })
})
