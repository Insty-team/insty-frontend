import {
  DELETE_course_community_post_by_id,
  DELETE_course_community_post_comment_by_id,
  DELETE_course_community_post_comment_like_by_id,
  DELETE_course_community_post_like_by_id,
  GET_course_community_post_by_id,
  GET_course_community_post_comments_by_id,
  GET_course_community_posts_by_id,
  GET_my_course_community_post_comments,
  GET_my_course_community_posts,
  PATCH_course_community_post_by_id,
  PATCH_course_community_post_comment_by_id,
  POST_course_community_post_comment_by_id,
  POST_course_community_post_comment_like_by_id,
  POST_course_community_post_like_by_id,
  POST_course_community_posts_by_id,
} from './community.service';
import {
  CourseCommunityPostCommentRequest,
  CourseCommunityPostCommentUpdateRequest,
  CourseCommunityPostRequest,
  CourseCommunityPostUpdateRequest,
} from './community.type';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** 커뮤니티 글 목록 검색 */
export const useGetCourseCommunityPosts = (courseId: number, page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [GET_course_community_posts_by_id.name, courseId, page, pageSize],
    queryFn: () => GET_course_community_posts_by_id(courseId, page, pageSize),
    select: ({ data }) => data,
  });
};

/** 커뮤니티 글 목록 무한 스크롤 */
export const useGetCourseCommunityPostsInfinite = (courseId: number, pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: [GET_course_community_posts_by_id.name, courseId, pageSize],
    queryFn: ({ pageParam = 1 }) => GET_course_community_posts_by_id(courseId, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && lastPageParam < pagination.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap((page) => page.data?.items || []),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
  });
};

/** 커뮤니티 글 작성 */
export const usePostCourseCommunityPostById = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_community_posts_by_id.name],
    mutationFn: (data: CourseCommunityPostRequest) => POST_course_community_posts_by_id(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 댓글 좋아요 (commentId를 파라미터로 받음) */
export const usePostCourseCommunityPostCommentLikeForList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => POST_course_community_post_comment_like_by_id(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
    },
  });
};

/** 커뮤니티 댓글 좋아요 취소 (commentId를 파라미터로 받음) */
export const useDeleteCourseCommunityPostCommentLikeForList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => DELETE_course_community_post_comment_like_by_id(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
    },
  });
};

/** 커뮤니티 글 조회 (상세) */
export const useGetCourseCommunityPostById = (
  courseId: number,
  postId: number,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [GET_course_community_post_by_id.name, courseId, postId],
    queryFn: () => GET_course_community_post_by_id(courseId, postId),
    enabled: options?.enabled,
    select: ({ data }) => data,
  });
};

/** 커뮤니티 글 삭제 */
export const useDeleteCourseCommunityPostById = (courseId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_community_post_by_id.name],
    mutationFn: ({ courseId: cId, postId }: { courseId: number; postId: number }) =>
      DELETE_course_community_post_by_id(cId, postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_community_posts.name] });
    },
  });
};

/** 커뮤니티 글 수정 (postId를 파라미터로 받음) */
export const usePatchCourseCommunityPost = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATCH_course_community_post_by_id.name],
    mutationFn: ({ postId, data }: { postId: number; data: CourseCommunityPostUpdateRequest }) =>
      PATCH_course_community_post_by_id(courseId, postId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_community_posts.name] });
    },
  });
};

/** 내 커뮤니티 글 조회 */
export const useGetMyCourseCommunityPosts = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [GET_my_course_community_posts.name, page, pageSize],
    queryFn: () => GET_my_course_community_posts(page, pageSize),
    select: ({ data }) => data,
  });
};

/** 내 커뮤니티 글 무한 스크롤 */
export const useGetMyCourseCommunityPostsInfinite = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: [GET_my_course_community_posts.name, 'infinite', pageSize],
    queryFn: ({ pageParam = 1 }) => GET_my_course_community_posts(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && lastPageParam < pagination.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap((page) => page.data?.items || []),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
  });
};

/** 커뮤니티 댓글 목록 조회 */
export const useGetCourseCommunityPostCommentsById = (
  courseId: number,
  postId: number,
  page: number = 1,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: [GET_course_community_post_comments_by_id.name, courseId, postId, page, pageSize],
    queryFn: () => GET_course_community_post_comments_by_id(courseId, postId, page, pageSize),
    select: ({ data }) => data,
  });
};

/** 커뮤니티 댓글 목록 무한 스크롤 */
export const useGetCourseCommunityPostCommentsInfinite = (courseId: number, postId: number, pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: [GET_course_community_post_comments_by_id.name, courseId, postId, pageSize],
    queryFn: ({ pageParam = 1 }) => GET_course_community_post_comments_by_id(courseId, postId, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && lastPageParam < pagination.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap((page) => page.data?.items || []),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
  });
};

/** 커뮤니티 댓글 작성 */
export const usePostCourseCommunityPostCommentById = (courseId: number, postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_community_post_comment_by_id.name],
    mutationFn: (data: CourseCommunityPostCommentRequest) =>
      POST_course_community_post_comment_by_id(courseId, postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 댓글 삭제 */
export const useDeleteCourseCommunityPostCommentById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_community_post_comment_by_id.name],
    mutationFn: (commentId: number) => DELETE_course_community_post_comment_by_id(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name] });
    },
  });
};

/** 커뮤니티 댓글 수정 (commentId를 파라미터로 받음) */
export const usePatchCourseCommunityPostCommentForList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CourseCommunityPostCommentUpdateRequest }) =>
      PATCH_course_community_post_comment_by_id(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name] });
    },
  });
};

/** 내 커뮤니티 댓글 조회 - 쓸 곳 미정 */
export const useGetMyCourseCommunityPostComments = () => {
  return useQuery({
    queryKey: [GET_my_course_community_post_comments.name],
    queryFn: () => GET_my_course_community_post_comments(),
    select: ({ data }) => data,
  });
};

/** 커뮤니티 포스트 좋아요 (postId를 파라미터로 받음) */
export const usePostCourseCommunityPostLikeForList = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => POST_course_community_post_like_by_id(courseId, postId),
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 포스트 좋아요 취소 (postId를 파라미터로 받음) */
export const useDeleteCourseCommunityPostLikeForList = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => DELETE_course_community_post_like_by_id(courseId, postId),
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};
