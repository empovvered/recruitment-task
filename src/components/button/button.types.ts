import type { ButtonHTMLAttributes, ReactNode } from "react"

export type ButtonVariant = "primary" | "secondary" | "tertiary"

export type ButtonSize = "small" | "default"

//INFO: `disabled` is omitted on purpose; isDisabled and isLoading are the only way to switch it off
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
  children: ReactNode
  testId: string
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isDisabled?: boolean
  className?: string
}
