import type { PaginationState, SortingState } from "@tanstack/react-table"
import { STATUS_COLUMN_ID } from "components/applicationsTable/applicationsTable.constants"
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "constants/pagination"
import { SearchParams } from "constants/searchParams"
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs"
import { useCallback, useMemo } from "react"

import { QueryTableState, SORT_ORDERS } from "./useQueryTableState.types"

const resolve = <T>(updater: T | ((previous: T) => T), previous: T) =>
  typeof updater === "function" ? (updater as (previous: T) => T)(previous) : updater

/**
 * The whole view lives in the URL: sorting, the status filter, the search term and pagination. A
 * filtered, sorted page is then a link — it survives a reload, it can be pasted into a bug report,
 * and the back button walks the states a reviewer went through.
 */
export const useQueryTableState = (): QueryTableState => {
  const [params, setParams] = useQueryStates(
    {
      //INFO: Paging is a navigation step, so it belongs in history; typing a query is not
      [SearchParams.Page]: parseAsInteger.withDefault(DEFAULT_PAGE_INDEX).withOptions({ history: "push" }),
      [SearchParams.Limit]: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({ history: "push" }),
      [SearchParams.Status]: parseAsString.withDefault(""),
      [SearchParams.Search]: parseAsString.withDefault(""),
      [SearchParams.Sort]: parseAsString.withDefault(""),
      [SearchParams.Order]: parseAsStringLiteral(SORT_ORDERS).withDefault("asc"),
    },
    { history: "replace", shallow: true },
  )

  const sorting = useMemo<SortingState>(
    () => (params.sort ? [{ id: params.sort, desc: params.order === "desc" }] : []),
    [params.sort, params.order],
  )

  const columnFilters = useMemo(
    () => (params.status ? [{ id: STATUS_COLUMN_ID, value: params.status }] : []),
    [params.status],
  )

  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex: params.page, pageSize: params.limit }),
    [params.page, params.limit],
  )

  const setSorting = useCallback(
    (updater: SortingState | ((previous: SortingState) => SortingState)) => {
      const [next] = resolve(updater, sorting)

      void setParams({
        [SearchParams.Sort]: next?.id ?? null,
        [SearchParams.Order]: next?.desc ? "desc" : "asc",
      })
    },
    [setParams, sorting],
  )

  //INFO: Narrowing the result returns to page one; doing it here keeps the rule out of every call site
  const setStatus = useCallback(
    (status: string) => {
      void setParams({ [SearchParams.Status]: status || null, [SearchParams.Page]: DEFAULT_PAGE_INDEX })
    },
    [setParams],
  )

  const setSearch = useCallback(
    (search: string) => {
      void setParams({ [SearchParams.Search]: search || null, [SearchParams.Page]: DEFAULT_PAGE_INDEX })
    },
    [setParams],
  )

  const setPagination = useCallback(
    (updater: PaginationState | ((previous: PaginationState) => PaginationState)) => {
      const next = resolve(updater, pagination)
      const pageSizeChanged = next.pageSize !== pagination.pageSize

      void setParams({
        [SearchParams.Page]: pageSizeChanged ? DEFAULT_PAGE_INDEX : next.pageIndex,
        [SearchParams.Limit]: next.pageSize,
      })
    },
    [setParams, pagination],
  )

  return {
    sorting,
    setSorting,
    columnFilters,
    status: params.status,
    setStatus,
    search: params.search,
    setSearch,
    pagination,
    setPagination,
  }
}
