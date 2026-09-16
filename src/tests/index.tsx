import { render as baseRender, RenderOptions } from "@testing-library/react"
import { ReactElement } from "react"

import { Wrapper, WrapperProps } from "./wrapper"

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & Pick<WrapperProps, "searchParams">

const render = (ui: ReactElement, { searchParams, ...options }: CustomRenderOptions = {}) =>
  baseRender(ui, {
    wrapper: ({ children }) => <Wrapper searchParams={searchParams}>{children}</Wrapper>,
    ...options,
  })

export * from "@testing-library/react"
export { render }
