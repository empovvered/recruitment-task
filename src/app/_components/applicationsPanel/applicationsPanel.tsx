"use client"

import { useQuery } from "@tanstack/react-query"
import { applicationsQueries } from "api/apiActions/applications/applications.queries"
import { ApplicationsScenario } from "api/apiActions/applications/applications.types"
import { ApplicationsTable } from "components/applicationsTable/applicationsTable"
import { ErrorBoundary } from "components/error/errorBoundary"
import { ErrorFallback } from "components/error/errorFallback"

type ApplicationsPanelProps = {
  scenario: ApplicationsScenario
}

/**
 * The only place that joins fetching to presentation. The table takes plain props, so it stays
 * testable without a network and the data layer stays free to change underneath it.
 */
export const ApplicationsPanel = ({ scenario }: ApplicationsPanelProps) => {
  const { data, isPending, isError, isFetching, refetch } = useQuery(applicationsQueries.list(scenario))

  return (
    //INFO: A throwing row takes down the table, not the page around it, and stays recoverable
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
      <ApplicationsTable
        columns={data?.columns ?? []}
        rows={data?.rows ?? []}
        isLoading={isPending}
        isError={isError}
        isRetrying={isFetching}
        onRetry={() => void refetch()}
      />
    </ErrorBoundary>
  )
}
