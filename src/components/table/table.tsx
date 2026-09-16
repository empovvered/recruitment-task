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
import { TableCell } from "./components/cell/cell"
import { CellSkeleton } from "./components/cell/cell.loading"
import { TableHead } from "./components/head"
import { TableHeadCell } from "./components/headCell"
import { TableRow } from "./components/row"
import type { TableProps } from "./table.types"
import { getPaginationWithoutPageIndexOffset, getPaginationWithPageIndexOffset } from "./table.utils"

const LOADING_ROW_COUNT = 8
const loadingData = Array.from({ length: LOADING_ROW_COUNT }, () => ({}))

export const Table = <Data, Value>({
  className,
  classNames,
  columns,
  data,
  isLoading = false,
  emptyState,
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
  const rows = useMemo(() => (isLoading ? (loadingData as Data[]) : data), [data, isLoading])
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

  return (
    <div
      data-testid={testId}
      className={cn("overflow-x-auto rounded-lg border border-slate-200 bg-white", classNames?.wrapper, className)}
    >
      <table className={cn("w-full border-collapse", classNames?.table)}>
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
          {isEmpty ? (
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
