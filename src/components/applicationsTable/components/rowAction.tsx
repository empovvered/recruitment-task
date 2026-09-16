import { Button } from "components/button/button"

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
  <Button
    variant="tertiary"
    size="small"
    testId={`rowAction-${loanId}`}
    isDisabled={!isEnabled}
    title={isEnabled ? undefined : "Brak uprawnień do tej akcji"}
  >
    {ACTION_LABELS[action]}
    <span className="sr-only"> wniosek {loanId}</span>
  </Button>
)
