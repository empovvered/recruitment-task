"use client"

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

const LOADING_ROW_COUNT = 8
const loadingData = Array.from({ length: LOADING_ROW_COUNT }, () => ({}))

export const Table = <Data, Value>({
  className,
  columns,
  data,
  isLoading = false,
  emptyState,
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
  /**
   * Loading swaps the cell renderers for skeletons rather than replacing the table with a spinner,
   * so the header, column widths and row count stay put and the layout does not jump on arrival.
   */
  const rows = useMemo(() => (isLoading ? (loadingData as Data[]) : data), [data, isLoading])
  const renderedColumns = useMemo(
    () => (isLoading ? columns.map((column) => ({ ...column, cell: () => <CellSkeleton /> })) : columns),
    [columns, isLoading],
  )

  const table = useReactTable({
    data: rows,
    columns: renderedColumns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const bodyRows = table.getRowModel().rows
  const isEmpty = !isLoading && bodyRows.length === 0

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-slate-200 bg-white", className)}>
      <table className="w-full border-collapse">
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
      {!isEmpty && !isLoading && (
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          totalRows={table.getFilteredRowModel().rows.length}
          onPrevious={table.previousPage}
          onNext={table.nextPage}
        />
      )}
    </div>
  )
}
