'use client';

import { useState } from 'react';
import ReactPlayer from 'react-player';

import Image from 'next/image';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Spinner } from '@/shared/components/ui/spinner';
import useVideoPlaylist from '@/shared/hooks/video/useVideoPlaylist';
import { VideoType } from '@/shared/services/community/community.type';
import dayjs from 'dayjs';
import { Calendar, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

const CommunityPostVideoPlayer = ({ postId, videoType }: { postId: number; videoType: VideoType }) => {
  const { m3u8Url, isLoading: isLoadingVideo } = useVideoPlaylist({
    type: videoType,
    id: postId.toString(),
    enabled: !!postId,
  });

  return (
    <div className="mt-3 overflow-hidden rounded-lg border">
      {isLoadingVideo || !m3u8Url ? (
        <div className="bg-muted flex items-center justify-center py-12">
          <Spinner className="size-6" />
        </div>
      ) : (
        <div className="aspect-video">
          <ReactPlayer src={m3u8Url} controls width="100%" height="100%" />
        </div>
      )}
    </div>
  );
};

type Attachment = {
  id: number;
  name: string;
  url: string;
};

type VideoInfo = {
  videoType: VideoType;
  videoUuid: string;
  originFileName: string;
};

type Post = {
  postId: number;
  courseId?: number;
  user?: {
    id: number;
    nickname: string;
  };
  content: string;
  createdAt: string;
  attachments?: Attachment[];
  videoInfo?: VideoInfo | null;
  likeCount?: number;
  commentCount?: number;
  likedByMe?: boolean;
};

type CommunityPostListActions = {
  onPostClick?: (postId: number) => void;
  onLike?: (postId: number, isLiked: boolean, e: React.MouseEvent) => void;
  onEdit?: (post: Post, e: React.MouseEvent) => void;
  onDelete?: (postId: number, e: React.MouseEvent) => void;
};

type CommunityPostListEdit = {
  editingPostId: number | null;
  editPostContent: string;
  editPostFiles: File[];
  editPostExistingAttachments: any[];
  editPostExistingVideo?: { originFileName?: string } | null;
  onEditContentChange: (content: string) => void;
  onEditFilesChange: (files: File[]) => void;
  onRemoveExistingAttachment: (id: number) => void;
  onRemoveExistingVideo?: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  isUpdatingPost?: boolean;
};

type CommunityPostListPaging = {
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  currentPage?: number;
  totalPages?: number;
};

type CommunityPostListStatus = {
  isLoading?: boolean;
  isError?: boolean;
};

type CommunityPostListProps = {
  posts: Post[];
  currentUserId?: number;
  actions?: CommunityPostListActions;
  edit?: CommunityPostListEdit;
  paging?: CommunityPostListPaging;
  status?: CommunityPostListStatus;
};

export default function CommunityPostList({
  posts,
  currentUserId,
  actions,
  edit,
  paging,
  status,
}: CommunityPostListProps) {
  const isLoading = status?.isLoading ?? false;
  const isError = status?.isError ?? false;
  const hasMore = paging?.hasMore ?? false;
  const onLoadMore = paging?.onLoadMore;
  const isLoadingMore = paging?.isLoadingMore ?? false;
  const currentPage = paging?.currentPage;
  const totalPages = paging?.totalPages;

  if (isLoading) {
    return <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">Loading...</div>;
  }

  if (isError) {
    return <div className="text-muted-foreground py-8 text-center text-sm">Failed to load community posts.</div>;
  }

  if (posts.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">No posts yet. Be the first to start a conversation!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((item, index) => (
        <Card
          key={item.postId}
          className={`cursor-pointer rounded-none shadow-none ${index < posts.length - 1 ? 'border-b' : ''}`}
          onClick={() => actions?.onPostClick?.(item.postId)}
        >
          <CardContent className="p-4">
            {/* 포스트 헤더 */}
            <div className="mb-3 flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {item.user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{item.user?.nickname}</div>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  {item.createdAt ? dayjs(item.createdAt).format('MMM D, YYYY h:mm A') : ''}
                </div>
              </div>
              {item.user?.id === currentUserId && (actions?.onEdit || actions?.onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    {actions?.onEdit && (
                      <DropdownMenuItem onClick={(e) => actions.onEdit?.(item, e)}>Edit</DropdownMenuItem>
                    )}
                    {actions?.onDelete && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => actions.onDelete?.(item.postId, e)}
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* 포스트 내용 */}
            {edit?.editingPostId === item.postId ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <CommunityTextArea
                  value={edit.editPostContent}
                  onChange={edit.onEditContentChange}
                  placeholder="Edit your post..."
                  showAttachButton={true}
                  onFilesChange={edit.onEditFilesChange}
                  existingAttachments={edit.editPostExistingAttachments}
                  onRemoveExistingAttachment={edit.onRemoveExistingAttachment}
                  existingVideo={edit.editPostExistingVideo}
                  onRemoveExistingVideo={edit.onRemoveExistingVideo}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={edit.onCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={edit.onSaveEdit}
                    disabled={!edit.editPostContent.trim() || (edit.isUpdatingPost ?? false)}
                  >
                    {edit.isUpdatingPost ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </div>

                {/* 비디오 */}
                {item.videoInfo?.videoUuid && item.postId && (
                  <CommunityPostVideoPlayer postId={item.postId} videoType={item.videoInfo.videoType} />
                )}

                {/* 이미지 */}
                {item.attachments && item.attachments.length > 0 && (
                  <div className="mt-3 grid max-w-md grid-cols-2 gap-2">
                    {item.attachments
                      .filter((file) => file?.url)
                      .slice(0, 2)
                      .map((file) => (
                        <div key={file.id} className="relative aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 200px"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {/* 포스트 푸터 */}
            {edit?.editingPostId !== item.postId && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    item.likedByMe ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={(e) => actions?.onLike?.(item.postId, item.likedByMe || false, e)}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      item.likedByMe ? 'scale-110 fill-current' : 'scale-100'
                    }`}
                  />
                  <span className="text-sm">{item.likeCount || 0}</span>
                </button>
                <div className="text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{item.commentCount || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* 더보기 버튼 */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center p-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore} className="w-full">
            {isLoadingMore
              ? 'Loading...'
              : `Load More${typeof currentPage === 'number' && typeof totalPages === 'number' ? ` (${currentPage} / ${totalPages})` : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}
