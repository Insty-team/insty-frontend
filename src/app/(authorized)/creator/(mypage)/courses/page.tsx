'use client';

import { CourseCard } from './_components/CourseCard';
import { CourseFilters, SortOption, StatusFilter } from './_components/CourseFilters';
import { DeleteCourseDialog } from './_components/DeleteCourseDialog';
import { ToggleVisibilityDialog } from './_components/ToggleVisibilityDialog';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { TanstackTablePagination } from '@/shared/components/TanstackTablePagination';
import { Button } from '@/shared/components/ui/button';
import { useGetCoursesMy } from '@/shared/services/course/course.hook';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Video } from 'lucide-react';
import { Tabs } from '@/shared/components/ui/tabs';

export default function CreatorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 다이얼로그 상태
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({
    isOpen: false,
    courseId: '',
    courseTitle: '',
  });

  const [toggleVisibilityDialog, setToggleVisibilityDialog] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
    currentVisibility: boolean;
  }>({
    isOpen: false,
    courseId: '',
    courseTitle: '',
    currentVisibility: false,
  });

  // API에서 강의 데이터 가져오기 (서버 사이드 pagination)
  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetCoursesMy({
    page: pageIndex + 1,
    pageSize,
    isShow: statusFilter === 'public' ? true : statusFilter === 'private' ? false : undefined,
    sortType: sortBy,
  });
  const courses = coursesData?.items || [];
  const pagination = coursesData?.pagination;

  // 테이블 컬럼 정의
  const columns: ColumnDef<CourseMyResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'courseId',
        header: 'ID',
      },
      {
        accessorKey: 'title',
        header: '제목',
      },
      {
        accessorKey: 'createdAt',
        header: '생성일',
      },
      {
        accessorKey: 'viewCount',
        header: '조회수',
      },
      {
        accessorKey: 'commentCount',
        header: '댓글수',
      },
      {
        accessorKey: 'isShow',
        header: '공개 여부',
      },
    ],
    [],
  );

  // 필터링 및 정렬된 강의 목록 (클라이언트 사이드 필터링)
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (course: CourseMyResponse) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    return filtered;
  }, [courses, searchQuery]);

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    rowCount: pagination?.totalItems ?? 0,
    pageCount: pagination?.totalPages ?? 0,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      columnFilters,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      }
    },
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    setColumnFilters((prev) => {
      const filtersWithoutIsShow = prev.filter((filter) => filter.id !== 'isShow');

      if (statusFilter === 'public') {
        return [...filtersWithoutIsShow, { id: 'isShow', value: true }];
      }

      if (statusFilter === 'private') {
        return [...filtersWithoutIsShow, { id: 'isShow', value: false }];
      }

      return filtersWithoutIsShow;
    });
  }, [statusFilter]);

  // 이벤트 핸들러들
  const handleEdit = (courseId: string) => {
    // TODO: 강의 수정 페이지로 이동
    console.log('Edit course:', courseId);
  };

  const handleDelete = (courseId: string) => {
    const course = courses.find((c: CourseMyResponse) => c.courseId === courseId);
    if (course) {
      setDeleteDialog({
        isOpen: true,
        courseId: course.courseId,
        courseTitle: course.title,
      });
    }
  };

  const handleViewStats = (courseId: string) => {
    // TODO: 통계 페이지로 이동
    console.log('View stats for course:', courseId);
  };

  const handleToggleVisibility = (courseId: string) => {
    const course = courses.find((c: CourseMyResponse) => c.courseId === courseId);
    if (course) {
      setToggleVisibilityDialog({
        isOpen: true,
        courseId: course.courseId,
        courseTitle: course.title,
        currentVisibility: course.isShow,
      });
    }
  };

  const handleDeleteSuccess = () => {
    // TODO: 강의 목록 새로고침 또는 낙관적 업데이트
    console.log('강의 삭제 성공');
  };

  const handleToggleSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Lectures</h2>
            <p className="text-muted-foreground mt-1">Create and manage your lectures</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading lectures...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Lectures</h2>
            <p className="text-muted-foreground mt-1">Create and manage your lectures</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive">Failed to load lectures.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Lectures</h2>
          <p className="text-muted-foreground mt-1">Create and manage your lectures</p>
        </div>
        <Button asChild>
          <Link href="/creator/courses/new">
            New Lecture <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <CourseFilters
        table={table}
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setPageIndex(0); // 검색 시 첫 페이지로 리셋
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={(filter) => {
          setStatusFilter(filter);
          setPageIndex(0); // 필터 변경 시 첫 페이지로 리셋
        }}
        totalCount={pagination?.totalItems ?? courses.length}
        filteredCount={filteredAndSortedCourses.length}
      />

      {/* 강의 목록 */}
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => {
          return (
            <CourseCard
              key={row.original.courseId}
              course={row.original}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStats={handleViewStats}
              onToggleVisibility={handleToggleVisibility}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Video className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">아직 강의가 없습니다</h3>
          <p className="text-muted-foreground mb-4">첫 번째 강의를 만들어보세요!</p>
          <Button asChild>
            <Link href="/creator/courses/new">
              <Plus className="mr-2 h-4 w-4" />새 강의 만들기
            </Link>
          </Button>
        </div>
      )}
      {pagination && pagination.totalPages > 1 && <TanstackTablePagination table={table} />}

      {/* 다이얼로그들 */}
      <DeleteCourseDialog
        courseId={deleteDialog.courseId}
        courseTitle={deleteDialog.courseTitle}
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleDeleteSuccess}
      />

      <ToggleVisibilityDialog
        courseId={toggleVisibilityDialog.courseId}
        courseTitle={toggleVisibilityDialog.courseTitle}
        currentVisibility={toggleVisibilityDialog.currentVisibility}
        isOpen={toggleVisibilityDialog.isOpen}
        onClose={() => setToggleVisibilityDialog((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleToggleSuccess}
      />
    </div>
  );
}
