import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table"

export const SORT_ORDERS = ["asc", "desc"] as const

export type QueryTableState = {
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  status: string
  setStatus: (status: string) => void
  search: string
  setSearch: (search: string) => void
  pagination: PaginationState
  setPagination: OnChangeFn<PaginationState>
}
