'use client';

import { useState } from 'react';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import ConfirmModal from '@/shared/components/ConfirmModal';
import {
  useGetCourseCommunityPostsInfinite,
} from '@/shared/services/community/community.hook';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { useGetProfile } from '@/shared/services/user/user.hook';
import CommunityPostList from '@/shared/components/community/CommunityPostList';
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
  const [editorKey, setEditorKey] = useState(0);
  
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
  const [editPostExistingAttachments, setEditPostExistingAttachments] = useState<any[]>([]);
  const [editPostDeleteIds, setEditPostDeleteIds] = useState<number[]>([]);

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

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    createPost(
      {
        content: postContent,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      },
      {
        onSuccess: () => {
          setPostContent('');
          setUploadedFiles([]);
          setEditorKey((prev) => prev + 1);
        },
      },
    );
  };

  const posts = postsData?.items || [];
  const postPagination = postsData?.pagination;

  const handleToggleLike = (postId: number, isLiked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikingPost || isUnlikingPost) return;
    togglePostLike(postId, isLiked);
  };

  const handleEditPost = (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.postId);
    setEditPostContent(post.content);
    setEditPostExistingAttachments(post.attachments || []);
    setEditPostFiles([]);
    setEditPostDeleteIds([]);
  };

  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setEditPostContent('');
    setEditPostFiles([]);
    setEditPostExistingAttachments([]);
    setEditPostDeleteIds([]);
  };

  const handleSaveEditPost = async () => {
    if (!editPostContent.trim() || !editingPostId) return;

    try {
      await updatePost(
        editingPostId,
        {
          content: editPostContent,
          attachments: editPostFiles.length > 0 ? editPostFiles : undefined,
          deleteFileIds: editPostDeleteIds.length > 0 ? editPostDeleteIds : undefined,
        },
        {
          onSuccess: () => {
            setEditingPostId(null);
            setEditPostContent('');
            setEditPostFiles([]);
            setEditPostExistingAttachments([]);
            setEditPostDeleteIds([]);
          },
        },
      );
    } catch (error: any) {
      console.error('커뮤니티 글 수정 실패:', error);
      toast.error('Failed to update post.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold">{courseName}</h3>
        </div>
        <div className="size-8"></div>
      </div>

      {/* 포스트 목록 */}
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-none rounded-lg overflow-hidden">
          <CardContent className="p-4 pt-0 border-b">
            <CommunityTextArea
              key={editorKey}
              value={postContent}
              onChange={setPostContent}
              placeholder="Share your thoughts, ask questions, or spark a conversation..."
              onSend={handleCreatePost}
              showSendButton={true}
              showAttachButton={true}
              onFilesChange={setUploadedFiles}
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
              onEditContentChange: setEditPostContent,
              onEditFilesChange: setEditPostFiles,
              onRemoveExistingAttachment: (id: number) => {
                setEditPostDeleteIds((prev: number[]) => [...prev, id]);
                setEditPostExistingAttachments((prev) => prev.filter((att) => att.id !== id));
              },
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
