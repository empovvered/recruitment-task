import { ApplicationsScenario } from "api/apiActions/applications/applications.types"

import { ApplicationsPanel } from "./_components/applicationsPanel/applicationsPanel"

/**
 * The scenario switches live in the URL so every state — loading, success, empty and error — can be
 * reached in a review without editing code: ?delay=800, ?empty=1, ?fail=1.
 */
const readScenario = ({ delay, fail, empty }: Record<string, string | string[] | undefined>): ApplicationsScenario => ({
  delayMs: Number(delay) || undefined,
  fail: fail === "1",
  empty: empty === "1",
})

export default async function Home({ searchParams }: PageProps<"/">) {
  const scenario = readScenario(await searchParams)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Panel wniosków</h1>
      <ApplicationsPanel scenario={scenario} />
    </main>
  )
}
