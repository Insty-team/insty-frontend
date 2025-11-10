'use client';

import { useMemo, useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Separator } from '@/shared/components/ui/separator';
import { useGetCoursesProgressByMe } from '@/shared/services/course/course.hook';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

type PurchaseRow = {
  id: string;
  courseName: string;
  instructor: string;
  purchaseDate: string;
  price: number;
  thumbnail: string;
};

export default function LearnerPurchasesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const {
    data: purchasesResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCoursesProgressByMe(pageIndex + 1, pageSize);

  const pagination = purchasesResponse?.pagination;

  const purchases = useMemo<PurchaseRow[]>(() => {
    const items = purchasesResponse?.items;
    if (!items?.length) {
      return [];
    }

    return items.map((purchase) => {
      type ExtendedPurchase = typeof purchase & {
        price?: number;
        instructorName?: string;
        instructor?: string;
        purchaseDate?: string;
        thumbnail?: string;
      };

      const extended = purchase as ExtendedPurchase;

      const price = typeof extended.price === 'number' && Number.isFinite(extended.price) ? extended.price : 0;

      const instructor = extended.instructor?.trim() ?? extended.instructorName?.trim() ?? '강사 정보 없음';

      const rawPurchaseDate = extended.purchaseDate ?? extended.createdAt;
      let formattedPurchaseDate = '구매일 정보 없음';
      if (rawPurchaseDate) {
        const date = new Date(rawPurchaseDate);
        formattedPurchaseDate = Number.isNaN(date.getTime()) ? rawPurchaseDate : date.toLocaleDateString('ko-KR');
      }

      const thumbnail = extended.thumbnail ?? extended.thumbnailUrl ?? '';

      return {
        id: purchase.courseId,
        courseName: purchase.title ?? '제목 없는 강의',
        instructor,
        purchaseDate: formattedPurchaseDate,
        price,
        thumbnail,
      };
    });
  }, [purchasesResponse]);

  const columns = useMemo<ColumnDef<PurchaseRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '강의 ID',
      },
      {
        accessorKey: 'courseName',
        header: '강의명',
      },
      {
        accessorKey: 'instructor',
        header: '강사명',
      },
      {
        accessorKey: 'purchaseDate',
        header: '구매일',
      },
      {
        accessorKey: 'price',
        header: '가격',
      },
    ],
    [],
  );

  const table = useReactTable({
    data: purchases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0,
    rowCount: pagination?.totalItems ?? purchases.length,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        if (newPagination.pageIndex !== pageIndex) {
          setPageIndex(newPagination.pageIndex);
        }
        if (newPagination.pageSize !== pageSize) {
          setPageSize(newPagination.pageSize);
        }
        return;
      }

      if (updater.pageIndex !== pageIndex) {
        setPageIndex(updater.pageIndex);
      }
      if (updater.pageSize !== pageSize) {
        setPageSize(updater.pageSize);
      }
    },
  });

  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.currentPage ?? pageIndex + 1;

  const renderThumbnailStyle = (thumbnail: string) =>
    thumbnail
      ? {
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {};

  const showLoadingState = isLoading || (isFetching && purchases.length === 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">구매내역</h2>
        <p className="text-muted-foreground mt-1">구매한 강의 목록을 확인하세요</p>
      </div>

      {showLoadingState ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">구매내역을 불러오는 중입니다...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">구매내역을 불러오지 못했습니다</p>
            <Button variant="outline" onClick={() => refetch()}>
              다시 시도하기
            </Button>
          </CardContent>
        </Card>
      ) : purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">아직 구매한 강의가 없습니다</p>
            <Button>강의 둘러보기</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div
                    className="bg-muted h-20 w-32 flex-shrink-0 rounded-lg"
                    style={renderThumbnailStyle(purchase.thumbnail)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-semibold">{purchase.courseName}</h3>
                        <p className="text-muted-foreground mb-2 text-sm">{purchase.instructor}</p>
                        <p className="text-muted-foreground text-sm">구매일: {purchase.purchaseDate}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="mb-2 text-lg font-bold">{purchase.price.toLocaleString()}원</p>
                        <Badge variant="secondary">결제완료</Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm">강의 보기</Button>
                      <Button size="sm" variant="outline">
                        영수증 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (table.getCanPreviousPage()) {
                    table.previousPage();
                  }
                }}
                className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {(() => {
              const pages: (number | 'ellipsis')[] = [];

              if (totalPages <= 7) {
                for (let page = 1; page <= totalPages; page++) {
                  pages.push(page);
                }
              } else {
                pages.push(1);

                if (currentPage <= 3) {
                  for (let page = 2; page <= 4; page++) {
                    pages.push(page);
                  }
                  pages.push('ellipsis');
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push('ellipsis');
                  for (let page = totalPages - 3; page <= totalPages; page++) {
                    pages.push(page);
                  }
                } else {
                  pages.push('ellipsis');
                  for (let page = currentPage - 1; page <= currentPage + 1; page++) {
                    pages.push(page);
                  }
                  pages.push('ellipsis');
                  pages.push(totalPages);
                }
              }

              return pages.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => {
                        table.setPageIndex(page - 1);
                      }}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              });
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (table.getCanNextPage()) {
                    table.nextPage();
                  }
                }}
                className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
