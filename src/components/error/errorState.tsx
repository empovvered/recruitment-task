import { Button } from "components/button/button"

import type { ErrorStateProps } from "./errorState.types"

//INFO: One presentation for every failure the panel can show: a failed query, and a render that threw
export const ErrorState = ({
  title,
  description,
  onRetry,
  retryLabel = "Spróbuj ponownie",
  isRetrying = false,
}: ErrorStateProps) => (
  <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
    <p className="font-medium text-rose-900">{title}</p>
    {description && <p className="mt-1 text-sm text-rose-800">{description}</p>}
    {onRetry && (
      <Button variant="primary" testId="errorStateRetry" onClick={onRetry} isLoading={isRetrying} className="mt-3">
        {isRetrying ? "Ponawianie…" : retryLabel}
      </Button>
    )}
  </div>
)
