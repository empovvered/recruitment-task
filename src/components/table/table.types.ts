import type { ColumnDef, ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table"
import type { ReactNode } from "react"

export type TableClassNames = {
  wrapper?: string
  table?: string
  head?: string
  row?: string
  cell?: string
}

export type TableProps<Data, Value> = {
  className?: string
  classNames?: TableClassNames
  columns: ColumnDef<Data, Value>[]
  data: Data[]
  /** While true the cells render skeletons, so the table keeps its shape instead of collapsing. */
  isLoading?: boolean
  emptyState: ReactNode
  testId?: string
  /** Supplied by the caller when the page count comes from a backend rather than the loaded rows. */
  pageCount?: number
  pageSizes?: number[]
  /** 1-based; see table.utils. Omit it together with setPagination to render every row. */
  pagination?: PaginationState
  setPagination?: OnChangeFn<PaginationState>
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  setColumnFilters: OnChangeFn<ColumnFiltersState>
  globalFilter: string
  setGlobalFilter: OnChangeFn<string>
}
