"use client"

import { ErrorState } from "components/error/errorState"

type ErrorProps = {
  error: Error & { digest?: string }
  //INFO: Next 16 names this `retry`; it re-fetches and re-renders the segment
  retry: () => void
}

export default function Error({ retry }: ErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Panel wniosków</h1>
      <ErrorState
        title="Coś poszło nie tak."
        description="Strony nie udało się wyświetlić. Spróbuj ponownie."
        onRetry={retry}
      />
    </main>
  )
}
