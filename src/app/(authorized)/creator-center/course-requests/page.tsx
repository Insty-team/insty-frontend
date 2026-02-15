'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TanstackTablePagination } from '@/shared/components/TanstackTablePagination';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useGetCommunityCourseRequests } from '@/shared/services/ai-community/ai-community.hook';
import {
  GET_community_course_requests,
  PATCH_community_course_request_recommendation_status,
} from '@/shared/services/ai-community/ai-community.service';
import { CourseResponse } from '@/shared/services/ai-community/ai-community.type';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Calendar, FileText } from 'lucide-react';

const getStatusBadgeVariant = (status: string | null) => {
  if (!status) return 'outline';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return 'default';
    case 'COMPLETED':
      return 'default';
    case 'DECLINED':
      return 'destructive';
    case 'IGNORED':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string | null) => {
  if (!status) return '대기중';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return '수락됨';
    case 'COMPLETED':
      return '완료됨';
    case 'DECLINED':
      return '거절됨';
    case 'IGNORED':
      return '무시됨';
    default:
      return status;
  }
};

export default function CreatorCourseRequestsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: courseRequests, isLoading } = useGetCommunityCourseRequests();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [actionRequestId, setActionRequestId] = useState<number | null>(null);

  // 테이블 컬럼 정의
  const columns: ColumnDef<CourseResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'request_id',
        header: 'ID',
      },
      {
        accessorKey: 'title',
        header: '제목',
      },
      {
        accessorKey: 'description',
        header: '설명',
      },
      {
        accessorKey: 'action_status',
        header: '상태',
      },
      {
        accessorKey: 'created_at',
        header: '생성일',
      },
    ],
    [],
  );

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: courseRequests || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      }
    },
  });

  const handleAction = async (requestId: number, actionStatus: 'ACCEPTED' | 'DECLINED') => {
    setActionRequestId(requestId);
    try {
      await PATCH_community_course_request_recommendation_status(requestId, { action_status: actionStatus });
      queryClient.invalidateQueries({ queryKey: [GET_community_course_requests.name] });
    } catch (error) {
      console.error('강의 요청 상태 변경 실패:', error);
      alert('강의 요청 상태 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setActionRequestId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">요청된 강의 확인</h2>
        <p className="text-muted-foreground mt-1">학습자가 요청한 강의 주제를 확인하고, 제작할 강의를 선택하세요</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">강의 요청 목록을 불러오는 중입니다...</p>
        </div>
      ) : !courseRequests || courseRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-2">아직 요청된 강의가 없습니다</p>
          <p className="text-muted-foreground text-sm">수강생들이 강의를 요청하면 여기에 표시됩니다</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {table.getRowModel().rows.map((row) => {
              const courseRequest = row.original;
              const isPending = !courseRequest.action_status;
              const isActioning = actionRequestId === courseRequest.request_id;
              return (
                <div key={courseRequest.request_id}>
                  <div className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{courseRequest.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{courseRequest.description}</p>
                          <div className="text-muted-foreground flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {dayjs(courseRequest.created_at).format('YYYY.MM.DD')}
                            </span>
                            {courseRequest.action_at && (
                              <span className="flex items-center gap-1">
                                처리일: {dayjs(courseRequest.action_at).format('YYYY.MM.DD')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(courseRequest.action_status)}>
                          {getStatusLabel(courseRequest.action_status)}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAction(courseRequest.request_id, 'ACCEPTED')}
                              disabled={isActioning}
                            >
                              수락하기
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(courseRequest.request_id, 'DECLINED')}
                              disabled={isActioning}
                            >
                              거절
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/creator-center/course-requests/${courseRequest.request_id}`)}
                        >
                          상세 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {table.getPageCount() > 1 && <TanstackTablePagination table={table} />}
        </>
      )}
    </div>
  );
}
