'use client';

import { useState } from 'react';

import CommunityComments from '@/shared/components/community/CommunityComments';
import CommunityPostDetail from '@/shared/components/community/CommunityPostDetail';
import ConfirmModal from '@/shared/components/ConfirmModal';
import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useCommunityComments } from '@/shared/hooks/community/useCommunityComments';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import {
  useGetCourseCommunityPostById,
  useGetCourseCommunityPostCommentsInfinite,
} from '@/shared/services/community/community.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { MoreHorizontal } from 'lucide-react';
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
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetCourseCommunityPostCommentsInfinite(courseId, postId, 20);

  const {
    togglePostLike,
    updatePost,
    deletePost,
    isLikingPost: isLiking,
    isUnlikingPost: isUnliking,
    isUpdatingPost,
    isDeletingPost,
  } = useCommunity({ courseId });
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostFiles, setEditPostFiles] = useState<File[]>([]);
  const [editPostExistingAttachments, setEditPostExistingAttachments] = useState<any[]>([]);
  const [editPostExistingVideo, setEditPostExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [editPostDeleteIds, setEditPostDeleteIds] = useState<number[]>([]);
  const [editPostEditorKey, setEditPostEditorKey] = useState(0);

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

  const handleEditPost = () => {
    if (!post) return;
    setEditPostContent(post.content ?? '');
    setEditPostExistingAttachments(post.attachments ?? []);
    setEditPostExistingVideo(post.videoInfo ? { originFileName: post.videoInfo.originFileName } : null);
    setEditPostFiles([]);
    setEditPostDeleteIds([]);
    setEditPostEditorKey((prev) => prev + 1);
    setIsEditingPost(true);
  };

  const handleCancelEditPost = () => {
    setIsEditingPost(false);
    setEditPostContent('');
    setEditPostFiles([]);
    setEditPostExistingAttachments([]);
    setEditPostExistingVideo(null);
    setEditPostDeleteIds([]);
    setEditPostEditorKey((prev) => prev + 1);
  };

  const handleEditPostFilesChange = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    const video = files.find((f) => f.type.startsWith('video/')) ?? null;
    const imageFiles = images.slice(0, 2);
    const videoFile = video ? [video] : [];
    setEditPostFiles([...imageFiles, ...videoFile]);
  };

  const handleRemoveEditPostExistingAttachment = (attachmentId: number) => {
    setEditPostExistingAttachments((prev) => prev.filter((file) => file.id !== attachmentId));
    setEditPostDeleteIds((prev) => (prev.includes(attachmentId) ? prev : [...prev, attachmentId]));
  };

  const handleSaveEditPost = async () => {
    if (!editPostContent.trim()) return;

    try {
      const images = editPostFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = editPostFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | null;

      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_POST', file: videoFile });
      } else if (post?.videoInfo && !editPostExistingVideo) {
        videoUuid = null;
      } else if (post?.videoInfo) {
        videoUuid = post.videoInfo.videoUuid;
      } else {
        videoUuid = null;
      }

      await updatePost(
        postId,
        {
          content: editPostContent.trim(),
          videoUuid,
          attachments: images.length > 0 ? images : null,
          deleteFileIds: editPostDeleteIds.length > 0 ? editPostDeleteIds : null,
        },
        {
          onSuccess: () => {
            toast.success('Post updated successfully.');
            handleCancelEditPost();
          },
        },
      );
    } catch (error: any /* eslint-disable-next-line @typescript-eslint/no-explicit-any */) {
      console.error('커뮤니티 글 수정 실패:', error);
      toast.error('Failed to update post.');
    }
  };

  const handleDeletePost = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    deletePost(postId, {
      onSuccess: () => {
        toast.success('Post deleted successfully.');
        setIsDeleteDialogOpen(false);
        onOpenChange(false);
      },
    });
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    try {
      const images = commentFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = commentFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | null;

      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
      } else {
        videoUuid = null;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const images = files.filter((f) => f.type.startsWith('image/'));
        const videoFile = files.find((f) => f.type.startsWith('video/')) ?? null;
        let finalVideoUuid: string | null;

        if (videoFile) {
          finalVideoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
        } else if (videoUuid !== undefined) {
          finalVideoUuid = videoUuid;
        } else {
          finalVideoUuid = null;
        }

        await updateComment(commentId, {
          content,
          videoUuid: finalVideoUuid,
          attachments: images.length > 0 ? images : null,
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
        <DialogContent className="max-h-[90vh] max-w-4xl p-0 sm:max-w-4xl">
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
            <>
              <div className="px-12 pt-6 pb-3">
                <DialogHeader className="mb-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <DialogTitle className="text-left text-xl">Community Post Details</DialogTitle>
                    <div className="flex items-center gap-2">
                      {post?.courseId && post?.courseName && (
                        <a
                          href={`/course/${post.courseId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Badge variant="secondary">Content</Badge>
                          <span className="text-muted-foreground text-sm underline-offset-2 hover:underline">
                            {post.courseName}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="px-6 pb-8">
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div className="space-y-6 pr-4">
                    {isEditingPost ? (
                      <div className="space-y-4 px-6 py-4">
                        <CommunityTextArea
                          key={editPostEditorKey}
                          value={editPostContent}
                          onChange={setEditPostContent}
                          placeholder="Edit your post..."
                          showAttachButton={true}
                          onFilesChange={handleEditPostFilesChange}
                          existingAttachments={editPostExistingAttachments}
                          onRemoveExistingAttachment={handleRemoveEditPostExistingAttachment}
                          existingVideo={editPostExistingVideo}
                          onRemoveExistingVideo={() => setEditPostExistingVideo(null)}
                          isDisabled={isUpdatingPost}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEditPost} disabled={isUpdatingPost}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEditPost}
                            disabled={!editPostContent.trim() || isUpdatingPost}
                          >
                            {isUpdatingPost ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {post.user?.id === profile?.id && (
                          <div className="absolute top-4 right-4 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={handleEditPost}>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={handleDeletePost}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}

                        <CommunityPostDetail
                          postData={post}
                          onToggleLike={handleToggleLike}
                          onToggleComment={() => setIsCommenting((prev) => !prev)}
                          isLiking={isLiking}
                          isUnliking={isUnliking}
                        />
                      </div>
                    )}

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
                      isLoading={isCommentsLoading}
                      isError={isCommentsError}
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
              </div>
            </>
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

      <ConfirmModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Post?"
        description="This action cannot be undone. Are you sure you want to delete this post?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingPost}
        onConfirm={confirmDeletePost}
      />
    </>
  );
}
