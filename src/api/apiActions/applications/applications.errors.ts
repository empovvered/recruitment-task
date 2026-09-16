/**
 * Carries what the response said rather than a string written at the call site. The route reports
 * an unavailable service and fixtures that do not match their contract differently, and a reader who
 * sees only "could not load" looks in the wrong place.
 *
 * The type exists so the panel can tell a message it may show from one it may not: a network failure
 * surfaces as a plain Error whose text is written for developers.
 */
export class ApplicationsRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApplicationsRequestError"
  }
}

export const isApplicationsRequestError = (error: unknown): error is ApplicationsRequestError =>
  error instanceof ApplicationsRequestError
