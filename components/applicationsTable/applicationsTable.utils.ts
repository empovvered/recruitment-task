import type { ApplicationRow, ColumnMeta } from "api/apiActions/applications/applications.types"

import { CURRENCY_BY_MARKET, MISSING_VALUE } from "./applicationsTable.constants"

/**
 * The fixtures carry neither `visible` nor `order`, so both are optional in the model: a column is
 * visible unless it says otherwise, and its position defaults to where it sits in the metadata.
 * Reading both from one place means adding either to the JSON needs no code change.
 */
export const getVisibleColumns = (columns: ColumnMeta[]) =>
  columns
    .map((column, index) => ({ column, order: column.order ?? index }))
    .filter(({ column }) => column.visible !== false)
    .sort((first, second) => first.order - second.order)
    .map(({ column }) => column)

/**
 * An action column names a permission, not a field: `key: "canEdit"` has to be read from
 * `row.permissions.canEdit`. Reading `row[key]` instead would disable every action on every row.
 */
export const readCellValue = (row: ApplicationRow, column: ColumnMeta) =>
  column.type === "action" ? row.permissions[column.key] : row[column.key as keyof ApplicationRow]

const collator = new Intl.Collator("pl", { sensitivity: "base", numeric: true })

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeZone: "UTC" })

export const formatCurrency = (value: number, market: string) => {
  const currency = CURRENCY_BY_MARKET[market]

  // An unknown market must not be guessed into a currency; render a bare number instead.
  return currency
    ? new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(value)
    : new Intl.NumberFormat("pl-PL").format(value)
}

export const formatDate = (value: string) => {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? MISSING_VALUE : dateFormatter.format(parsed)
}

/**
 * Diacritics are stripped so "Wozniak" finds "Woźniak"; 677 of the 1200 names carry them.
 */
export const normalizeForSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()

export const matchesSearch = (row: ApplicationRow, columns: ColumnMeta[], term: string) => {
  const needle = normalizeForSearch(term.trim())

  if (!needle) return true

  return columns.some((column) => {
    const value = readCellValue(row, column)

    return typeof value === "string" && normalizeForSearch(value).includes(needle)
  })
}

/**
 * The searchable surface is derived from metadata rather than a hard-coded field list: a new
 * text column marked `filterable` joins the search without touching this file.
 */
export const getSearchableColumns = (columns: ColumnMeta[]) =>
  getVisibleColumns(columns).filter((column) => column.type === "text" && column.filterable === true)

type Comparable = string | number | null | undefined

/**
 * Gaps are NOT handled here. A comparator cannot keep missing values last in both directions,
 * because the table negates its result for a descending sort — which would flip them to the top.
 * "Last in both directions" is the table's `sortUndefined: "last"`, applied outside that inversion,
 * so the accessors map `null` to `undefined` and these comparators only ever see present values.
 * The fallbacks below exist so a gap that slips through still sorts deterministically, never as NaN.
 */
export const compareText = (first: Comparable, second: Comparable) =>
  collator.compare(String(first ?? ""), String(second ?? ""))

export const compareNumber = (first: Comparable, second: Comparable) => Number(first ?? 0) - Number(second ?? 0)

/**
 * An unparseable date must not reach the subtraction: NaN makes the result of Array.sort
 * unspecified, so a single malformed timestamp would scramble the whole column.
 */
const toTimestamp = (value: Comparable) => {
  const parsed = value === null || value === undefined ? Number.NaN : Date.parse(String(value))

  return Number.isNaN(parsed) ? 0 : parsed
}

export const compareDate = (first: Comparable, second: Comparable) => toTimestamp(first) - toTimestamp(second)
