import { cva } from "class-variance-authority"
import { cn } from "utils/cn"

import type { ButtonProps } from "./button.types"

const buttonVariants = cva("inline-flex items-center justify-center gap-1 rounded font-medium", {
  variants: {
    size: {
      small: "px-2 py-1 text-sm",
      default: "px-4 py-2 text-sm",
    },
    variant: {
      primary:
        "bg-rose-600 text-white transition duration-200 hover:bg-rose-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-rose-300",
      secondary:
        "border border-slate-300 text-slate-700 transition duration-200 hover:bg-slate-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-slate-300",
      tertiary:
        "bg-transparent text-sky-700 transition duration-200 hover:bg-sky-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-slate-400",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
})

/**
 * Every button in the panel goes through here, so the disabled treatment is defined once. That
 * matters beyond tidiness: the task requires an unavailable action not to look active, and a rule
 * repeated at five call sites is a rule that drifts at the fifth.
 */
export const Button = ({
  children,
  variant,
  size,
  isLoading = false,
  isDisabled = false,
  testId,
  className,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    data-testid={testId}
    disabled={isDisabled || isLoading}
    aria-busy={isLoading ? "true" : "false"}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </button>
)
