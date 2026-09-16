import userEvent from "@testing-library/user-event"
import { render, screen } from "tests"

import { ErrorBoundary } from "./errorBoundary"
import { ErrorFallback } from "./errorFallback"

const Throwing = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error("column type not handled")

  return <p>Lista wniosków</p>
}

describe("ErrorBoundary", () => {
  //INFO: React logs a caught render error; silenced so a passing run stays readable
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
  })

  it("shows the content while nothing throws", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Throwing shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Lista wniosków")).toBeInTheDocument()
  })

  it("replaces a throwing subtree with the fallback instead of failing the render", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Throwing shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Nie udało się wyświetlić wniosków.")
  })

  it("renders the children again when the retry succeeds", async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Throwing shouldThrow />
      </ErrorBoundary>,
    )

    rerender(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Throwing shouldThrow={false} />
      </ErrorBoundary>,
    )
    await user.click(screen.getByRole("button", { name: /Spróbuj ponownie/ }))

    expect(screen.getByText("Lista wniosków")).toBeInTheDocument()
  })
})
