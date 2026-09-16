import { applicationsPayloadSchema } from "api/apiActions/applications/applications.schema"
import columnsFixture from "data/columns.json"
import rowsFixture from "data/rows.json"

//INFO: Imported statically, not read from disk, so the payload stays in the server bundle
//INFO: Parsed once per server instance rather than per request; 1200 rows are not worth revalidating
const parsedPayload = applicationsPayloadSchema.safeParse({ columns: columnsFixture, rows: rowsFixture })

const MAX_DELAY_MS = 5_000

const readDelayMs = (value: Nullable<string>) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) return 0

  return Math.min(Math.trunc(parsed), MAX_DELAY_MS)
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const GET = async (request: Request) => {
  /**
   * Malformed metadata is the one failure the UI cannot render its way out of: an unknown column
   * type has no cell renderer. Reporting it here names the offending path instead of leaving a
   * blank column to be discovered by eye.
   */
  if (!parsedPayload.success) {
    return Response.json(
      { message: "The applications fixtures do not match the expected contract.", issues: parsedPayload.error.issues },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const delayMs = readDelayMs(searchParams.get("delay"))

  if (delayMs > 0) await wait(delayMs)

  if (searchParams.get("fail") === "1") {
    return Response.json({ message: "The applications service is unavailable." }, { status: 500 })
  }

  const { columns, rows } = parsedPayload.data

  return Response.json({ columns, rows: searchParams.get("empty") === "1" ? [] : rows })
}
