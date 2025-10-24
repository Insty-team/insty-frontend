'use client';

import { CourseCard } from './_components/CourseCard';
import { CourseFilters, SortOption, StatusFilter } from './_components/CourseFilters';
import { CourseStats } from './_components/CourseStats';
import { DeleteCourseDialog } from './_components/DeleteCourseDialog';
import { ToggleVisibilityDialog } from './_components/ToggleVisibilityDialog';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useGetCoursesMy } from '@/shared/services/course/course.hook';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import { Plus, Video } from 'lucide-react';

export default function CreatorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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

  // API에서 강의 데이터 가져오기
  const { data: coursesData, isLoading, error } = useGetCoursesMy();
  const courses = coursesData?.items || [];

  // 필터링 및 정렬된 강의 목록
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
    if (statusFilter === 'published') {
      filtered = filtered.filter((course: CourseMyResponse) => course.isShow);
    } else if (statusFilter === 'draft') {
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

  // 공개/비공개 강의 분리
  const publishedCourses = filteredAndSortedCourses.filter((course: CourseMyResponse) => course.isShow);
  const draftCourses = filteredAndSortedCourses.filter((course: CourseMyResponse) => !course.isShow);

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
            <h2 className="text-2xl font-bold">내 강의 관리</h2>
            <p className="text-muted-foreground mt-1">강의를 생성하고 관리하세요</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">강의 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">내 강의 관리</h2>
            <p className="text-muted-foreground mt-1">강의를 생성하고 관리하세요</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive">강의 목록을 불러오는데 실패했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">내 강의 관리</h2>
          <p className="text-muted-foreground mt-1">강의를 생성하고 관리하세요</p>
        </div>
        <Button asChild>
          <Link href="/creator/courses/new">
            <Plus className="mr-2 h-4 w-4" />새 강의 만들기
          </Link>
        </Button>
      </div>

      {/* 통계 요약 */}
      {courses.length > 0 && <CourseStats courses={courses} />}

      {/* 필터 및 검색 */}
      <CourseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={courses.length}
        filteredCount={filteredAndSortedCourses.length}
      />

      {/* 강의 목록 */}
      {filteredAndSortedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Video className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            {searchQuery || statusFilter !== 'all' ? '검색 결과가 없습니다' : '아직 강의가 없습니다'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? '다른 검색어나 필터를 시도해보세요.'
              : '첫 번째 강의를 만들어보세요!'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button asChild>
              <Link href="/creator/courses/new">
                <Plus className="mr-2 h-4 w-4" />새 강의 만들기
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">전체 ({filteredAndSortedCourses.length})</TabsTrigger>
            <TabsTrigger value="published">공개 ({publishedCourses.length})</TabsTrigger>
            <TabsTrigger value="draft">비공개 ({draftCourses.length})</TabsTrigger>
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

          <TabsContent value="published" className="mt-6 space-y-4">
            {publishedCourses.map((course: CourseMyResponse) => (
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

          <TabsContent value="draft" className="mt-6 space-y-4">
            {draftCourses.map((course: CourseMyResponse) => (
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
