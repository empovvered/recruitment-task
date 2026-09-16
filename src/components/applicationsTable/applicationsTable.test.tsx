import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"

import { buildColumnDefs } from "./applicationsTable.columns"
import {
  compareDate,
  compareNumber,
  compareText,
  formatCurrency,
  getSearchableColumns,
  getVisibleColumns,
  matchesSearch,
  readCellValue,
} from "./applicationsTable.utils"

const columns: ColumnMeta[] = [
  { key: "loanId", label: "ID wniosku", type: "text", sortable: true, filterable: true },
  { key: "customerName", label: "Klient", type: "text", sortable: true, filterable: true },
  { key: "monthlyRate", label: "Rata", type: "currency", sortable: true },
  { key: "canEdit", label: "Edycja", type: "action", action: "edit" },
]

const row = (overrides: Partial<ApplicationRow> = {}): ApplicationRow => ({
  loanId: "LN-202600001",
  customerName: "Anna Woźniak",
  status: "approved",
  market: "PL",
  monthlyRate: 1409.27,
  updatedAt: "2026-01-22T19:00:00Z",
  permissions: { canEdit: true },
  ...overrides,
})

describe("column metadata", () => {
  it("drops a hidden column and keeps the rest in metadata order", () => {
    const hidden: ColumnMeta[] = [...columns, { key: "market", label: "Rynek", type: "text", visible: false }]

    expect(getVisibleColumns(hidden).map(({ key }) => key)).toEqual([
      "loanId",
      "customerName",
      "monthlyRate",
      "canEdit",
    ])
  })

  it("honours an explicit order over the array position", () => {
    const reordered: ColumnMeta[] = [
      { key: "second", label: "Second", type: "text", order: 2 },
      { key: "first", label: "First", type: "text", order: 1 },
    ]

    expect(getVisibleColumns(reordered).map(({ key }) => key)).toEqual(["first", "second"])
  })

  it("reads an action column from the row permissions, not from a field of the same name", () => {
    const actionColumn = columns[3]!

    expect(readCellValue(row(), actionColumn)).toBe(true)
    expect(readCellValue(row({ permissions: { canEdit: false } }), actionColumn)).toBe(false)
  })

  it("limits the search surface to filterable text columns", () => {
    expect(getSearchableColumns(columns).map(({ key }) => key)).toEqual(["loanId", "customerName"])
  })
})

describe("sorting with missing values", () => {
  it("stays total when a value is missing, rather than producing NaN", () => {
    // Keeping gaps at the bottom in both directions is `sortUndefined: "last"` on the column, not
    // the comparator's job: the table negates a comparator result for a descending sort.
    expect(compareText("Anna", undefined)).not.toBeNaN()
    expect(compareNumber(1, null)).toBe(1)
    expect(compareDate("2026-01-18T11:45:00Z", null)).toBeGreaterThan(0)
    expect(compareDate("not-a-date", null)).not.toBeNaN()
  })

  it("orders numbers and dates by value, not lexically", () => {
    expect(compareNumber(9, 100)).toBeLessThan(0)
    expect(compareDate("2026-02-07T13:00:00Z", "2026-01-18T11:45:00Z")).toBeGreaterThan(0)
  })

  it("compares text by Polish collation rather than code points", () => {
    expect(compareText("Łukasz", "Zofia")).toBeLessThan(0)
  })
})

describe("search and formatting", () => {
  it("matches a name written without diacritics", () => {
    expect(matchesSearch(row(), getSearchableColumns(columns), "wozniak")).toBe(true)
    expect(matchesSearch(row(), getSearchableColumns(columns), "kowalski")).toBe(false)
  })

  it("renders a bare number when the market maps to no known currency", () => {
    expect(formatCurrency(1409.27, "PL")).toContain("zł")
    expect(formatCurrency(1409.27, "XX")).not.toMatch(/[A-Z]{3}|zł|€/)
  })
})

describe("buildColumnDefs", () => {
  it("takes sortability and filterability from the metadata, never from the column name", () => {
    const [loanId, , monthlyRate, canEdit] = buildColumnDefs(columns)

    expect(loanId?.enableSorting).toBe(true)
    expect(loanId?.enableColumnFilter).toBe(true)
    expect(monthlyRate?.enableSorting).toBe(true)
    expect(monthlyRate?.enableColumnFilter).toBe(false)
    expect(canEdit?.enableSorting).toBe(false)
  })

  it("keeps gaps at the bottom in both directions via sortUndefined", () => {
    // This is the property a comparator cannot own, because the table negates it for a desc sort.
    expect(buildColumnDefs(columns).every((def) => def.sortUndefined === "last")).toBe(true)
  })

  it("maps a null value to undefined so sortUndefined can recognise it", () => {
    const [, customerName] = buildColumnDefs(columns)
    const accessor = customerName?.accessorFn

    expect(accessor?.(row({ customerName: null }), 0)).toBeUndefined()
    expect(accessor?.(row(), 0)).toBe("Anna Woźniak")
  })
})
