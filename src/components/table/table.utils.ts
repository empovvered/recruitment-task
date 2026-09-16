import type { PaginationState } from "@tanstack/react-table"

/**
 * Pagination crosses the component boundary 1-based, because "page 1" is what a call site and a
 * URL mean. The table core counts from zero, so the offset is applied in exactly one place.
 */
export const getPaginationWithPageIndexOffset = (pagination: PaginationState): PaginationState => ({
  ...pagination,
  pageIndex: Math.max(pagination.pageIndex - 1, 0),
})

export const getPaginationWithoutPageIndexOffset = (pagination: PaginationState): PaginationState => ({
  ...pagination,
  pageIndex: pagination.pageIndex + 1,
})
