"use client"

import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "api/queryClient"
import { ReactNode } from "react"

let clientQueryClientSingleton: Optional<QueryClient> = undefined

const getQueryClient = () => {
  //INFO: On the server always make a new query client, so requests stay isolated
  if (typeof window === "undefined") return createQueryClient()

  //INFO: In the browser keep a singleton, so the cache survives re-renders
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const QueryClientProvider = ({ children }: { children: ReactNode }) => (
  <BaseQueryClientProvider client={getQueryClient()}>{children}</BaseQueryClientProvider>
)
