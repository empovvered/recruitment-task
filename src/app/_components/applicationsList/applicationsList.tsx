"use client"

import { useQuery } from "@tanstack/react-query"
import { applicationsQueries } from "api/apiActions/applications/applications.queries"
import { ApplicationsScenario } from "api/apiActions/applications/applications.types"

type ApplicationsListProps = {
  scenario: ApplicationsScenario
}

//INFO: A placeholder that proves the data layer; the metadata driven panel replaces it
export const ApplicationsList = ({ scenario }: ApplicationsListProps) => {
  const { data, isPending, isError, isFetching, refetch } = useQuery(applicationsQueries.list(scenario))

  if (isPending) {
    return (
      <p role="status" className="text-sm text-zinc-500">
        Loading applications…
      </p>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="text-sm text-red-700">The applications could not be loaded.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {isFetching ? "Retrying…" : "Try again"}
        </button>
      </div>
    )
  }

  if (data.rows.length === 0) {
    return (
      <p role="status" className="text-sm text-zinc-500">
        No applications match the current view.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-zinc-500">
        {data.rows.length} applications, {data.columns.length} columns described by the metadata.
      </p>
      <ul className="text-sm">
        {data.rows.slice(0, 5).map(({ loanId, customerName, status }) => (
          <li key={loanId}>
            {loanId} — {customerName ?? "—"} — {status}
          </li>
        ))}
      </ul>
    </div>
  )
}
