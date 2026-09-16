import type { Header } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

const SORT_INDICATOR = { asc: "↑", desc: "↓" } as const

/**
 * `aria-sort` is what a screen reader announces; the arrow is only the sighted equivalent. A column
 * the metadata marks unsortable renders as plain text, with no button and no affordance.
 */
export const TableHeadCell = <Data, Value>({ header }: { header: Header<Data, Value> }) => {
  const direction = header.column.getIsSorted()
  const canSort = header.column.getCanSort()
  const label = flexRender(header.column.columnDef.header, header.getContext())

  return (
    <th
      scope="col"
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
      className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-600 uppercase"
    >
      {canSort ? (
        <button
          type="button"
          onClick={header.column.getToggleSortingHandler()}
          className="inline-flex items-center gap-1 rounded hover:text-slate-900"
        >
          {label}
          <span aria-hidden="true" className="text-slate-400">
            {direction ? SORT_INDICATOR[direction] : "↕"}
          </span>
        </button>
      ) : (
        label
      )}
    </th>
  )
}
