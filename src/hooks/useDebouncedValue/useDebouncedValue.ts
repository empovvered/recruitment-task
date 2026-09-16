import { useEffect, useState } from "react"

/**
 * Holds a value back until it stops changing. The search box filters 1200 rows and writes the URL on
 * every keystroke without it, so the expensive work runs once the typing settles rather than per letter.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)

    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
