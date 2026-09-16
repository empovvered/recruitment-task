"use client"

import { useQuery } from "@tanstack/react-query"
import { applicationsQueries } from "api/apiActions/applications/applications.queries"
import { ApplicationsScenario } from "api/apiActions/applications/applications.types"
import { ApplicationsTable } from "components/applicationsTable/applicationsTable"

type ApplicationsPanelProps = {
  scenario: ApplicationsScenario
}

/**
 * The only place that joins fetching to presentation. The table takes plain props, so it stays
 * testable without a network and the data layer stays free to change underneath it.
 */
export const ApplicationsPanel = ({ scenario }: ApplicationsPanelProps) => {
  const { data, isPending, isError, refetch } = useQuery(applicationsQueries.list(scenario))

  return (
    <ApplicationsTable
      columns={data?.columns ?? []}
      rows={data?.rows ?? []}
      isLoading={isPending}
      isError={isError}
      onRetry={() => void refetch()}
    />
  )
}
