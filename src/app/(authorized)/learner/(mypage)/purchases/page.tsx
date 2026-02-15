'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TanstackTablePagination } from '@/shared/components/TanstackTablePagination';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatViewCount } from '@/shared/lib/utils';
import { useGetCoursesProgressByMe } from '@/shared/services/course/course.hook';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Calendar, Eye, Play } from 'lucide-react';

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
  const [pageSize, setPageSize] = useState(3);
  const router = useRouter();

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
              <CardContent>
                <div className="flex gap-8">
                  <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-48">
                    {purchase.thumbnail ? (
                      <Image
                        src={purchase.thumbnail}
                        alt={purchase.courseName}
                        fill
                        className="object-contain transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Play className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* 제목 */}
                          <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors">
                            {purchase.courseName}
                          </h3>

                          {/* 통계 정보 */}
                          <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {formatViewCount(0)}회
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {dayjs(purchase.purchaseDate).format('YYYY.MM.DD')}
                            </span>
                          </div>

                          {/* 가격 */}
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">판매가:</span>
                            {/* <span className="text-lg font-semibold">{Intl.NumberFormat('ko-KR').format(0)}원</span> */}
                            <span className="text-lg font-semibold">무료</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => router.push(`/course/${purchase.id}`)}>
                        강의 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {totalPages > 1 && <TanstackTablePagination table={table} />}
    </div>
  );
}
