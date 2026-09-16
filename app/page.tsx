import { ApplicationsScenario } from "api/apiActions/applications/applications.types"

import { ApplicationsList } from "./_components/applicationsList/applicationsList"

const readScenario = ({ delay, fail, empty }: Record<string, string | string[] | undefined>): ApplicationsScenario => ({
  delayMs: Number(delay) || undefined,
  fail: fail === "1",
  empty: empty === "1",
})

export default async function Home({ searchParams }: PageProps<"/">) {
  const scenario = readScenario(await searchParams)

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-xl font-semibold">Applications</h1>
      <ApplicationsList scenario={scenario} />
    </main>
  )
}
