import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import { ReactNode } from "react"

export type WrapperProps = {
  children: ReactNode
  //INFO: Seeds the address the component reads its view state from, the way a pasted link would
  searchParams?: string
}

/**
 * The view state lives in the URL, so a component under test needs the adapter the app provides.
 * `hasMemory` makes it keep what was written, the way a browser does, instead of freezing the value.
 */
export const Wrapper = ({ children, searchParams }: WrapperProps) => (
  <NuqsTestingAdapter hasMemory searchParams={searchParams}>
    {children}
  </NuqsTestingAdapter>
)
