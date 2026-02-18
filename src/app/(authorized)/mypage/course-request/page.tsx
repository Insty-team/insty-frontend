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
  if (!status) return 'Pending';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return 'Accepted';
    case 'COMPLETED':
      return 'Completed';
    case 'DECLINED':
      return 'Declined';
    case 'IGNORED':
      return 'Ignored';
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
        header: 'Title',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'action_status',
        header: 'Status',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
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
        console.error('Failed to delete content request:', error);
        alert('Failed to delete content request. Please try again.');
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
          <h2 className="text-2xl font-bold">Content Requests</h2>
          <p className="text-muted-foreground mt-1">View your content requests</p>
        </div>
        <Button asChild>
          <Link href="/learner/course-request/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Loading your content requests...</p>
        </div>
      ) : !courseRequests || courseRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4">No content requests yet.</p>
          <Button asChild>
            <Link href="/learner/course-request/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
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
                                Processed: {dayjs(courseRequest.action_at).format('YYYY.MM.DD')}
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
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(courseRequest.request_id, courseRequest.title)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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
              Delete Content Request
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete <strong>"{deleteDialog.title}"</strong>?
              </p>
              <p className="text-muted-foreground text-sm">
                This action cannot be undone. The content request will be permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
