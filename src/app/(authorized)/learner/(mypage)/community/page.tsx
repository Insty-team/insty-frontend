'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TanstackTablePagination } from '@/shared/components/TanstackTablePagination';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useGetCoursesProgressByMe } from '@/shared/services/course/course.hook';
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Calendar, Play } from 'lucide-react';
import CommunityFeed from './_components/CommunityFeed';
import CommunityDetail from './_components/CommuniryDetail';

type CommunityRow = {
  id: string;
  title: string;
  createdDate: string;
  thumbnail: string;
};

export default function LearnerCommunityPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const router = useRouter();

  const {
    data: communityResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCoursesProgressByMe(pageIndex + 1, pageSize);

  const pagination = communityResponse?.pagination;

  const communityPosts = useMemo<CommunityRow[]>(() => {
    const items = communityResponse?.items;
    if (!items?.length) {
      return [];
    }

    return items.map((post) => {
      type ExtendedPost = typeof post & {
        createdDate?: string;
        thumbnail?: string;
      };

    const extended = post as ExtendedPost;

    const rawCreatedDate = extended.createdDate ?? extended.createdAt;
    let formattedCreatedDate = 'Date info unavailable';
    if (rawCreatedDate) {
      const date = new Date(rawCreatedDate);
      formattedCreatedDate = Number.isNaN(date.getTime()) ? rawCreatedDate : date.toLocaleDateString('en-US');
    }

    const thumbnail = extended.thumbnail ?? extended.thumbnailUrl ?? '';

    return {
      id: post.courseId,
      title: post.title ?? 'Untitled Post',
      createdDate: formattedCreatedDate,
      thumbnail,
    };
  });
}, [communityResponse]);

  const columns = useMemo<ColumnDef<CommunityRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Post ID',
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'createdDate',
        header: 'Created Date',
      },
    ],
    [],
  );

  const table = useReactTable({
    data: communityPosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0,
    rowCount: pagination?.totalItems ?? communityPosts.length,
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

  const showLoadingState = isLoading || (isFetching && communityPosts.length === 0);

  return (
    <div className="space-y-6">
      {selectedPost ? (
        <CommunityDetail
          courseId={selectedCourse?.id || ''}
          courseName={selectedCourse?.title || ''}
          postId={selectedPost}
          onBack={() => setSelectedPost(null)}
        />
      ) : selectedCourse ? (
        <CommunityFeed
          courseId={selectedCourse.id}
          courseName={selectedCourse.title}
          onBack={() => setSelectedCourse(null)}
          onPostClick={(postId) => setSelectedPost(postId)}
        />
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold">Community Activity</h2>
            <p className="text-muted-foreground mt-1">Check your community activity by purchased course</p>
          </div>

          {showLoadingState ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground">Loading community activity...</p>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">Failed to load community activity</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : communityPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">No community activity yet</p>
                <Button>Browse Community</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent>
                    <div className="flex gap-8">
                      <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-48">
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
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
                                {post.title}
                              </h3>

                              {/* 통계 정보 */}
                              <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {dayjs(post.createdDate).format('YYYY.MM.DD')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" onClick={() => setSelectedCourse({ id: post.id, title: post.title })}>
                            View Posts
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
        </>
      )}
    </div>
  );
}
