'use client';

import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import ConfirmModal from '@/shared/components/ConfirmModal';
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
import {
  useGetCourseCommunityPostById,
  useGetCourseCommunityPostCommentsById,
} from '@/shared/services/community/community.hook';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useCommunityComments } from '@/shared/hooks/community/useCommunityComments';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { useGetProfile } from '@/shared/services/user/user.hook';
import dayjs from 'dayjs';
import { Attachment } from '@/shared/services/community/community.type';
import { ChevronLeft, Heart, MessageCircle, Calendar, MoreHorizontal } from 'lucide-react';
import CommunityPostDetail from '@/shared/components/community/CommunityPostDetail';
import CommunityComments from '@/shared/components/community/CommunityComments';
import { toast } from 'sonner';

type Props = {
  readonly courseId: number;
  readonly postId: number;
  readonly onBack: () => void;
};

export default function CommunityDetailSheet({ courseId, postId, onBack }: Props) {
  const [commentContent, setCommentContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([]);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  
  // 댓글 관련 state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingFiles, setEditingFiles] = useState<File[]>([]);
  const [editingExistingAttachments, setEditingExistingAttachments] = useState<Attachment[]>([]);
  const [editingDeleteIds, setEditingDeleteIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<number | null>(null);
  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  
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

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const { data: userProfile } = useGetProfile();
  const isLearner = userProfile?.userType === 'LEARNER';
  const currentUserId = userProfile?.id;

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

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    isFetching: isCommentsFetching,
  } = useGetCourseCommunityPostCommentsById(courseId, postId, page, pageSize);

  const pagination = commentsData?.pagination;

  useEffect(() => {
    const previews = uploadedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFilePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [uploadedFiles]);

  useEffect(() => {
    if (commentsData?.items) {
      if (page === 1) {
        setComments(commentsData.items);
      } else {
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c.commentId));
          const newComments = commentsData.items.filter((item: any) => !existingIds.has(item.commentId));
          return [...prev, ...newComments];
        });
      }
      
      if (commentsData.pagination) {
        setHasMore(page < commentsData.pagination.totalPages);
      }
    }
  }, [commentsData, page]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadedFiles((prev) => {
      const merged = [...prev, ...Array.from(files)];
      const limited = merged.slice(0, 2);
      setUploadErrorMessage(merged.length > 2 ? 'You can attach up to 2 images.' : '');
      return limited;
    });

    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadErrorMessage('');
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedVideoFile(file);
    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setUploadedVideoFile(null);
  };

  const handleToggleLike = async () => {
    if (isLikingPost || isUnlikingPost) return;

    try {
      await togglePostLike(postId, communityPostData?.likedByMe ?? false);
    } catch (error: any) {
      console.error('커뮤니티 글 좋아요 처리 실패:', error);
      toast.error('Failed to update like.');
    }
  };

  const handleToggleCommentLike = async (commentId: number, likedByMe: boolean) => {
    if (isLikingComment || isUnlikingComment) return;

    try {
      await toggleCommentLike(commentId, likedByMe);
    } catch (error: any) {
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
            setUploadErrorMessage('');
            setIsComposerOpen(false);
            setPage(1);
            setComments([]);
          },
        },
      );
    } catch (error: any) {
      console.error('댓글 작성 실패:', error);
      toast.error('Failed to post comment.');
    }
  };

  const handleLoadMore = () => {
    if (!isCommentsFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleEditComment = (commentId: number, content: string, attachments?: Attachment[]) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setEditingExistingAttachments(attachments || []);
    setEditingFiles([]);
    setEditingDeleteIds([]);
  };

  const handleSaveEdit = async () => {
    if (!editingContent.trim() || !editingCommentId) return;

    // 파일 크기 체크 (10MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = editingFiles.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      alert(`File size too large. Maximum file size is 10MB.\nLarge files: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    try {
      const images = editingFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = editingFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | undefined;

      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_COMMENT', file: videoFile });
      }

      await updateComment(
        editingCommentId,
        {
          content: editingContent,
          videoUuid,
          attachments: images.length > 0 ? images : null,
          deleteFileIds: editingDeleteIds.length > 0 ? editingDeleteIds : null,
        },
        {
          onSuccess: () => {
            setEditingCommentId(null);
            setEditingContent('');
            setEditingFiles([]);
            setEditingExistingAttachments([]);
            setEditingDeleteIds([]);
          },
        },
      );
    } catch (error: any) {
      console.error('Failed to update comment:', error);
      if (error?.response?.status === 413) {
        toast.error('Content too large.');
      } else {
        toast.error('Failed to update comment.');
      }
    }
  };

  const handleCancelEdit = () => {
    const hasChanges = editingContent !== '' || editingFiles.length > 0 || editingDeleteIds.length > 0;
    
    if (hasChanges) {
      setIsCancelEditDialogOpen(true);
    } else {
      confirmCancelEdit();
    }
  };

  const confirmCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
    setEditingFiles([]);
    setEditingExistingAttachments([]);
    setEditingDeleteIds([]);
    setIsCancelEditDialogOpen(false);
  };

  const handleRemoveExistingAttachment = (attachmentId: number) => {
    setEditingDeleteIds(prev => [...prev, attachmentId]);
    setEditingExistingAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleDeleteComment = (commentId: number) => {
    setPendingDeleteCommentId(commentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteComment = () => {
    if (pendingDeleteCommentId) {
      (async () => {
        try {
          await deleteComment(pendingDeleteCommentId, {
            onSuccess: () => {
              setIsDeleteDialogOpen(false);
              setPendingDeleteCommentId(null);
            },
          });
        } catch (error: any) {
          console.error('댓글 삭제 실패:', error);
          toast.error('Failed to delete comment.');
        }
      })();
    }
  };

  const handleEditPost = () => {
    if (communityPostData) {
      setIsEditingPost(true);
      setEditPostContent(communityPostData.content);
      setEditPostExistingAttachments(communityPostData.attachments || []);
      setEditPostExistingVideo(communityPostData.videoInfo ? { originFileName: communityPostData.videoInfo.originFileName } : null);
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

  const confirmSavePost = () => {
    if (!editPostContent.trim()) return;
    setIsSavePostEditDialogOpen(false);

    // 파일 크기 체크 (10MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = editPostFiles.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      alert(`File size too large. Maximum file size is 10MB.\nLarge files: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    (async () => {
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
      } catch (error: any) {
        console.error('커뮤니티 글 수정 실패:', error);
        if (error?.response?.status === 413) {
          toast.error('Content too large.');
        } else {
          toast.error('Failed to update post.');
        }
      }
    })();
  };

  const handleDeletePost = () => {
    setIsPostDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    (async () => {
      try {
        await deletePostAsync(postId, {
          onSuccess: () => {
            setIsPostDeleteDialogOpen(false);
            onBack();
          },
        });
      } catch (error: any) {
        console.error('커뮤니티 글 삭제 실패:', error);
        toast.error('Failed to delete post.');
      }
    })();
  };

  const { 
    data: communityPostData,
    isLoading: isCommunityPostLoading,
    isError: isCommunityPostError,
  } = useGetCourseCommunityPostById(courseId, postId);

  const sheetDescription = 'Check the post content and leave a comment.';

  const renderAttachments = (attachments: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {attachments
          .filter((file) => file?.url)
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
    );
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
                <div className="border rounded-sm p-6 space-y-4">
                  {/* 작성자 정보 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {communityPostData.user?.nickname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">{communityPostData.user?.nickname}</div>
                        <div className="flex gap-1 items-center text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4" />
                          {communityPostData.createdAt ? dayjs(communityPostData.createdAt).format('MMM D, YYYY h:mm A') : ''}
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
                        setEditPostDeleteIds(prev => [...prev, id]);
                        setEditPostExistingAttachments(prev => prev.filter(att => att.id !== id));
                      }}
                      existingVideo={editPostExistingVideo}
                      onRemoveExistingVideo={() => setEditPostExistingVideo(null)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={handleCancelEditPost}>
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSavePost}
                        disabled={!editPostContent.trim() || isUpdatingPost}
                      >
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
                            className="gap-2 text-destructive focus:text-destructive"
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
                    <div className={`transition-all duration-300 ease-in-out ${isComposerOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                      {isComposerOpen && (
                        <Card className="border-b shadow-none">
                          <CardContent className="">
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
                            {uploadErrorMessage && <p className="text-destructive text-xs mt-2">{uploadErrorMessage}</p>}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* 댓글 목록 */}
                    <CommunityComments
                      comments={comments}
                      hasNextPage={hasMore}
                      onLoadMore={handleLoadMore}
                      isLoadingMore={isCommentsFetching}
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
                            deleteFileIds:
                              deleteAttachmentIds.length > 0 ? deleteAttachmentIds : null,
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
        open={isCancelEditDialogOpen}
        onOpenChange={setIsCancelEditDialogOpen}
        title="Cancel Editing"
        description="Are you sure you want to cancel? All changes will be lost."
        confirmText="Discard Changes"
        cancelText="Continue Editing"
        onConfirm={confirmCancelEdit}
      />

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