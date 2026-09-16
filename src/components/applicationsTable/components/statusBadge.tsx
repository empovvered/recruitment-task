import type { ApplicationStatus } from "types/applications"
import { cn } from "utils/cn"

const STATUS_PRESENTATION: Record<ApplicationStatus, { label: string; className: string }> = {
  new: { label: "Nowy", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  in_review: { label: "W weryfikacji", className: "bg-amber-100 text-amber-800 ring-amber-200" },
  approved: { label: "Zaakceptowany", className: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  rejected: { label: "Odrzucony", className: "bg-rose-100 text-rose-800 ring-rose-200" },
}

export const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const presentation = STATUS_PRESENTATION[status]

  // An unknown status must stay readable rather than render an empty badge.
  if (!presentation) return <span className="text-slate-500">{status}</span>

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        presentation.className,
      )}
    >
      {presentation.label}
    </span>
  )
}
