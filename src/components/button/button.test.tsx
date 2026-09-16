import userEvent from "@testing-library/user-event"
import { render, screen } from "tests"

import { Button } from "./button"

describe("Button", () => {
  it("defaults to type button, so it never submits a form by accident", () => {
    render(<Button testId="save">Zapisz</Button>)

    expect(screen.getByRole("button", { name: "Zapisz" })).toHaveAttribute("type", "button")
  })

  it("does not fire while disabled", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button testId="save" isDisabled onClick={onClick}>
        Zapisz
      </Button>,
    )
    await user.click(screen.getByRole("button", { name: "Zapisz" }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("announces work in progress and blocks a second press", () => {
    render(
      <Button testId="save" isLoading>
        Zapisz
      </Button>,
    )

    const button = screen.getByRole("button", { name: "Zapisz" })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })
})
