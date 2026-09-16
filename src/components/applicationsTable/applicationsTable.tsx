"use client"

import type { FilterFn } from "@tanstack/react-table"
import type { ApplicationRow } from "api/apiActions/applications/applications.types"
import { Select } from "components/form/fields/select/select"
import { Search } from "components/search/search"
import { Table } from "components/table/table"
import { PAGE_SIZES } from "constants/pagination"
import { useQueryTableState } from "hooks/useQueryTableState/useQueryTableState"
import { useMemo } from "react"

import { buildColumnDefs } from "./applicationsTable.columns"
import type { ApplicationsTableProps } from "./applicationsTable.types"
import { getSearchableColumns, matchesSearch } from "./applicationsTable.utils"

const STATUS_LABELS: Record<string, string> = {
  new: "Nowy",
  in_review: "W weryfikacji",
  approved: "Zaakceptowany",
  rejected: "Odrzucony",
}

export const ApplicationsTable = ({ columns, rows, isLoading, isError, onRetry }: ApplicationsTableProps) => {
  const { sorting, setSorting, columnFilters, status, setStatus, search, setSearch, pagination, setPagination } =
    useQueryTableState()

  const columnDefs = useMemo(() => buildColumnDefs(columns), [columns])
  const searchableColumns = useMemo(() => getSearchableColumns(columns), [columns])

  // The status options come from the metadata, so a new status in the JSON appears in the filter.
  const statusFilterOptions = useMemo(() => {
    const statusColumn = columns.find((column) => column.type === "badge")
    const options = statusColumn?.type === "badge" ? statusColumn.options : []

    return [
      { value: "", label: "Wszystkie" },
      ...options.map((option) => ({ value: option, label: STATUS_LABELS[option] ?? option })),
    ]
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Search
          label="Szukaj"
          value={search}
          onValueChange={setSearch}
          placeholder="ID wniosku lub klient"
          className="w-64"
          testId="applications-search"
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={statusFilterOptions}
          testId="applications-status-filter"
        />
      </div>

      <Table
        columns={columnDefs}
        data={rows}
        isLoading={isLoading}
        testId="applications-table"
        pageSizes={PAGE_SIZES}
        emptyState={<p className="text-slate-500">Brak wniosków spełniających kryteria.</p>}
        globalFilterFn={searchFilterFn}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={() => undefined}
        globalFilter={search}
        setGlobalFilter={(updater) => setSearch(String(typeof updater === "function" ? updater(search) : updater))}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}
