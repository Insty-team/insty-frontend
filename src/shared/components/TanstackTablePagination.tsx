import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

import { Table } from '@tanstack/react-table';

const MAX_PAGE_COUNT = 3;

interface TanstackTablePaginationProps<TData> {
  table: Table<TData>;
}
export function TanstackTablePagination<TData>({ table }: TanstackTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const startPage = Math.max(0, Math.min(currentPage - Math.floor(MAX_PAGE_COUNT / 2), pageCount - MAX_PAGE_COUNT));
  const endPage = Math.min(startPage + MAX_PAGE_COUNT, pageCount);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => table.previousPage()} />
        </PaginationItem>
        {Array.from({ length: endPage - startPage }, (_, i) => i + startPage).map((pageIndex) => (
          <PaginationLink
            key={pageIndex}
            isActive={pageIndex === currentPage}
            onClick={() => table.setPageIndex(pageIndex)}
          >
            {pageIndex + 1}
          </PaginationLink>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => table.nextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
