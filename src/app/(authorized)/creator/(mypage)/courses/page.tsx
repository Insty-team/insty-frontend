'use client';

import { CourseCard } from './_components/CourseCard';
import { CourseFilters, SortOption, StatusFilter } from './_components/CourseFilters';
import { CourseStats } from './_components/CourseStats';
import { DeleteCourseDialog } from './_components/DeleteCourseDialog';
import { ToggleVisibilityDialog } from './_components/ToggleVisibilityDialog';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useGetCoursesMy } from '@/shared/services/course/course.hook';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Plus, Video } from 'lucide-react';

export default function CreatorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);

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
  const { data: coursesData, isLoading, error } = useGetCoursesMy(pageIndex + 1, pageSize);
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

    // 상태 필터
    if (statusFilter === 'public') {
      filtered = filtered.filter((course: CourseMyResponse) => course.isShow);
    } else if (statusFilter === 'private') {
      filtered = filtered.filter((course: CourseMyResponse) => !course.isShow);
    }

    // 정렬
    filtered.sort((a: CourseMyResponse, b: CourseMyResponse) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'views':
          return b.viewCount - a.viewCount;
        case 'comments':
          return b.commentCount - a.commentCount;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchQuery, sortBy, statusFilter]);

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: filteredAndSortedCourses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: pagination?.totalItems ?? 0,
    pageCount: pagination?.totalPages ?? 0,
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

  // 공개/비공개 강의 분리
  const publishCourses = filteredAndSortedCourses.filter((course: CourseMyResponse) => course.isShow);
  const privateCourses = filteredAndSortedCourses.filter((course: CourseMyResponse) => !course.isShow);

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
    // TODO: 강의 목록 새로고침 또는 낙관적 업데이트
    console.log('공개 상태 변경 성공');
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

      {/* 통계 요약 */}
      {courses.length > 0 && <CourseStats courses={courses} />}

      {/* 필터 및 검색 */}
      <CourseFilters
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
      {filteredAndSortedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Video className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            {searchQuery || statusFilter !== 'all' ? 'No search results' : 'No lectures yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try different search terms or filters.'
              : 'Create your first lecture!'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button asChild>
              <Link href="/creator/courses/new">
                New Lecture <Plus className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({table.getRowCount()})</TabsTrigger>
            <TabsTrigger value="public">Public ({publishCourses.length})</TabsTrigger>
            <TabsTrigger value="private">Private ({privateCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {filteredAndSortedCourses.map((course: CourseMyResponse) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewStats={handleViewStats}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </TabsContent>

          <TabsContent value="public" className="mt-6 space-y-4">
            {publishCourses.map((course: CourseMyResponse) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewStats={handleViewStats}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </TabsContent>

          <TabsContent value="private" className="mt-6 space-y-4">
            {privateCourses.map((course: CourseMyResponse) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewStats={handleViewStats}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
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
              const currentPage = pagination.currentPage;
              const totalPages = pagination.totalPages;
              const pages: (number | 'ellipsis')[] = [];

              if (totalPages <= 7) {
                // 총 페이지가 7개 이하면 모두 표시
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // 첫 페이지
                pages.push(1);

                if (currentPage <= 3) {
                  // 현재 페이지가 앞쪽에 있으면
                  for (let i = 2; i <= 4; i++) {
                    pages.push(i);
                  }
                  pages.push('ellipsis');
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                  // 현재 페이지가 뒤쪽에 있으면
                  pages.push('ellipsis');
                  for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // 현재 페이지가 중간에 있으면
                  pages.push('ellipsis');
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
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
