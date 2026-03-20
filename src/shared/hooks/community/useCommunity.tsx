
'use client';

import { toast } from 'sonner';

import {
  useDeleteCourseCommunityPostById,
  useDeleteCourseCommunityPostLikeForList,
  usePatchCourseCommunityPost,
  usePostCourseCommunityPostById,
  usePostCourseCommunityPostLikeForList,
} from '@/shared/services/community/community.hook';
import type { CourseCommunityPostRequest, CourseCommunityPostUpdateRequest } from '@/shared/services/community/community.type';

type UseCommunityOptions = {
  courseId: number;
};

type CreatePostOptions = {
  onSuccess?: () => void;
};

type UpdatePostOptions = {
  onSuccess?: () => void;
};

type DeletePostOptions = {
  onSuccess?: () => void;
};

type ToggleLikeOptions = {
  onSuccess?: () => void;
};

export const useCommunity = ({ courseId }: UseCommunityOptions) => {
  const { mutateAsync: createPostAsync, isPending: isCreatingPost } = usePostCourseCommunityPostById(courseId);
  const { mutateAsync: updatePostAsync, isPending: isUpdatingPost } = usePatchCourseCommunityPost(courseId);
  const { mutateAsync: deletePostAsync, isPending: isDeletingPost } = useDeleteCourseCommunityPostById();

  const { mutateAsync: likePostAsync, isPending: isLikingPost } = usePostCourseCommunityPostLikeForList(courseId);
  const { mutateAsync: unlikePostAsync, isPending: isUnlikingPost } = useDeleteCourseCommunityPostLikeForList(courseId);

  const createPost = async (data: CourseCommunityPostRequest, options?: CreatePostOptions) => {
    await createPostAsync(data);
    toast.success('Post created.');
    options?.onSuccess?.();
  };

  const updatePost = async (postId: number, data: CourseCommunityPostUpdateRequest, options?: UpdatePostOptions) => {
    await updatePostAsync({ postId, data });
    toast.success('Post updated.');
    options?.onSuccess?.();
  };

  const deletePost = async (postId: number, options?: DeletePostOptions) => {
    await deletePostAsync({ courseId, postId });
    toast.success('Post deleted.');
    options?.onSuccess?.();
  };

  const togglePostLike = async (postId: number, isLiked: boolean, options?: ToggleLikeOptions) => {
    if (isLiked) {
      await unlikePostAsync(postId);
      options?.onSuccess?.();
      return;
    }

    await likePostAsync(postId);
    options?.onSuccess?.();
  };

  return {
    createPost,
    updatePost,
    deletePost,
    togglePostLike,
    isCreatingPost,
    isUpdatingPost,
    isDeletingPost,
    isLikingPost,
    isUnlikingPost,
  };
};

