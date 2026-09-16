type PaginationProps = {
  pageIndex: number
  pageCount: number
  totalRows: number
  onPrevious: () => void
  onNext: () => void
}

export const Pagination = ({ pageIndex, pageCount, totalRows, onPrevious, onNext }: PaginationProps) => (
  <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
    <span>
      Strona {pageIndex + 1} z {Math.max(pageCount, 1)} · {totalRows} wniosków
    </span>
    <div className="flex gap-2">
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
