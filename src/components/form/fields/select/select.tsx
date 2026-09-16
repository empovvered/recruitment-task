import { Label } from "components/form/label/label"
import { getFieldClassNames } from "components/form/utils/getFieldClassNames"
import { cn } from "utils/cn"

import type { SelectProps } from "./select.types"

export const Select = ({ label, options, labelPlacement = "top", className, testId, ...props }: SelectProps) => (
  <label className={cn("text-sm", labelPlacement === "top" ? "flex flex-col gap-1" : "flex items-center gap-2")}>
    <Label className={labelPlacement === "inline" ? "font-normal" : undefined}>{label}</Label>
    <select {...props} data-testid={testId} className={getFieldClassNames(className)}>
      {options.map(({ value, label: optionLabel }) => (
        <option key={value} value={value}>
          {optionLabel}
        </option>
      ))}
    </select>
  </label>
)
