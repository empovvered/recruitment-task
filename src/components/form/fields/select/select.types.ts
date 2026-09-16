import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type SelectOption = {
  value: string
  label: ReactNode
}

export type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "className" | "children"> & {
  label: ReactNode
  options: SelectOption[]
  //INFO: Toolbar fields stack their label, a field sitting inside a row of controls keeps it alongside
  labelPlacement?: "top" | "inline"
  className?: string
  testId?: string
}
