export type ErrorStateProps = {
  title: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  /** True while a retry is in flight, so the button cannot be pressed into a queue of requests. */
  isRetrying?: boolean
}
