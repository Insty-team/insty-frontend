'use client';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import Image from 'next/image';

import ConfirmModal from '@/shared/components/ConfirmModal';
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
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Spinner } from '@/shared/components/ui/spinner';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import useVideoPlaylist from '@/shared/hooks/video/useVideoPlaylist';
import dayjs from 'dayjs';
import { Calendar, Heart, MoreHorizontal } from 'lucide-react';

const CommentVideoPlayer = ({
  commentId,
  videoType,
}: {
  commentId: number;
  videoType: 'COURSE' | 'ANSWER' | 'QUESTION' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';
}) => {
  const { m3u8Url, isLoading } = useVideoPlaylist({
    type: videoType,
    id: commentId.toString(),
    enabled: !!commentId,
  });

  return (
    <div className="mt-3 overflow-hidden rounded-lg border">
      {isLoading || !m3u8Url ? (
        <Skeleton className="aspect-video w-full" />
      ) : (
        <ReactPlayer src={m3u8Url} controls width="100%" height="100%" />
      )}
    </div>
  );
};

type Comment = {
  commentId: number;
  user?: {
    id?: number;
    nickname?: string;
  };
  content: string;
  createdAt?: string;
  attachments?: Array<{
    id: number;
    url: string;
    name: string;
    contentType?: string;
    size?: number;
  }>;
  videoInfo?: {
    videoType: 'COURSE' | 'ANSWER' | 'QUESTION' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';
    videoUuid: string;
    originFileName?: string;
  } | null;
  likeCount?: number;
  likedByMe?: boolean;
};

type CommunityCommentsProps = {
  comments: Comment[];
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
  };
  showLikeButton?: boolean;
  onLikeComment?: (commentId: number, likedByMe: boolean) => void;
  currentUserId?: number;
  onDeleteComment?: (commentId: number) => void;
  enableEdit?: boolean;
  onSaveEdit?: (
    commentId: number,
    content: string,
    files: File[],
    deleteAttachmentIds: number[],
    videoUuid?: string | null,
  ) => void;
  isSavingEdit?: boolean;
  onEditStart?: (commentId: number) => void;
  isLoading?: boolean;
  isError?: boolean;
};

