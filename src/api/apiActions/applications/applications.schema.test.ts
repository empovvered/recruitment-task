import columnsFixture from "data/columns.json"
import rowsFixture from "data/rows.json"

import { applicationRowSchema, applicationsPayloadSchema, columnMetaSchema } from "./applications.schema"

const validColumn = { key: "loanId", label: "ID wniosku", type: "text", sortable: true, filterable: true }

const validRow = {
  loanId: "LN-202600001",
  customerName: "Anna Woźniak",
  status: "approved",
  market: "PL",
  monthlyRate: 1409.27,
  updatedAt: "2026-01-22T19:00:00Z",
  permissions: { canEdit: true },
}

describe("applications payload schema", () => {
  it("accepts the delivered fixtures", () => {
    const result = applicationsPayloadSchema.safeParse({ columns: columnsFixture, rows: rowsFixture })

    expect(result.success).toBe(true)
  })

  it("rejects a column type the cell renderer cannot handle, naming the path", () => {
    const result = columnMetaSchema.safeParse({ ...validColumn, type: "sparkline" })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toContain("type")
  })

  it("rejects a badge column that declares no options", () => {
    const { options, ...withoutOptions } = { ...validColumn, type: "badge", options: ["new"] }

    expect(columnMetaSchema.safeParse({ ...withoutOptions, type: "badge" }).success).toBe(false)
    expect(columnMetaSchema.safeParse({ ...withoutOptions, type: "badge", options }).success).toBe(true)
  })

  it("rejects an action the row action component cannot render", () => {
    expect(columnMetaSchema.safeParse({ ...validColumn, type: "action", action: "archive" }).success).toBe(false)
    expect(columnMetaSchema.safeParse({ ...validColumn, type: "action", action: "edit" }).success).toBe(true)
  })

  it("accepts the gaps the model allows and rejects the ones it does not", () => {
    const withGaps = { ...validRow, customerName: null, monthlyRate: null, updatedAt: null }

    expect(applicationRowSchema.safeParse(withGaps).success).toBe(true)
    expect(applicationRowSchema.safeParse({ ...validRow, loanId: "" }).success).toBe(false)
    expect(applicationRowSchema.safeParse({ ...validRow, status: "archived" }).success).toBe(false)
    expect(applicationRowSchema.safeParse({ ...validRow, updatedAt: "22.01.2026" }).success).toBe(false)
  })
})
