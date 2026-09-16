import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"

export type ApplicationsTableProps = {
  columns: ColumnMeta[]
  rows: ApplicationRow[]
  isLoading?: boolean
  isError?: boolean
  /** The thrown value, so the state can say what the server reported rather than a generic line. */
  error?: unknown
  /** True while a retry is in flight; the error state reflects it instead of looking inert. */
  isRetrying?: boolean
  onRetry?: () => void
}