export default function CommunityComments({
  comments,
  hasNextPage = false,
  onLoadMore,
  isLoadingMore = false,
  pagination,
  showLikeButton = false,
  onLikeComment,
  currentUserId,
  onDeleteComment,
  enableEdit = false,
  isLoading = false,
  isError = false,
  onSaveEdit,
  isSavingEdit = false,
  onEditStart,
}: CommunityCommentsProps) {
  const { uploadVideo } = usePresignedVideoUpload();

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editExistingAttachments, setEditExistingAttachments] = useState<any[]>([]);
  const [editExistingVideo, setEditExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);
  const [isSaveEditDialogOpen, setIsSaveEditDialogOpen] = useState(false);

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.content);
    setEditFiles([]);
    setEditExistingAttachments(comment.attachments || []);
    setEditExistingVideo(comment.videoInfo ? { originFileName: comment.videoInfo.originFileName } : null);
    setDeleteAttachmentIds([]);
    onEditStart?.(comment.commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
    setEditFiles([]);
    setEditExistingAttachments([]);
    setEditExistingVideo(null);
    setDeleteAttachmentIds([]);
  };

  const handleRemoveEditExistingAttachment = (attachmentId: number) => {
    setDeleteAttachmentIds((prev) => [...prev, attachmentId]);
    setEditExistingAttachments((prev) => prev.filter((att) => att?.id !== attachmentId));
  };

  const handleSaveEdit = () => {
    if (!editingCommentId || !onSaveEdit || !editContent.trim()) return;
    setIsSaveEditDialogOpen(true);
  };

  const confirmSaveEdit = () => {
    if (!editingCommentId || !onSaveEdit || !editContent.trim()) return;
    setIsSaveEditDialogOpen(false);

    const images = editFiles.filter((f) => f.type.startsWith('image/'));
    const videoFile = editFiles.find((f) => f.type.startsWith('video/')) ?? null;

    const run = async () => {
      try {
        let videoUuid: string | null;
        const editingComment = comments.find((c) => c.commentId === editingCommentId);

        if (videoFile) {
          // 새 비디오 업로드
          videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
        } else if (editingComment?.videoInfo && !editExistingVideo) {
          // 기존 비디오 삭제
          videoUuid = null;
        } else if (editingComment?.videoInfo) {
          // 기존 비디오 유지
          videoUuid = editingComment.videoInfo.videoUuid;
        } else {
          // 비디오 없음
          videoUuid = null;
        }

        onSaveEdit(editingCommentId, editContent, images, deleteAttachmentIds, videoUuid);
        // 저장 후 상태 초기화는 부모 컴포넌트에서 처리
        handleCancelEdit();
      } catch (e) {
        console.error('댓글 비디오 업로드/수정 실패:', e);
      }
    };

    void run();
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
        <Spinner className="size-4" />
        Loading comments...
      </div>
    );
  }

  if (isError) {
    return <div className="text-muted-foreground py-8 text-center text-sm">Failed to load comments.</div>;
  }

  if (comments.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {comments.map((comment, index) => {
        const isEditing = editingCommentId === comment.commentId;
        const isMyComment = currentUserId && comment.user?.id === currentUserId;

        return (
          <div key={comment.commentId} className={`p-6 ${index < comments.length - 1 ? 'border-b' : ''}`}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {comment.user?.nickname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{comment.user?.nickname}</div>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {comment.createdAt ? dayjs(comment.createdAt).format('MMM D, YYYY h:mm A') : ''}
                  </div>
                </div>
              </div>

              {isMyComment && (enableEdit || onDeleteComment) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {enableEdit && <DropdownMenuItem onClick={() => handleStartEdit(comment)}>Edit</DropdownMenuItem>}
                    {onDeleteComment && (
                      <DropdownMenuItem className="text-destructive" onClick={() => onDeleteComment(comment.commentId)}>
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <CommunityTextArea
                    value={editContent}
                    onChange={setEditContent}
                    placeholder="Edit your comment..."
                    showAttachButton={true}
                    onFilesChange={setEditFiles}
                    existingAttachments={editExistingAttachments}
                    onRemoveExistingAttachment={handleRemoveEditExistingAttachment}
                    existingVideo={editExistingVideo}
                    onRemoveExistingVideo={() => setEditExistingVideo(null)}
                    isSending={isSavingEdit}
                    className="rounded-md"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSavingEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editContent.trim() || isSavingEdit}>
                      {isSavingEdit ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</div>

                  {comment.videoInfo?.videoUuid && (
                    <CommentVideoPlayer commentId={comment.commentId} videoType={comment.videoInfo.videoType} />
                  )}

                  {comment.attachments &&
                    comment.attachments.some((att) => att?.url && att.contentType?.startsWith('image/')) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {comment.attachments
                          .filter((attachment) => attachment?.url && attachment.contentType?.startsWith('image/'))
                          .map((attachment) => (
                            <div key={attachment.id} className="relative inline-block">
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-32 w-auto rounded border object-contain"
                              />
                            </div>
                          ))}
                      </div>
                    )}

                  {/* 댓글 좋아요 */}
                  {showLikeButton && onLikeComment ? (
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        comment.likedByMe
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => onLikeComment(comment.commentId, comment.likedByMe ?? false)}
                    >
                      <Heart className={`h-4 w-4 ${comment.likedByMe ? 'fill-current' : ''}`} />
                      <span className="text-xs">{comment.likeCount ?? 0}</span>
                    </button>
                  ) : (
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{comment.likeCount ?? 0}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* 더보기 버튼 */}
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center px-6 py-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore} className="w-full">
            {isLoadingMore
              ? 'Loading...'
              : `Load More (${pagination?.currentPage || 1} / ${pagination?.totalPages || 1})`}
          </Button>
        </div>
      )}

      <ConfirmModal
        open={isSaveEditDialogOpen}
        onOpenChange={setIsSaveEditDialogOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        isConfirming={isSavingEdit}
        onConfirm={confirmSaveEdit}
      />
    </div>
  );
}
