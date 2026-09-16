import { DEFAULT_PAGE_SIZE } from "./applicationsTable.constants"
import type { TableViewAction, TableViewState } from "./applicationsTable.types"

export const STATUS_COLUMN_ID = "status"

export const initialTableViewState: TableViewState = {
  sorting: [],
  columnFilters: [],
  globalFilter: "",
  pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
}

const firstPage = (state: TableViewState) => ({ ...state.pagination, pageIndex: 0 })

/**
 * One reducer rather than four `useState` calls, so the rule "narrowing the result returns you to
 * page one" lives in a single place. With separate state it has to be repeated at every call site,
 * and the one that forgets leaves the user on an empty page 12 of 3.
 */
export const tableViewReducer = (state: TableViewState, action: TableViewAction): TableViewState => {
  switch (action.type) {
    case "setSorting":
      return { ...state, sorting: action.sorting }
    case "setStatus":
      return {
        ...state,
        columnFilters: action.status ? [{ id: STATUS_COLUMN_ID, value: action.status }] : [],
        pagination: firstPage(state),
      }
    case "setSearch":
      return { ...state, globalFilter: action.search, pagination: firstPage(state) }
    case "setPagination":
      return { ...state, pagination: action.pagination }
    default: {
      const exhaustive: never = action

      return exhaustive
    }
  }
}
