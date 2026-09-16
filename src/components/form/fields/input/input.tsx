import { Label } from "components/form/label/label"
import { getFieldClassNames } from "components/form/utils/getFieldClassNames"

import type { InputProps } from "./input.types"

export const Input = ({ label, className, testId, ...props }: InputProps) => (
  <label className="flex flex-col gap-1 text-sm">
    <Label>{label}</Label>
    <input {...props} data-testid={testId} className={getFieldClassNames(className)} />
  </label>
)
