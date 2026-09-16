/**
 * The fixtures carry no currency, only a market. This is the assumption the README has to name:
 * an unknown market falls back to a plain number rather than guessing a currency.
 */
export const CURRENCY_BY_MARKET: Record<string, string> = {
  PL: "PLN",
  CZ: "CZK",
  DE: "EUR",
  SK: "EUR",
  RO: "RON",
}

export const MISSING_VALUE = "—"

export const DEFAULT_PAGE_SIZE = 25
