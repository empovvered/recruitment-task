export const APPLICATION_STATUSES = ["new", "in_review", "approved", "rejected"] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
