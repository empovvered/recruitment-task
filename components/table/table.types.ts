import type { ColumnDef, ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table"
import type { ReactNode } from "react"

export type TableProps<Data, Value> = {
  className?: string
  columns: ColumnDef<Data, Value>[]
  data: Data[]
  /** While true the cells render skeletons, so the table keeps its shape instead of collapsing. */
  isLoading?: boolean
  emptyState: ReactNode
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  setColumnFilters: OnChangeFn<ColumnFiltersState>
  globalFilter: string
  setGlobalFilter: OnChangeFn<string>
  pagination: PaginationState
  setPagination: OnChangeFn<PaginationState>
}
