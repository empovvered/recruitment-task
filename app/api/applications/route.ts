import { ApplicationRow, ApplicationsPayload, ColumnMeta } from "api/apiActions/applications/applications.types"
import columnsFixture from "data/columns.json"
import rowsFixture from "data/rows.json"

//INFO: Imported statically, not read from disk, so the payload stays in the server bundle
const columns = columnsFixture as unknown as ColumnMeta[]
const rows = rowsFixture as unknown as ApplicationRow[]

const MAX_DELAY_MS = 5_000

const readDelayMs = (value: Nullable<string>) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) return 0

  return Math.min(Math.trunc(parsed), MAX_DELAY_MS)
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const delayMs = readDelayMs(searchParams.get("delay"))

  if (delayMs > 0) await wait(delayMs)

  if (searchParams.get("fail") === "1") {
    return Response.json({ message: "The applications service is unavailable." }, { status: 500 })
  }

  const payload: ApplicationsPayload = {
    columns,
    rows: searchParams.get("empty") === "1" ? [] : rows,
  }

  return Response.json(payload)
}
