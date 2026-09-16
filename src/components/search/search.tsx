"use client"

import { Input } from "components/form/fields/input/input"
import { useDebouncedValue } from "hooks/useDebouncedValue/useDebouncedValue"
import { useEffect, useRef, useState } from "react"

import { SEARCH_DEBOUNCE_MS } from "./search.constants"
import type { SearchProps } from "./search.types"

/**
 * The field stays responsive while the term it reports settles. The ref records what was last handed
 * over in either direction, so a value arriving from outside — the back button restoring an older
 * query — replaces the text instead of fighting it.
 */
export const Search = ({ label, value, onValueChange, placeholder, className, testId }: SearchProps) => {
  const [term, setTerm] = useState(value)
  const exchanged = useRef(value)
  const debounced = useDebouncedValue(term, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (debounced === exchanged.current) return

    exchanged.current = debounced
    onValueChange(debounced)
  }, [debounced, onValueChange])

  useEffect(() => {
    if (value === exchanged.current) return

    exchanged.current = value
    setTerm(value)
  }, [value])

  return (
    <Input
      type="search"
      label={label}
      value={term}
      onChange={(event) => setTerm(event.target.value)}
      placeholder={placeholder}
      className={className}
      testId={testId}
    />
  )
}
