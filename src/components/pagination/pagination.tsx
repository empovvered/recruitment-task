import { Select } from "components/form/fields/select/select"

type PaginationProps = {
  pageIndex: number
  pageCount: number
  pageSize: number
  pageSizes?: number[]
  totalRows: number
  onPrevious: () => void
  onNext: () => void
  onPageSizeChange: (pageSize: number) => void
}

export const Pagination = ({
  pageIndex,
  pageCount,
  pageSize,
  pageSizes,
  totalRows,
  onPrevious,
  onNext,
  onPageSizeChange,
}: PaginationProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
    <span>
      Strona {pageIndex + 1} z {Math.max(pageCount, 1)} · {totalRows} wniosków
    </span>
    <div className="flex items-center gap-2">
      {pageSizes && pageSizes.length > 0 && (
        <Select
          label="Na stronę"
          labelPlacement="inline"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          options={pageSizes.map((size) => ({ value: String(size), label: size }))}
          className="px-2 py-1"
          testId="applications-page-size"
        />
      )}
      <button
        type="button"
        onClick={onPrevious}
        disabled={pageIndex === 0}
        className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        Poprzednia
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={pageIndex >= pageCount - 1}
        className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        Następna
      </button>
    </div>
  </div>
)
