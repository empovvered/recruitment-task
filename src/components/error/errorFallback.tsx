"use client"

import type { FallbackProps } from "react-error-boundary"

import { ErrorState } from "./errorState"

/**
 * Shown when rendering throws rather than when a request fails: a column type the renderer does not
 * know, a value of an unexpected shape. Retrying re-renders the subtree with the same data, which is
 * enough when the cause was transient and honest about it when it was not.
 */
export const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => (
  <ErrorState
    title="Nie udało się wyświetlić wniosków."
    description="Wystąpił nieoczekiwany błąd podczas renderowania listy."
    onRetry={resetErrorBoundary}
  />
)
