import type { HTMLProps } from "react"
import { cn } from "utils/cn"

export const TableCaption = ({ className, ...props }: HTMLProps<HTMLTableCaptionElement>) => (
  <caption className={cn("text-base font-bold", className)} {...props} />
)
