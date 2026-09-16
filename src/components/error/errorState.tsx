import type { ErrorStateProps } from "./errorState.types"

//INFO: One presentation for every failure the panel can show: a failed query, and a render that threw
export const ErrorState = ({ title, description, onRetry, retryLabel = "Spróbuj ponownie" }: ErrorStateProps) => (
  <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
    <p className="font-medium text-rose-900">{title}</p>
    {description && <p className="mt-1 text-sm text-rose-800">{description}</p>}
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
      >
        {retryLabel}
      </button>
    )}
  </div>
)
