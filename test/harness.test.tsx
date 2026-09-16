import { render, screen } from "@testing-library/react"

describe("test harness", () => {
  it("renders into jsdom and applies jest-dom matchers", () => {
    render(<p>ready</p>)

    expect(screen.getByText("ready")).toBeInTheDocument()
  })
})
