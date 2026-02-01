'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TanstackTablePagination } from '@/shared/components/TanstackTablePagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  useDeleteCommunityCourseRequest,
  useGetCommunityCourseRequests,
} from '@/shared/services/ai-community/ai-community.hook';
import { GET_community_course_requests } from '@/shared/services/ai-community/ai-community.service';
import { CourseResponse } from '@/shared/services/ai-community/ai-community.type';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Calendar, FileText, Loader2, Plus, Trash2 } from 'lucide-react';

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

export default function LearnerCourseRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: courseRequests, isLoading } = useGetCommunityCourseRequests();
  const { mutate: deleteCourseRequest, isPending: isDeleting } = useDeleteCommunityCourseRequest();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    requestId: number | null;
    title: string;
  }>({
    isOpen: false,
    requestId: null,
    title: '',
  });

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

  const handleDeleteClick = (requestId: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      requestId,
      title,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog.requestId) return;

    deleteCourseRequest(deleteDialog.requestId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_community_course_requests.name] });
        setDeleteDialog({ isOpen: false, requestId: null, title: '' });
      },
      onError: (error) => {
        console.error('강의 요청 삭제 실패:', error);
        alert('강의 요청 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, requestId: null, title: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">내가 요청한 강의</h2>
          <p className="text-muted-foreground mt-1">제출한 강의 요청 목록을 확인하세요</p>
        </div>
        <Button asChild>
          <Link href="/learner/course-request/new">
            <Plus className="mr-2 h-4 w-4" />
            강의 요청하기
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">강의 요청 목록을 불러오는 중입니다...</p>
        </div>
      ) : !courseRequests || courseRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4">아직 요청한 강의가 없습니다</p>
          <Button asChild>
            <Link href="/learner/course-request/new">
              <Plus className="mr-2 h-4 w-4" />
              강의 요청하기
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {table.getRowModel().rows.map((row) => {
              const courseRequest = row.original;
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/learner/course-request/${courseRequest.request_id}`)}
                        >
                          상세히 보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(courseRequest.request_id, courseRequest.title)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> 요청 삭제
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

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="text-destructive h-5 w-5" />
              강의 요청 삭제 확인
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                <strong>"{deleteDialog.title}"</strong> 강의 요청을 삭제하시겠습니까?
              </p>
              <p className="text-muted-foreground text-sm">
                이 작업은 되돌릴 수 없습니다. 강의 요청이 영구적으로 삭제됩니다.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
