import type { PropsWithChildren } from "react"

export const TableRow = ({ children }: PropsWithChildren) => (
  <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">{children}</tr>
)
