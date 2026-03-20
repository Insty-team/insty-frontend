'use client';

import { useEffect, useState } from 'react';

import CommunityPostList, { CommunityPostItem } from '@/shared/components/community/CommunityPostList';
import ConfirmModal from '@/shared/components/ConfirmModal';
import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { useGetCourseCommunityPostsInfinite } from '@/shared/services/community/community.hook';
import { Attachment } from '@/shared/services/community/community.type';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { toast } from 'sonner';

type Props = {
  readonly courseId: string;
  readonly onSelectPost: (postId: number) => void;
  readonly sheetIsOpen: boolean;
  readonly isActive: boolean;
};

export default function CommunityListSheet({ courseId, onSelectPost, sheetIsOpen, isActive }: Props) {
  const courseIdNumber = Number(courseId);
  const [postContent, setPostContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeletePostId, setPendingDeletePostId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostFiles, setEditPostFiles] = useState<File[]>([]);
  const [editPostExistingAttachments, setEditPostExistingAttachments] = useState<Attachment[]>([]);
  const [editPostExistingVideo, setEditPostExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [editPostDeleteIds, setEditPostDeleteIds] = useState<number[]>([]);
  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false);
  const [isSaveEditDialogOpen, setIsSaveEditDialogOpen] = useState(false);

  const {
    data: communityData,
    isLoading: isCommunityLoading,
    isError: isCommunityError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchCommunity,
  } = useGetCourseCommunityPostsInfinite(Number(courseId), 10);

  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  const {
    createPost,
    updatePost,
    deletePost,
    togglePostLike,
    isCreatingPost: isSubmittingCommunityPost,
    isUpdatingPost,
    isDeletingPost,
    isLikingPost,
    isUnlikingPost,
  } = useCommunity({ courseId: courseIdNumber });

  const { uploadVideo } = usePresignedVideoUpload();

  const handlePostFilesChange = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/')).slice(0, 2);
    const video = files.find((f) => f.type.startsWith('video/')) ?? null;
    setUploadedFiles(images);
    setUploadedVideoFile(video);
  };

  useEffect(() => {
    if (sheetIsOpen && isActive) {
      refetchCommunity();
    }
  }, [sheetIsOpen, isActive, refetchCommunity]);

  const posts = communityData?.items ?? [];
  const postPagination = communityData?.pagination;

  const handleCreatePost = async () => {
    if (!postContent.trim() || isSubmittingCommunityPost) return;

    try {
      let videoUuid: string | undefined;
      if (uploadedVideoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_POST', file: uploadedVideoFile });
      }

      await createPost(
        {
          content: postContent,
          videoUuid,
          attachments: uploadedFiles.length > 0 ? uploadedFiles : null,
        },
        {
          onSuccess: () => {
            setPostContent('');
            setUploadedFiles([]);
            setUploadedVideoFile(null);
            setEditorKey((prev) => prev + 1);
            refetchCommunity();
          },
        },
      );
    } catch (error: any) {
      console.error('커뮤니티 글 작성 실패:', error);
      toast.error('Failed to create post.');
    }
  };

  const handleToggleLike = (postId: number, isLiked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLikingPost || isUnlikingPost) return;

    (async () => {
      try {
        await togglePostLike(postId, isLiked);
      } catch (error: any) {
        console.error('커뮤니티 글 좋아요 처리 실패:', error);
        toast.error('Failed to update like.');
      }
    })();
  };

  const handleEditPost = (post: CommunityPostItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.postId);
    setEditPostContent(post.content);
    setEditPostExistingAttachments(post.attachments ?? []);
    setEditPostExistingVideo(post.videoInfo ? { originFileName: post.videoInfo.originFileName } : null);
    setEditPostFiles([]);
    setEditPostDeleteIds([]);
  };

  const handleCancelEditPost = () => {
    const hasChanges = editPostContent !== '' || editPostFiles.length > 0 || editPostDeleteIds.length > 0;

    if (hasChanges) {
      setIsCancelEditDialogOpen(true);
    } else {
      confirmCancelEditPost();
    }
  };

  const confirmCancelEditPost = () => {
    setEditingPostId(null);
    setEditPostContent('');
    setEditPostFiles([]);
    setEditPostExistingAttachments([]);
    setEditPostExistingVideo(null);
    setEditPostDeleteIds([]);
    setIsCancelEditDialogOpen(false);
  };

  const handleSaveEditPost = () => {
    if (!editPostContent.trim() || !editingPostId) return;
    setIsSaveEditDialogOpen(true);
  };

  const confirmSaveEditPost = async () => {
    if (!editPostContent.trim() || !editingPostId) return;
    setIsSaveEditDialogOpen(false);

    try {
      const images = editPostFiles.filter((f) => f.type.startsWith('image/'));
      const videoFile = editPostFiles.find((f) => f.type.startsWith('video/')) ?? null;
      let videoUuid: string | null;

      const editingPost = posts.find((p) => p.postId === editingPostId);

      if (videoFile) {
        // 새 비디오 업로드
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_POST', file: videoFile });
      } else if (editingPost?.videoInfo && !editPostExistingVideo) {
        // 기존 비디오 삭제
        videoUuid = null;
      } else if (editingPost?.videoInfo) {
        // 기존 비디오 유지
        videoUuid = editingPost.videoInfo.videoUuid;
      } else {
        // 비디오 없음
        videoUuid = null;
      }

      await updatePost(
        editingPostId,
        {
          content: editPostContent,
          videoUuid: videoUuid ?? null,
          attachments: images.length > 0 ? images : null,
          deleteFileIds: editPostDeleteIds.length > 0 ? editPostDeleteIds : null,
        },
        {
          onSuccess: () => {
            setEditingPostId(null);
            setEditPostContent('');
            setEditPostFiles([]);
            setEditPostExistingAttachments([]);
            setEditPostExistingVideo(null);
            setEditPostDeleteIds([]);
            refetchCommunity();
          },
        },
      );
    } catch (error: any) {
      console.error('커뮤니티 글 수정 실패:', error);
      toast.error('Failed to update post.');
    }
  };

  const handleDeletePost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeletePostId(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    if (!pendingDeletePostId) return;

    (async () => {
      try {
        await deletePost(pendingDeletePostId, {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setPendingDeletePostId(null);
            refetchCommunity();
          },
        });
      } catch (error: any) {
        console.error('커뮤니티 글 삭제 실패:', error);
        toast.error('Failed to delete post.');
      }
    })();
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-4 pr-4">
          {/* 글 작성 에디터 */}
          <CommunityTextArea
            key={editorKey}
            value={postContent}
            onChange={setPostContent}
            placeholder="Share your thoughts, ask questions, or spark a conversation..."
            onSend={handleCreatePost}
            showSendButton={true}
            showAttachButton={true}
            onFilesChange={handlePostFilesChange}
            isSending={isSubmittingCommunityPost}
            showAiAssistant={true}
            aiCourseId={Number(courseId)}
          />

          {/* 포스트 목록 */}
          <CommunityPostList
            posts={posts}
            currentUserId={currentUserId}
            actions={{
              onPostClick: (postId: number) => onSelectPost(postId),
              onLike: handleToggleLike,
              onEdit: handleEditPost,
              onDelete: handleDeletePost,
            }}
            edit={{
              editingPostId,
              editPostContent,
              editPostFiles,
              editPostExistingAttachments,
              editPostExistingVideo,
              onEditContentChange: setEditPostContent,
              onEditFilesChange: setEditPostFiles,
              onRemoveExistingAttachment: (id: number) => {
                setEditPostDeleteIds((prev) => [...prev, id]);
                setEditPostExistingAttachments((prev) => prev.filter((att) => att.id !== id));
              },
              onRemoveExistingVideo: () => setEditPostExistingVideo(null),
              onSaveEdit: handleSaveEditPost,
              onCancelEdit: handleCancelEditPost,
              isUpdatingPost,
            }}
            paging={{
              hasMore: hasNextPage,
              onLoadMore: handleLoadMore,
              isLoadingMore: isFetchingNextPage,
              currentPage: postPagination?.currentPage,
              totalPages: postPagination?.totalPages,
            }}
            status={{
              isLoading: isCommunityLoading,
              isError: isCommunityError,
            }}
          />
        </div>
      </ScrollArea>

      <ConfirmModal
        open={isCancelEditDialogOpen}
        onOpenChange={setIsCancelEditDialogOpen}
        title="Cancel Editing"
        description="Are you sure you want to cancel? All changes will be lost."
        confirmText="Discard Changes"
        cancelText="Continue Editing"
        onConfirm={confirmCancelEditPost}
      />

      <ConfirmModal
        open={isSaveEditDialogOpen}
        onOpenChange={setIsSaveEditDialogOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        isConfirming={isUpdatingPost}
        onConfirm={confirmSaveEditPost}
      />

      <ConfirmModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
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
