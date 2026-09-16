import { Button } from "components/button/button"
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
      <Button
        variant="secondary"
        size="small"
        testId="paginationPrevious"
        onClick={onPrevious}
        isDisabled={pageIndex === 0}
      >
        Poprzednia
      </Button>
      <Button
        variant="secondary"
        size="small"
        testId="paginationNext"
        onClick={onNext}
        isDisabled={pageIndex >= pageCount - 1}
      >
        Następna
      </Button>
    </div>
  </div>
)
