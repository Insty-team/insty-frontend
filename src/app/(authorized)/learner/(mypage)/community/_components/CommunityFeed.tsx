'use client';

import { useState } from 'react';

import CommunityPostList, { CommunityPostItem } from '@/shared/components/community/CommunityPostList';
import ConfirmModal from '@/shared/components/ConfirmModal';
import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { useGetCourseCommunityPostsInfinite } from '@/shared/services/community/community.hook';
import { Attachment } from '@/shared/services/community/community.type';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  courseId: string;
  courseName: string;
  onBack: () => void;
  onPostClick: (postId: number) => void;
};

export default function CommunityFeed({ courseId, courseName, onBack, onPostClick }: Props) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  const courseIdNumber = Number(courseId);
  const {
    createPost,
    updatePost,
    deletePost,
    togglePostLike,
    isCreatingPost,
    isUpdatingPost,
    isDeletingPost,
    isLikingPost,
    isUnlikingPost,
  } = useCommunity({ courseId: courseIdNumber });

  const [postContent, setPostContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const { uploadVideo } = usePresignedVideoUpload();

  const {
    data: postsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseCommunityPostsInfinite(courseIdNumber, 20);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostFiles, setEditPostFiles] = useState<File[]>([]);
  const [editPostExistingAttachments, setEditPostExistingAttachments] = useState<Attachment[]>([]);
  const [editPostExistingVideo, setEditPostExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [editPostDeleteIds, setEditPostDeleteIds] = useState<number[]>([]);
  const [isSaveEditDialogOpen, setIsSaveEditDialogOpen] = useState(false);

  const handleDeletePost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPostToDelete(null);
        },
      });
    } catch (error: any) {
      console.error('커뮤니티 글 삭제 실패:', error);
      toast.error('Failed to delete post.');
    }
  };

  const handlePostFilesChange = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/')).slice(0, 2);
    const video = files.find((f) => f.type.startsWith('video/')) ?? null;
    setUploadedFiles(images);
    setUploadedVideoFile(video);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      let videoUuid: string | undefined;
      if (uploadedVideoFile) {
        videoUuid = await uploadVideo({ kind: 'COMMUNITY_POST', file: uploadedVideoFile });
      }

      createPost(
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
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('포스트 작성 실패:', error);
      toast.error('Failed to create post.');
    }
  };

  const posts = postsData?.items || [];
  const postPagination = postsData?.pagination;

  const handleToggleLike = (postId: number, isLiked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikingPost || isUnlikingPost) return;
    togglePostLike(postId, isLiked);
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
    setEditingPostId(null);
    setEditPostContent('');
    setEditPostFiles([]);
    setEditPostExistingAttachments([]);
    setEditPostExistingVideo(null);
    setEditPostDeleteIds([]);
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
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('커뮤니티 글 수정 실패:', error);
      toast.error('Failed to update post.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold">{courseName}</h3>
        </div>
        <div className="size-8"></div>
      </div>

      {/* 포스트 목록 */}
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden rounded-lg shadow-none">
          <CardContent className="border-b p-4 pt-0">
            <CommunityTextArea
              key={editorKey}
              value={postContent}
              onChange={setPostContent}
              placeholder="Share your thoughts, ask questions, or spark a conversation..."
              onSend={handleCreatePost}
              showSendButton={true}
              showAttachButton={true}
              onFilesChange={handlePostFilesChange}
              isSending={isCreatingPost}
              showAiAssistant={true}
              aiCourseId={courseIdNumber}
              className="rounded-md"
            />
          </CardContent>

          <CommunityPostList
            posts={posts}
            currentUserId={currentUserId}
            actions={{
              onPostClick,
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
              onLoadMore: () => fetchNextPage(),
              isLoadingMore: isFetchingNextPage,
              currentPage: postPagination?.currentPage,
              totalPages: postPagination?.totalPages,
            }}
            status={{
              isLoading,
              isError,
            }}
          />
        </Card>
      </div>

      {/* 수정 저장 확인 다이얼로그 */}
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

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmModal
        open={deleteDialogOpen}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) setPostToDelete(null);
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingPost}
        onConfirm={confirmDeletePost}
      />
    </div>
  );
}
