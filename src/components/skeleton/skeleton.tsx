import { cn } from "utils/cn"

import type { SkeletonProps } from "./skeleton.types"

export const Skeleton = ({ className }: SkeletonProps) => (
  <span data-testid="skeleton" className={cn("block h-4 animate-pulse rounded bg-slate-200", className)} />
)
