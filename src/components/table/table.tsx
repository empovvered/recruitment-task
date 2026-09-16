"use client"

//INFO: Prevents the React Compiler from memoizing the table; useReactTable returns functions that
//cannot be memoized safely, which would leave stale UI.
"use no memo"

import type { FilterFn } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Pagination } from "components/pagination/pagination"
import { useMemo } from "react"
import { cn } from "utils/cn"

import { TableBody } from "./components/body"
import { TableCaption } from "./components/caption"
import { TableCell } from "./components/cell/cell"
import { CellSkeleton } from "./components/cell/cell.loading"
import { TableHead } from "./components/head"
import { TableHeadCell } from "./components/headCell"
import { TableRow } from "./components/row"
import type { TableProps } from "./table.types"
import { getPaginationWithoutPageIndexOffset, getPaginationWithPageIndexOffset } from "./table.utils"

//INFO: Only used before a page size is known; otherwise the placeholder fills the page the data will
const LOADING_ROW_COUNT = 8

export const Table = <Data, Value>({
  className,
  classNames,
  columns,
  data,
  isLoading = false,
  emptyState,
  caption,
  testId,
  pageCount,
  pageSizes,
  globalFilterFn,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
  pagination,
  setPagination,
}: TableProps<Data, Value> & { globalFilterFn?: FilterFn<Data> }) => {
  const hasPagination = Boolean(pagination && setPagination)
  /**
   * Loading swaps the cell renderers for skeletons rather than replacing the table with a spinner,
   * so the header, column widths and row count stay put and the layout does not jump on arrival.
   */
  const skeletonRowCount = pagination?.pageSize ?? LOADING_ROW_COUNT
  const loadingData = useMemo(() => Array.from({ length: skeletonRowCount }, () => ({}) as Data), [skeletonRowCount])
  const rows = useMemo(() => (isLoading ? loadingData : data), [data, isLoading, loadingData])
  const renderedColumns = useMemo(
    () => (isLoading ? columns.map((column) => ({ ...column, cell: () => <CellSkeleton /> })) : columns),
    [columns, isLoading],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: renderedColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...(pagination ? { pagination: getPaginationWithPageIndexOffset(pagination) } : {}),
    },
    pageCount,
    //INFO: The page is reset deliberately when a filter narrows the result. Leaving the automatic reset on
    //would also fire when the rows arrive, throwing away a page number restored from the URL.
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (!pagination || !setPagination) return

      const zeroBased = getPaginationWithPageIndexOffset(pagination)
      const next = typeof updater === "function" ? updater(zeroBased) : updater

      setPagination(getPaginationWithoutPageIndexOffset(next))
    },
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(hasPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  })

  const bodyRows = table.getRowModel().rows
  const isEmpty = !isLoading && bodyRows.length === 0
  /**
   * The columns arrive with the rows, so the first load has nothing to hang per-cell skeletons on and
   * the swapped renderers produce eight empty rows. Until the metadata is known the placeholder is a
   * stack of bars, which reads as loading rather than as a table that failed to fill.
   */
  const hasColumnsToSkeleton = table.getAllColumns().length > 0

  return (
    <div
      data-testid={testId}
      aria-busy={isLoading}
      className={cn("rounded-lg border border-slate-200 bg-white", classNames?.wrapper, className)}
    >
      {/* Skeleton cells are a visual cue only; a screen reader needs the state said out loud. */}
      <p role="status" className="sr-only">
        {isLoading ? "Ładowanie wniosków" : `Załadowano ${table.getFilteredRowModel().rows.length} wniosków`}
      </p>
      {/*
       * Only the table scrolls sideways. With the pagination inside this box too, reaching the last
       * column on a phone pushed the page controls off screen along with it.
       */}
      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse", classNames?.table)}>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeadCell key={header.id} header={header} />
                ))}
              </tr>
            ))}
          </TableHead>
          <TableBody>
            {isLoading && !hasColumnsToSkeleton ? (
              Array.from({ length: skeletonRowCount }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <CellSkeleton className="w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-4 py-10 text-center">
                  {emptyState}
                </td>
              </tr>
            ) : (
              bodyRows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
      {hasPagination && !isEmpty && !isLoading && (
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          pageSizes={pageSizes}
          totalRows={table.getFilteredRowModel().rows.length}
          onPrevious={table.previousPage}
          onNext={table.nextPage}
          onPageSizeChange={table.setPageSize}
        />
      )}
    </div>
  )
}
