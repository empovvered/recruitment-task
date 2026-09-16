import type { PropsWithChildren } from "react"

export const TableHead = ({ children }: PropsWithChildren) => (
  <thead className="border-b border-slate-200 bg-slate-50">{children}</thead>
)
