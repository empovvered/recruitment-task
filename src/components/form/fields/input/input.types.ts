import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "className"> & {
  label: ReactNode
  className?: string
  testId?: string
}
