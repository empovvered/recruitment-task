"use client"

import { ErrorBoundary as BaseErrorBoundary } from "react-error-boundary"

//INFO: Re-exported so call sites depend on our module, not on the library choice
export const ErrorBoundary = BaseErrorBoundary
