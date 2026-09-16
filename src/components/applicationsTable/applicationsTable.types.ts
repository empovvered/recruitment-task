import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"

export type ApplicationsTableProps = {
  columns: ColumnMeta[]
  rows: ApplicationRow[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export type TableViewState = {
  sorting: { id: string; desc: boolean }[]
  columnFilters: { id: string; value: unknown }[]
  globalFilter: string
  pagination: { pageIndex: number; pageSize: number }
}

export type TableViewAction =
  | { type: "setSorting"; sorting: TableViewState["sorting"] }
  | { type: "setStatus"; status: string }
  | { type: "setSearch"; search: string }
  | { type: "setPagination"; pagination: TableViewState["pagination"] }
