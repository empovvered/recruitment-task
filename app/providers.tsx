"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // The fixtures are static, so re-fetching them on focus buys nothing.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        // The panel renders its own error state; retrying would hide it behind a long spinner.
        retry: false,
      },
    },
  })

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  // Keep server requests isolated and preserve the browser cache across renders.
  if (typeof window === "undefined") return createQueryClient()

  browserQueryClient ??= createQueryClient()

  return browserQueryClient
}

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
)
