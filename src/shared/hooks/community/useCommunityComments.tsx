'use client';

import { toast } from 'sonner';

import {
  useDeleteCourseCommunityPostCommentById,
  useDeleteCourseCommunityPostCommentLikeForList,
  usePatchCourseCommunityPostCommentForList,
  usePostCourseCommunityPostCommentById,
  usePostCourseCommunityPostCommentLikeForList,
} from '@/shared/services/community/community.hook';
import type {
  CourseCommunityPostCommentRequest,
  CourseCommunityPostCommentUpdateRequest,
} from '@/shared/services/community/community.type';

type UseCommunityCommentsOptions = {
  courseId: number;
  postId: number;
};

type CreateCommentOptions = {
  onSuccess?: () => void;
};

type UpdateCommentOptions = {
  onSuccess?: () => void;
};

type DeleteCommentOptions = {
  onSuccess?: () => void;
};

type ToggleLikeOptions = {
  onSuccess?: () => void;
};

export const useCommunityComments = ({ courseId, postId }: UseCommunityCommentsOptions) => {
  const { mutateAsync: createCommentAsync, isPending: isCreatingComment } = usePostCourseCommunityPostCommentById(courseId, postId);
  const { mutateAsync: updateCommentAsync, isPending: isUpdatingComment } = usePatchCourseCommunityPostCommentForList();
  const { mutateAsync: deleteCommentAsync, isPending: isDeletingComment } = useDeleteCourseCommunityPostCommentById();

  const { mutateAsync: likeCommentAsync, isPending: isLikingComment } = usePostCourseCommunityPostCommentLikeForList();
  const { mutateAsync: unlikeCommentAsync, isPending: isUnlikingComment } = useDeleteCourseCommunityPostCommentLikeForList();

  const createComment = async (data: CourseCommunityPostCommentRequest, options?: CreateCommentOptions) => {
    await createCommentAsync(data);
    toast.success('Comment posted.');
    options?.onSuccess?.();
  };

  const updateComment = async (
    commentId: number,
    data: CourseCommunityPostCommentUpdateRequest,
    options?: UpdateCommentOptions,
  ) => {
    await updateCommentAsync({ commentId, data });
    toast.success('Comment updated.');
    options?.onSuccess?.();
  };

  const deleteComment = async (commentId: number, options?: DeleteCommentOptions) => {
    await deleteCommentAsync(commentId);
    toast.success('Comment deleted.');
    options?.onSuccess?.();
  };

  const toggleCommentLike = async (commentId: number, isLiked: boolean, options?: ToggleLikeOptions) => {
    if (isLiked) {
      await unlikeCommentAsync(commentId);
      options?.onSuccess?.();
      return;
    }

    await likeCommentAsync(commentId);
    options?.onSuccess?.();
  };

  return {
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCreatingComment,
    isUpdatingComment,
    isDeletingComment,
    isLikingComment,
    isUnlikingComment,
  };
};
