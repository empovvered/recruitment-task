import { APPLICATION_STATUSES } from "types/applications"
import { z } from "zod"

import type { ApplicationsPayload } from "./applications.types"

const baseColumnSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  //INFO: Absent means visible; the metadata omits it, the model allows hiding a column without code changes
  visible: z.boolean().optional(),
  //INFO: Absent means "position in the metadata array"
  order: z.number().int().optional(),
})

/**
 * Discriminated on `type`, so a column type the renderer does not handle is rejected at the
 * boundary with the offending path, instead of reaching the UI and rendering a blank cell.
 */
export const columnMetaSchema = z.discriminatedUnion("type", [
  baseColumnSchema.extend({ type: z.literal(["text", "number", "currency", "date"]) }),
  baseColumnSchema.extend({ type: z.literal("badge"), options: z.array(z.string()).readonly() }),
  //INFO: For actions the key names a permission on the row, not a field of it
  baseColumnSchema.extend({ type: z.literal("action"), action: z.literal(["edit", "view", "delete"]) }),
])

export const applicationRowSchema = z.object({
  loanId: z.string().min(1),
  customerName: z.string().nullable(),
  status: z.literal(APPLICATION_STATUSES),
  market: z.string().min(1),
  monthlyRate: z.number().nullable(),
  updatedAt: z.iso.datetime().nullable(),
  permissions: z.record(z.string(), z.boolean().optional()),
})

/**
 * `satisfies` ties the schema to the hand-written contract: if the two ever drift, the build fails
 * here rather than at whichever cell first renders the wrong thing.
 */
export const applicationsPayloadSchema = z.object({
  columns: z.array(columnMetaSchema),
  rows: z.array(applicationRowSchema),
}) satisfies z.ZodType<ApplicationsPayload>
