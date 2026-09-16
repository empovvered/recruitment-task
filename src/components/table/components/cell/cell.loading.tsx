import { Skeleton } from "components/skeleton/skeleton"
import { cn } from "utils/cn"

/**
 * The bar is as tall as a loaded row's tallest content — the row action button — so the table does
 * not change height when the data arrives. A skeleton shorter than the real thing moves the page
 * under the reader, which is the jump it exists to prevent.
 *
 * It stops at three quarters because a cell's text rarely fills it. A placeholder standing in for a
 * whole row, before the columns are known, passes `w-full` instead.
 */
export const CellSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-7 w-3/4", className)} />
)
