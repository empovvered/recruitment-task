import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import { ReactNode } from "react"

//INFO: The view state lives in the URL, so a component under test needs the adapter the app provides.
//`hasMemory` makes it keep what was written, the way a browser does, instead of freezing the initial value.
export const Wrapper = ({ children }: { children: ReactNode }) => (
  <NuqsTestingAdapter hasMemory>{children}</NuqsTestingAdapter>
)
