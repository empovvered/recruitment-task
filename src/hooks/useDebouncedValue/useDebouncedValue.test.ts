import { act, renderHook } from "@testing-library/react"

import { useDebouncedValue } from "./useDebouncedValue"

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value straight away", () => {
    const { result } = renderHook(() => useDebouncedValue("anna", 200))

    expect(result.current).toBe("anna")
  })

  it("holds a new value back until the delay passes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: "a" },
    })

    rerender({ value: "ab" })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("ab")
  })

  it("reports only the last value when changes arrive faster than the delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: "w" },
    })

    for (const value of ["wo", "woz", "wozn"]) {
      rerender({ value })
      act(() => {
        vi.advanceTimersByTime(150)
      })
    }

    expect(result.current).toBe("w")

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("wozn")
  })
})
