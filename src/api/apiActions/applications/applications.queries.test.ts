import { isApplicationsRequestError } from "./applications.errors"
import { applicationsQueries } from "./applications.queries"
import type { ApplicationsPayload, ApplicationsScenario } from "./applications.types"

const runList = (scenario: ApplicationsScenario = {}) => {
  const { queryFn } = applicationsQueries.list(scenario)

  return (queryFn as (context: { signal: AbortSignal }) => Promise<ApplicationsPayload>)({
    signal: new AbortController().signal,
  })
}

const mockFetch = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response)

  vi.stubGlobal("fetch", fetchMock)

  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("applicationsQueries.list", () => {
  it("puts the scenario in the query string, so the states stay reachable from a link", async () => {
    const fetchMock = mockFetch(Response.json({ columns: [], rows: [] }))

    await runList({ delayMs: 800, empty: true })

    expect(fetchMock).toHaveBeenCalledWith("/api/applications?delay=800&empty=1", expect.anything())
  })

  it("asks for the bare endpoint when there is no scenario", async () => {
    const fetchMock = mockFetch(Response.json({ columns: [], rows: [] }))

    await runList()

    expect(fetchMock).toHaveBeenCalledWith("/api/applications", expect.anything())
  })

  it("reports the reason the server gave", async () => {
    mockFetch(Response.json({ message: "Usługa jest niedostępna." }, { status: 500 }))

    await expect(runList()).rejects.toThrow("Usługa jest niedostępna.")
  })

  it("falls back when the body carries no message", async () => {
    mockFetch(Response.json({}, { status: 500 }))

    await expect(runList()).rejects.toThrow("Serwer nie zwrócił powodu niepowodzenia.")
  })

  it("falls back when the message is present but empty, rather than showing no reason at all", async () => {
    mockFetch(Response.json({ message: "   " }, { status: 500 }))

    await expect(runList()).rejects.toThrow("Serwer nie zwrócił powodu niepowodzenia.")
  })

  it("survives a body that is not JSON, such as a proxy error page", async () => {
    mockFetch(new Response("<html>502 Bad Gateway</html>", { status: 502 }))

    await expect(runList()).rejects.toThrow("Serwer nie zwrócił powodu niepowodzenia.")
  })

  it("marks its failures as its own, so the panel knows the text is safe to show", async () => {
    mockFetch(Response.json({ message: "Powód." }, { status: 500 }))

    await expect(runList()).rejects.toSatisfy(isApplicationsRequestError)
  })
})
