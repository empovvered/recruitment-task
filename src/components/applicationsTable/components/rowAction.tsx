const ACTION_LABELS = {
  edit: "Edytuj",
  view: "Podgląd",
  delete: "Usuń",
} as const

type RowActionProps = {
  action: keyof typeof ACTION_LABELS
  isEnabled: boolean
  loanId: string
}

/**
 * A disabled action must not look active: it loses the link styling, gains a muted colour and a
 * not-allowed cursor, and is removed from the tab order via the native `disabled` attribute.
 */
export const RowAction = ({ action, isEnabled, loanId }: RowActionProps) => (
  <button
    type="button"
    disabled={!isEnabled}
    title={isEnabled ? undefined : "Brak uprawnień do tej akcji"}
    className="rounded px-2 py-1 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
  >
    {ACTION_LABELS[action]}
    <span className="sr-only"> wniosek {loanId}</span>
  </button>
)
