import type { AccessorFnColumnDef, SortingFn } from "@tanstack/react-table"
import type { ApplicationRow, ColumnMeta, ColumnType } from "api/apiActions/applications/applications.types"

import { MISSING_VALUE } from "./applicationsTable.constants"
import {
  compareDate,
  compareNumber,
  compareText,
  formatCurrency,
  formatDate,
  getVisibleColumns,
  readCellValue,
} from "./applicationsTable.utils"
import { RowAction } from "./components/rowAction"
import { StatusBadge } from "./components/statusBadge"

type CellValue = string | number | boolean | null | undefined

const sortingFnByType: Record<ColumnType, SortingFn<ApplicationRow>> = {
  text: (first, second, id) => compareText(first.getValue(id), second.getValue(id)),
  badge: (first, second, id) => compareText(first.getValue(id), second.getValue(id)),
  number: (first, second, id) => compareNumber(first.getValue(id), second.getValue(id)),
  currency: (first, second, id) => compareNumber(first.getValue(id), second.getValue(id)),
  date: (first, second, id) => compareDate(first.getValue(id), second.getValue(id)),
  action: () => 0,
}

/**
 * The switch is exhaustive over the discriminated union: adding a column type to the model without
 * teaching this renderer about it is a compile error, not a blank cell discovered in review.
 */
const renderCell = (row: ApplicationRow, column: ColumnMeta) => {
  const value = readCellValue(row, column) as CellValue

  switch (column.type) {
    case "text":
      return value ?? MISSING_VALUE
    case "number":
      return value === null || value === undefined
        ? MISSING_VALUE
        : new Intl.NumberFormat("pl-PL").format(Number(value))
    case "currency":
      return value === null || value === undefined ? MISSING_VALUE : formatCurrency(Number(value), row.market)
    case "date":
      return value === null || value === undefined ? MISSING_VALUE : formatDate(String(value))
    case "badge":
      return <StatusBadge status={row.status} />
    case "action":
      return <RowAction action={column.action} isEnabled={value === true} loanId={row.loanId} />
    default: {
      const exhaustive: never = column

      return exhaustive
    }
  }
}

/**
 * The single place where metadata becomes a table. Nothing downstream hard-codes a column.
 */
export const buildColumnDefs = (columns: ColumnMeta[]): AccessorFnColumnDef<ApplicationRow, CellValue>[] =>
  getVisibleColumns(columns).map((column) => ({
    id: column.key,
    header: column.label,
    // `sortUndefined` only recognises `undefined`, so a null from the payload is mapped here.
    accessorFn: (row) => (readCellValue(row, column) ?? undefined) as CellValue,
    enableSorting: column.sortable === true,
    sortUndefined: "last",
    sortingFn: sortingFnByType[column.type],
    enableColumnFilter: column.filterable === true,
    filterFn: column.type === "badge" ? "equalsString" : "includesString",
    cell: ({ row }) => renderCell(row.original, column),
  }))
