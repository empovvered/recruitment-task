import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"

export type ApplicationsTableProps = {
  columns: ColumnMeta[]
  rows: ApplicationRow[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}
