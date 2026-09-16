import { cn } from "utils/cn"

//INFO: One home for the control chrome, so a new field cannot drift from the two that exist
export const getFieldClassNames = (className?: string) =>
  cn(
    "rounded border border-slate-300 bg-white px-3 py-2 text-slate-900",
    "focus:border-sky-600 focus:ring-2 focus:ring-sky-100 focus:outline-none",
    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
    className,
  )
