import { cn } from "utils/cn"

import type { LabelProps } from "./label.types"

export const Label = ({ children, className }: LabelProps) => (
  <span className={cn("font-medium text-slate-700", className)}>{children}</span>
)
