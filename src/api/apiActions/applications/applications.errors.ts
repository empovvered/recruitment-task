/**
 * Carries what the response said rather than a string written at the call site. The two failures the
 * route can report — the service being unavailable and the fixtures not matching their contract — are
 * different problems, and a reader who sees only "could not load" looks in the wrong place.
 */
export class ApplicationsRequestError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApplicationsRequestError"
    this.status = status
  }
}

export const isApplicationsRequestError = (error: unknown): error is ApplicationsRequestError =>
  error instanceof ApplicationsRequestError
