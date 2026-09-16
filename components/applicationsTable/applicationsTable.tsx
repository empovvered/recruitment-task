"use client"

import type { FilterFn, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table"
import type { ApplicationRow } from "api/apiActions/applications/applications.types"
import { Table } from "components/table/table"
import { useMemo, useReducer } from "react"

import { buildColumnDefs } from "./applicationsTable.columns"
import { initialTableViewState, STATUS_COLUMN_ID, tableViewReducer } from "./applicationsTable.state"
import type { ApplicationsTableProps } from "./applicationsTable.types"
import { getSearchableColumns, matchesSearch } from "./applicationsTable.utils"

const STATUS_LABELS: Record<string, string> = {
  new: "Nowy",
  in_review: "W weryfikacji",
  approved: "Zaakceptowany",
  rejected: "Odrzucony",
}

export const ApplicationsTable = ({ columns, rows, isLoading, isError, onRetry }: ApplicationsTableProps) => {
  const [view, dispatch] = useReducer(tableViewReducer, initialTableViewState)

  const columnDefs = useMemo(() => buildColumnDefs(columns), [columns])
  const searchableColumns = useMemo(() => getSearchableColumns(columns), [columns])

  // The status options come from the metadata, so a new status in the JSON appears in the filter.
  const statusOptions = useMemo(() => {
    const statusColumn = columns.find((column) => column.type === "badge")

    return statusColumn?.type === "badge" ? statusColumn.options : []
  }, [columns])

  const searchFilterFn: FilterFn<ApplicationRow> = (row, _columnId, value) =>
    matchesSearch(row.original, searchableColumns, String(value))

  if (isError) {
    return (
      <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="font-medium text-rose-900">Nie udało się pobrać wniosków.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  const selectedStatus = String(view.columnFilters.find(({ id }) => id === STATUS_COLUMN_ID)?.value ?? "")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Szukaj</span>
          <input
            type="search"
            value={view.globalFilter}
            onChange={(event) => dispatch({ type: "setSearch", search: event.target.value })}
            placeholder="ID wniosku lub klient"
            className="w-64 rounded border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Status</span>
          <select
            value={selectedStatus}
            onChange={(event) => dispatch({ type: "setStatus", status: event.target.value })}
            className="rounded border border-slate-300 px-3 py-2"
          >
            <option value="">Wszystkie</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status] ?? status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Table
        columns={columnDefs}
        data={rows}
        isLoading={isLoading}
        emptyState={<p className="text-slate-500">Brak wniosków spełniających kryteria.</p>}
        globalFilterFn={searchFilterFn}
        sorting={view.sorting}
        setSorting={
          ((updater) => {
            const next = typeof updater === "function" ? updater(view.sorting as SortingState) : updater

            dispatch({ type: "setSorting", sorting: next })
          }) as OnChangeFn<SortingState>
        }
        columnFilters={view.columnFilters}
        setColumnFilters={() => undefined}
        globalFilter={view.globalFilter}
        setGlobalFilter={(updater) => {
          const next = typeof updater === "function" ? updater(view.globalFilter) : updater

          dispatch({ type: "setSearch", search: String(next) })
        }}
        pagination={view.pagination}
        setPagination={
          ((updater) => {
            const next = typeof updater === "function" ? updater(view.pagination as PaginationState) : updater

            dispatch({ type: "setPagination", pagination: next })
          }) as OnChangeFn<PaginationState>
        }
      />
    </div>
  )
}
