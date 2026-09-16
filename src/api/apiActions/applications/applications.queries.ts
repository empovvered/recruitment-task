import { queryOptions } from "@tanstack/react-query"

import { ApplicationsPayload, ApplicationsScenario } from "./applications.types"

const buildSearchParams = ({ delayMs, fail, empty }: ApplicationsScenario) => {
  const params = new URLSearchParams()

  if (delayMs) params.set("delay", String(delayMs))

  if (fail) params.set("fail", "1")

  if (empty) params.set("empty", "1")

  return params.toString()
}

const getApplications = async (scenario: ApplicationsScenario, signal: AbortSignal) => {
  const query = buildSearchParams(scenario)
  //INFO: The signal comes from React Query, so a dropped query stops the request instead of leaving it in flight
  const response = await fetch(query ? `/api/applications?${query}` : "/api/applications", { signal })

  //INFO: React Query reports isError only when the query function throws
  if (!response.ok) throw new Error("Failed to load applications")

  return (await response.json()) as ApplicationsPayload
}

export const applicationsQueries = {
  all: () => ["applications"],
  lists: () => [...applicationsQueries.all(), "lists"],
  //INFO: The scenario belongs in the key: the client does not remount on a search param change, so a
  //bare key would keep serving the cached success instead of refetching
  list: (scenario: ApplicationsScenario) =>
    queryOptions({
      queryKey: [...applicationsQueries.lists(), scenario],
      queryFn: ({ signal }) => getApplications(scenario, signal),
    }),
}
