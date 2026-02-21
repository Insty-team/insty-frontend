
'use client';

import { useState } from 'react';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { ArrowLeft } from 'lucide-react';
import {
  useGetCourseCommunityPostById,
  useGetCourseCommunityPostCommentsInfinite,
} from '@/shared/services/community/community.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import CommunityPostDetail from '@/shared/components/community/CommunityPostDetail';
import CommunityComments from '@/shared/components/community/CommunityComments';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useCommunityComments } from '@/shared/hooks/community/useCommunityComments';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';

type Props = {
  courseId: string;
  courseName: string;
  postId: number;
  onBack: () => void;
};

export default function CommunityDetail({ courseId, courseName, postId, onBack }: Props) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  const courseIdNumber = Number(courseId);
  
  const { data: post, isLoading, isError } = useGetCourseCommunityPostById(courseIdNumber, postId);
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseCommunityPostCommentsInfinite(courseIdNumber, postId, 20);

  const comments = commentsData?.items || [];
  const pagination = commentsData?.pagination;
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const { uploadVideo } = usePresignedVideoUpload();
  
  const {
    togglePostLike,
    isLikingPost: isLiking,
    isUnlikingPost: isUnliking,
  } = useCommunity({ courseId: courseIdNumber });

  const {
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCreatingComment: isPosting,
    isUpdatingComment: isPatchingComment,
    isDeletingComment,
    isLikingComment,
    isUnlikingComment,
  } = useCommunityComments({ courseId: courseIdNumber, postId });

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCommentToDelete(null);
        },
      });
    }
  };

  const handleToggleLike = () => {
    if (!post) return;
    if (isLiking || isUnliking) return;
    togglePostLike(postId, post.likedByMe ?? false);
  };

  const handleToggleCommentLike = (commentId: number, likedByMe: boolean) => {
    if (isLikingComment || isUnlikingComment) return;
    toggleCommentLike(commentId, likedByMe);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    const images = attachedFiles.filter((f) => f.type.startsWith('image/'));
    const videoFile = attachedFiles.find((f) => f.type.startsWith('video/')) ?? null;

    try {
      let videoUuid: string | undefined;
      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
      }

      createComment(
        {
          content: commentContent,
          videoUuid,
          attachments: images.length > 0 ? images : null,
        },
        {
          onSuccess: () => {
            setCommentContent('');
            setAttachedFiles([]);
            setEditorKey((prev) => prev + 1);
            setIsCommenting(false);
          },
        },
      );
    } catch (e) {
      console.error('댓글 비디오 업로드/작성 실패:', e);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Post Detail</h3>
          </div>
        </div>
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Post Detail</h3>
          </div>
        </div>
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Failed to load post</p>
            <Button variant="outline" onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold">
            {courseName}
          </h3>
        </div>
        <div className="size-8"></div>
      </div>

      {/* 포스트 상세 내용부터 스크롤 */}
      <ScrollArea className="max-w-3xl mx-auto h-full rounded-lg h-[calc(100vh-20rem)] bg-white">
        <div className="p-6">
          <CommunityPostDetail
            postData={post}
            onToggleLike={handleToggleLike}
            onToggleComment={() => setIsCommenting(!isCommenting)}
            isLiking={isLiking}
            isUnliking={isUnliking}
          />

        {/* 댓글 섹션 */}
        <div>
          {/* 댓글 작성 폼 */}
          <div className={`transition-all duration-300 ease-in-out ${isCommenting ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            {isCommenting && (
              <Card className="border-b shadow-none">
                <CardContent className="">
                  <CommunityTextArea
                    key={editorKey}
                    value={commentContent}
                    onChange={setCommentContent}
                    onSend={handleSubmitComment}
                    placeholder="Write a comment..."
                    showSendButton={true}
                    showAttachButton={true}
                    isSending={isPosting}
                    onFilesChange={setAttachedFiles}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          
          {comments.length === 0 ? (
            <Card className="shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </CardContent>
            </Card>
          ) : (
            <CommunityComments
              comments={comments}
              hasNextPage={hasNextPage}
              onLoadMore={handleLoadMore}
              isLoadingMore={isFetchingNextPage}
              pagination={{
                currentPage: pagination?.currentPage,
                totalPages: pagination?.totalPages,
              }}
              currentUserId={currentUserId}
              showLikeButton={true}
              onLikeComment={handleToggleCommentLike}
              enableEdit={true}
              onSaveEdit={async (commentId, content, files, deleteAttachmentIds, videoUuid) => {
                await updateComment(commentId, {
                  content,
                  videoUuid: videoUuid ?? undefined,
                  attachments: files ?? null,
                  deleteFileIds:
                    deleteAttachmentIds.length > 0 ? deleteAttachmentIds : null,
                });
              }}
              isSavingEdit={isPatchingComment}
              onDeleteComment={handleDeleteComment}
            />
          )}
        </div>
        </div>
      </ScrollArea>

      <ConfirmModal
        open={deleteDialogOpen}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) setCommentToDelete(null);
        }}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingComment}
        onConfirm={confirmDeleteComment}
      />
    </div>
  );
}