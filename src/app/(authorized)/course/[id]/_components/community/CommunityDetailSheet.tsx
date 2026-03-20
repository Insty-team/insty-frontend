'use client';

import { useState } from 'react';

import CommunityComments from '@/shared/components/community/CommunityComments';
import CommunityPostDetail from '@/shared/components/community/CommunityPostDetail';
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
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useCommunityComments } from '@/shared/hooks/community/useCommunityComments';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import {
  useGetCourseCommunityPostById,
  useGetCourseCommunityPostCommentsInfinite,
} from '@/shared/services/community/community.hook';
import { Attachment } from '@/shared/services/community/community.type';
import { useGetProfile } from '@/shared/services/user/user.hook';
import dayjs from 'dayjs';
import { Calendar, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  readonly courseId: number;
  readonly postId: number;
  readonly onBack: () => void;
};

export default function CommunityDetailSheet({ courseId, postId, onBack }: Props) {
  const [commentContent, setCommentContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // 댓글 삭제 관련 state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<number | null>(null);

  // 포스트 수정/삭제 관련 state
  const [isPostDeleteDialogOpen, setIsPostDeleteDialogOpen] = useState(false);
  const [isCancelPostEditDialogOpen, setIsCancelPostEditDialogOpen] = useState(false);
  const [isSavePostEditDialogOpen, setIsSavePostEditDialogOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostFiles, setEditPostFiles] = useState<File[]>([]);
  const [editPostExistingAttachments, setEditPostExistingAttachments] = useState<Attachment[]>([]);
  const [editPostExistingVideo, setEditPostExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [editPostDeleteIds, setEditPostDeleteIds] = useState<number[]>([]);

  const { data: userProfile } = useGetProfile();
  const currentUserId = userProfile?.id;

  // 포스트 상세 조회 — 핸들러들이 참조하므로 상단에 선언
  const {
    data: communityPostData,
    isLoading: isCommunityPostLoading,
    isError: isCommunityPostError,
  } = useGetCourseCommunityPostById(courseId, postId);

  // 댓글 목록 무한 스크롤
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetCourseCommunityPostCommentsInfinite(courseId, postId, 10);

  const comments = commentsData?.items ?? [];
  const pagination = commentsData?.pagination;

  const {
    updatePost: updatePostAsync,
    deletePost: deletePostAsync,
    togglePostLike,
    isUpdatingPost,
    isDeletingPost,
    isLikingPost,
    isUnlikingPost,
  } = useCommunity({ courseId });

  const {
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCreatingComment: isPosting,
    isUpdatingComment: isPatching,
    isDeletingComment: isDeleting,
    isLikingComment,
    isUnlikingComment,
  } = useCommunityComments({ courseId, postId });

  const { uploadVideo } = usePresignedVideoUpload();

  const handleToggleLike = async () => {
    if (isLikingPost || isUnlikingPost) return;

    try {
      await togglePostLike(postId, communityPostData?.likedByMe ?? false);
    } catch (error: unknown) {
      console.error('커뮤니티 글 좋아요 처리 실패:', error);
      toast.error('Failed to update like.');
    }
  };

  const handleToggleCommentLike = async (commentId: number, likedByMe: boolean) => {
    if (isLikingComment || isUnlikingComment) return;

    try {
      await toggleCommentLike(commentId, likedByMe);
    } catch (error: unknown) {
      console.error('댓글 좋아요 처리 실패:', error);
      toast.error('Failed to update like.');
    }
  };

  const handleCommentFilesChange = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    const video = files.find((f) => f.type.startsWith('video/')) ?? null;
    setUploadedFiles(images);
    setUploadedVideoFile(video);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    try {
      let videoUuid: string | undefined;

      if (uploadedVideoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: uploadedVideoFile });
      }

      await createComment(
        {
          content: commentContent,
          videoUuid,
          attachments: uploadedFiles.length > 0 ? uploadedFiles : null,
        },
        {
          onSuccess: () => {
            setCommentContent('');
            setUploadedFiles([]);
            setUploadedVideoFile(null);
            setIsComposerOpen(false);
          },
        },
      );
    } catch (error: unknown) {
      console.error('댓글 작성 실패:', error);
      toast.error('Failed to post comment.');
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setPendingDeleteCommentId(commentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!pendingDeleteCommentId) return;

    try {
      await deleteComment(pendingDeleteCommentId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setPendingDeleteCommentId(null);
        },
      });
    } catch (error: unknown) {
      console.error('댓글 삭제 실패:', error);
      toast.error('Failed to delete comment.');
    }
  };

  const handleEditPost = () => {
    if (communityPostData) {
      setIsEditingPost(true);
      setEditPostContent(communityPostData.content);
      setEditPostExistingAttachments(communityPostData.attachments ?? []);
      setEditPostExistingVideo(
        communityPostData.videoInfo ? { originFileName: communityPostData.videoInfo.originFileName } : null,
      );
      setEditPostDeleteIds([]);
    }
  };

  const handleCancelEditPost = () => {
    const hasChanges = editPostContent !== '' || editPostFiles.length > 0 || editPostDeleteIds.length > 0;

    if (hasChanges) {
      setIsCancelPostEditDialogOpen(true);
    } else {
      confirmCancelPostEdit();
    }
  };

  const confirmCancelPostEdit = () => {
    setIsEditingPost(false);
    setEditPostContent('');
    setEditPostFiles([]);
    setEditPostExistingAttachments([]);
    setEditPostExistingVideo(null);
    setEditPostDeleteIds([]);
    setIsCancelPostEditDialogOpen(false);
  };

  const handleSavePost = () => {
    if (!editPostContent.trim()) return;
    setIsSavePostEditDialogOpen(true);
  };

  const confirmSavePost = async () => {
    if (!editPostContent.trim()) return;
    setIsSavePostEditDialogOpen(false);

    // 파일 크기 체크 (10MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const oversizedFiles = editPostFiles.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      alert(
        `File size too large. Maximum file size is 10MB.\nLarge files: ${oversizedFiles.map((f) => f.name).join(', ')}`,
      );
      return;
    }

    try {
      const images = editPostFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = editPostFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | null;

      if (videoFile) {
        // 새 비디오 업로드
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_POST', file: videoFile });
      } else if (communityPostData?.videoInfo && !editPostExistingVideo) {
        // 기존 비디오 삭제
        videoUuid = null;
      } else if (communityPostData?.videoInfo) {
        // 기존 비디오 유지
        videoUuid = communityPostData.videoInfo.videoUuid;
      } else {
        // 비디오 없음
        videoUuid = null;
      }

      await updatePostAsync(
        postId,
        {
          content: editPostContent,
          videoUuid: videoUuid ?? null,
          attachments: images.length > 0 ? images : null,
          deleteFileIds: editPostDeleteIds.length > 0 ? editPostDeleteIds : null,
        },
        {
          onSuccess: () => {
            setIsEditingPost(false);
            setEditPostContent('');
            setEditPostFiles([]);
            setEditPostExistingAttachments([]);
            setEditPostExistingVideo(null);
            setEditPostDeleteIds([]);
          },
        },
      );
    } catch (error: unknown) {
      console.error('커뮤니티 글 수정 실패:', error);
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 413) {
        toast.error('Content too large.');
      } else {
        toast.error('Failed to update post.');
      }
    }
  };

  const handleDeletePost = () => {
    setIsPostDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    try {
      await deletePostAsync(postId, {
        onSuccess: () => {
          setIsPostDeleteDialogOpen(false);
          onBack();
        },
      });
    } catch (error: unknown) {
      console.error('커뮤니티 글 삭제 실패:', error);
      toast.error('Failed to delete post.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8" aria-label="Go back">
          <ChevronLeft className="size-6" />
        </Button>
        <p className="text-lg font-medium">Community List</p>
      </div>

      <ScrollArea className="overflow-y-auto">
        <div className="space-y-4 px-4">
          {isCommunityPostLoading && (
            <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
              <Spinner className="size-4" />
              Loading...
            </div>
          )}

          {!isCommunityPostLoading && isCommunityPostError && (
            <div className="text-muted-foreground py-8 text-center text-sm">Failed to load community post.</div>
          )}

          {!isCommunityPostLoading && !isCommunityPostError && !communityPostData && (
            <div className="text-muted-foreground py-8 text-center text-sm">Community post information not found.</div>
          )}

          {!isCommunityPostLoading && !isCommunityPostError && communityPostData && (
            <div className="space-y-4">
              {isEditingPost ? (
                <div className="space-y-4 rounded-sm border p-6">
                  {/* 작성자 정보 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {communityPostData.user?.nickname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-lg font-medium">{communityPostData.user?.nickname}</div>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {communityPostData.createdAt
                            ? dayjs(communityPostData.createdAt).format('MMM D, YYYY h:mm A')
                            : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 수정 폼 */}
                  <div className="space-y-3">
                    <CommunityTextArea
                      value={editPostContent}
                      onChange={setEditPostContent}
                      placeholder="Edit your post..."
                      showAttachButton={true}
                      onFilesChange={setEditPostFiles}
                      existingAttachments={editPostExistingAttachments}
                      onRemoveExistingAttachment={(id) => {
                        setEditPostDeleteIds((prev) => [...prev, id]);
                        setEditPostExistingAttachments((prev) => prev.filter((att) => att.id !== id));
                      }}
                      existingVideo={editPostExistingVideo}
                      onRemoveExistingVideo={() => setEditPostExistingVideo(null)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancelEditPost}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSavePost} disabled={!editPostContent.trim() || isUpdatingPost}>
                        {isUpdatingPost ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* 수정/삭제 드롭다운 (본인 글만) */}
                  {communityPostData.user?.id === currentUserId && (
                    <div className="absolute top-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleEditPost} className="gap-2">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleDeletePost}
                            className="text-destructive focus:text-destructive gap-2"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <CommunityPostDetail
                    postData={communityPostData}
                    onToggleLike={handleToggleLike}
                    onToggleComment={() => setIsComposerOpen(!isComposerOpen)}
                    isLiking={isLikingPost}
                    isUnliking={isUnlikingPost}
                  />

                  {/* 댓글 섹션 */}
                  <div>
                    {/* 댓글 작성 폼 */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${isComposerOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
                    >
                      {isComposerOpen && (
                        <Card className="border-b shadow-none">
                          <CardContent className="p-0">
                            <CommunityTextArea
                              value={commentContent}
                              onChange={setCommentContent}
                              placeholder="Write a comment..."
                              onSend={handleSubmitComment}
                              showSendButton={true}
                              showAttachButton={true}
                              onFilesChange={handleCommentFilesChange}
                              isSending={isPosting}
                              className="min-h-[20px]"
                            />
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* 댓글 목록 */}
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
                      currentUserId={currentUserId}
                      showLikeButton={true}
                      onLikeComment={handleToggleCommentLike}
                      enableEdit={true}
                      onSaveEdit={async (commentId, content, files, deleteAttachmentIds, videoUuid) => {
                        await updateComment(commentId, {
                          content,
                          videoUuid: videoUuid ?? undefined,
                          attachments: files.length > 0 ? files : null,
                          deleteFileIds: deleteAttachmentIds.length > 0 ? deleteAttachmentIds : null,
                        });
                      }}
                      isSavingEdit={isPatching}
                      onDeleteComment={handleDeleteComment}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <ConfirmModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? Deleted comments cannot be recovered."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeleting}
        onConfirm={confirmDeleteComment}
      />

      <ConfirmModal
        open={isCancelPostEditDialogOpen}
        onOpenChange={setIsCancelPostEditDialogOpen}
        title="Cancel Editing"
        description="Are you sure you want to cancel? All changes will be lost."
        confirmText="Discard Changes"
        cancelText="Continue Editing"
        onConfirm={confirmCancelPostEdit}
      />

      <ConfirmModal
        open={isSavePostEditDialogOpen}
        onOpenChange={setIsSavePostEditDialogOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        isConfirming={isUpdatingPost}
        onConfirm={confirmSavePost}
      />

      <ConfirmModal
        open={isPostDeleteDialogOpen}
        onOpenChange={setIsPostDeleteDialogOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingPost}
        onConfirm={confirmDeletePost}
      />
    </>
  );
}
