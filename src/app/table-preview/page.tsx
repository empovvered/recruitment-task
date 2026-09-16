"use client"

import { useQuery } from "@tanstack/react-query"
import type { ApplicationsPayload } from "api/apiActions/applications/applications.types"
import { ApplicationsTable } from "components/applicationsTable/applicationsTable"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

/**
 * TEMPORARY preview route for the table branch. The real panel lives on `/`; delete this on merge.
 */
const TablePreview = () => {
  const searchParams = useSearchParams()
  const search = searchParams.toString()

  const { data, isPending, isError, refetch } = useQuery({
    // The scenario params belong in the key: a client component does not remount when they change,
    // so a bare key would keep serving the cached success and ?fail=1 would never show the error.
    queryKey: ["applications", "list", search],
    queryFn: async (): Promise<ApplicationsPayload> => {
      const response = await fetch(`/api/applications${search ? `?${search}` : ""}`)

      if (!response.ok) throw new Error(`Applications request failed with ${response.status}`)

      return response.json()
    },
  })

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Panel wniosków</h1>
      <ApplicationsTable
        columns={data?.columns ?? []}
        rows={data?.rows ?? []}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </main>
  )
}

/**
 * useSearchParams opts the subtree into client-side rendering, so it needs a Suspense boundary or
 * the prerender fails at build time — a dev server never surfaces this.
 */
const TablePreviewPage = () => (
  <Suspense fallback={null}>
    <TablePreview />
  </Suspense>
)

export default TablePreviewPage
