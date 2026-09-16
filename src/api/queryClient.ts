import { QueryClient, QueryClientConfig } from "@tanstack/react-query"
import { ONE_MINUTE_IN_MS } from "constants/time"

export const createQueryClient = (config?: QueryClientConfig) =>
  new QueryClient({
    ...config,
    defaultOptions: {
      queries: {
        //INFO: The fixtures are static, so refetching them on focus buys nothing
        staleTime: ONE_MINUTE_IN_MS,
        refetchOnWindowFocus: false,
        //INFO: The panel renders its own error state; the default retries would hide it behind a long spinner
        retry: false,
      },
    },
  })
