import type { PropsWithChildren } from "react"

export const TableCell = ({ children }: PropsWithChildren) => (
  <td className="px-4 py-3 align-middle text-sm text-slate-700">{children}</td>
)
