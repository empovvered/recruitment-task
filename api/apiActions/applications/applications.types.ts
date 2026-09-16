import { ApplicationStatus } from "types/applications"

type BaseColumn = {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  visible?: boolean
  order?: number
}

export type ColumnMeta =
  | (BaseColumn & { type: "text" | "number" | "currency" | "date" })
  | (BaseColumn & { type: "badge"; options: readonly string[] })
  //INFO: For actions the key names a permission on the row, not a field of it
  | (BaseColumn & { type: "action"; action: "edit" | "view" | "delete" })

export type ColumnType = ColumnMeta["type"]

export type ApplicationRow = {
  loanId: string
  customerName: Nullable<string>
  status: ApplicationStatus
  market: string
  monthlyRate: Nullable<number>
  updatedAt: Nullable<string>
  permissions: Partial<Record<string, boolean>>
}

export type ApplicationsPayload = {
  columns: ColumnMeta[]
  rows: ApplicationRow[]
}
