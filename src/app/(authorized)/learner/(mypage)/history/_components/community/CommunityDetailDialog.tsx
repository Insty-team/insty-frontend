'use client';

import { useState } from 'react';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  useGetCourseCommunityPostById,
  useGetCourseCommunityPostCommentsInfinite,
} from '@/shared/services/community/community.hook';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useCommunityComments } from '@/shared/hooks/community/useCommunityComments';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { useGetProfile } from '@/shared/services/user/user.hook';
import CommunityPostDetail from '@/shared/components/community/CommunityPostDetail';
import CommunityComments from '@/shared/components/community/CommunityComments';
import { toast } from 'sonner';

type Props = {
  courseId: number;
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CommunityDetailDialog({ courseId, postId, open, onOpenChange }: Props) {
  const { data: profile } = useGetProfile();
  const { data: post, isLoading, isError } = useGetCourseCommunityPostById(courseId, postId, { enabled: open });
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseCommunityPostCommentsInfinite(courseId, postId, 20);

  const { togglePostLike, isLikingPost: isLiking, isUnlikingPost: isUnliking } = useCommunity({ courseId });
  const {
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCreatingComment: isPostingComment,
    isUpdatingComment: isPatchingComment,
    isDeletingComment,
    isLikingComment,
    isUnlikingComment,
  } = useCommunityComments({ courseId, postId });

  const { uploadVideo } = usePresignedVideoUpload();

  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const comments = commentsData?.items || [];
  const pagination = commentsData?.pagination;

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleToggleLike = async () => {
    if (!post) return;
    if (isLiking || isUnliking) return;

    try {
      await togglePostLike(postId, post.likedByMe ?? false);
    } catch (error: any) {
      console.error('커뮤니티 글 좋아요 처리 실패:', error);
      toast.error('Failed to update like.');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    try {
      const images = commentFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = commentFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | undefined;

      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
      }

      await createComment(
        {
          content: commentContent,
          videoUuid,
          attachments: images.length > 0 ? images : null,
        },
        {
          onSuccess: () => {
            setCommentContent('');
            setCommentFiles([]);
            setEditorKey((prev) => prev + 1);
            setIsCommenting(false);
          },
        },
      );
    } catch (error: any) {
      console.error('댓글 작성 실패:', error);
      toast.error('Failed to post comment.');
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = () => {
    if (!commentToDelete) return;

    (async () => {
      try {
        await deleteComment(commentToDelete, {
          onSuccess: () => {
            setCommentToDelete(null);
          },
        });
      } catch (error: any) {
        console.error('댓글 삭제 실패:', error);
        toast.error('Failed to delete comment.');
      }
    })();
  };

  const handleToggleCommentLike = (commentId: number, likedByMe: boolean) => {
    if (isLikingComment || isUnlikingComment) return;

    (async () => {
      try {
        await toggleCommentLike(commentId, likedByMe);
      } catch (error: any) {
        console.error('댓글 좋아요 처리 실패:', error);
        toast.error('Failed to update like.');
      }
    })();
  };

  const handleSaveEditComment = (
    commentId: number,
    content: string,
    files: File[],
    deleteAttachmentIds: number[],
    videoUuid?: string | null,
  ) => {
    if (!content.trim()) return;

    (async () => {
      try {
        await updateComment(commentId, {
          content,
          videoUuid: videoUuid ?? undefined,
          attachments: files.length > 0 ? files : null,
          deleteFileIds: deleteAttachmentIds.length > 0 ? deleteAttachmentIds : null,
        });
      } catch (error: any) {
        console.error('댓글 수정 실패:', error);
        toast.error('Failed to update comment.');
      }
    })();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 sm:max-w-4xl">
          <VisuallyHidden>
            <DialogTitle>Community Post Detail</DialogTitle>
          </VisuallyHidden>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : isError || !post ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">Failed to load post</p>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
                Close
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[90vh]">
              <div className="p-6 space-y-6">
                <CommunityPostDetail
                  postData={post}
                  onToggleLike={handleToggleLike}
                  onToggleComment={() => setIsCommenting((prev) => !prev)}
                  isLiking={isLiking}
                  isUnliking={isUnliking}
                />

                {/* 댓글 섹션 */}
                {isCommenting && (
                  <CommunityTextArea
                    key={editorKey}
                    value={commentContent}
                    onChange={setCommentContent}
                    placeholder="Write a comment..."
                    onSend={handleSubmitComment}
                    showSendButton={true}
                    showAttachButton={true}
                    onFilesChange={setCommentFiles}
                    isSending={isPostingComment}
                    className="rounded-md"
                  />
                )}
                <CommunityComments
                  comments={comments}
                  hasNextPage={hasNextPage}
                  onLoadMore={handleLoadMore}
                  isLoadingMore={isFetchingNextPage}
                  pagination={{
                    currentPage: pagination?.currentPage,
                    totalPages: pagination?.totalPages,
                  }}
                  currentUserId={profile?.id}
                  showLikeButton={true}
                  onLikeComment={handleToggleCommentLike}
                  enableEdit={true}
                  onSaveEdit={handleSaveEditComment}
                  isSavingEdit={isPatchingComment}
                  onDeleteComment={handleDeleteComment}
                />
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={Boolean(commentToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setCommentToDelete(null);
        }}
        title="Delete Comment?"
        description="This action cannot be undone. Are you sure you want to delete this comment?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingComment}
        onConfirm={confirmDeleteComment}
      />
    </>
  );
}
