import { render as baseRender, RenderOptions } from "@testing-library/react"
import { ReactElement } from "react"

import { Wrapper } from "./wrapper"

const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  baseRender(ui, { wrapper: Wrapper, ...options })

export * from "@testing-library/react"
export { render }
