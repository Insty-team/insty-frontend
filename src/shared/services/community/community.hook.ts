import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  GET_course_community_posts_by_id,
  GET_course_community_post_by_id,
  GET_course_community_post_comments_by_id,
  GET_my_course_community_posts,
  GET_my_course_community_post_comments,
  POST_course_community_posts_by_id,
  POST_course_community_post_comment_by_id,
  DELETE_course_community_post_by_id,
  DELETE_course_community_post_comment_by_id,
  PATCH_course_community_post_by_id,
  PATCH_course_community_post_comment_by_id,
  POST_course_community_post_like_by_id,
  DELETE_course_community_post_like_by_id,
  POST_course_community_post_comment_like_by_id,
  DELETE_course_community_post_comment_like_by_id,
} from './community.service';
import {
  CourseCommunityPostCommentRequest,
  CourseCommunityPostCommentUpdateRequest,
  CourseCommunityPostRequest,
  CourseCommunityPostUpdateRequest,
} from './community.type';

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
      items: data.pages.flatMap(page => page.data?.items || []),
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
export const useDeleteCourseCommunityPostById = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_community_post_by_id.name],
    mutationFn: (postId: number) => DELETE_course_community_post_by_id(courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 글 수정 */
export const usePatchCourseCommunityPostById = (courseId: number, postId: number) => {
  return useMutation({
    mutationKey: [PATCH_course_community_post_by_id.name],
    mutationFn: (data: CourseCommunityPostUpdateRequest) => PATCH_course_community_post_by_id(courseId, postId, data),
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
export const useGetCourseCommunityPostCommentsInfinite = (
  courseId: number,
  postId: number,
  pageSize: number = 20,
) => {
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
      items: data.pages.flatMap(page => page.data?.items || []),
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
    },
  });
};

/** 커뮤니티 댓글 수정 */
export const usePatchCourseCommunityPostCommentById = (commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATCH_course_community_post_comment_by_id.name],
    mutationFn: (data: CourseCommunityPostCommentUpdateRequest) =>
      PATCH_course_community_post_comment_by_id(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
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

/** 커뮤니티 포스트 좋아요 */
export const usePostCourseCommunityPostLike = (courseId: number, postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_community_post_like_by_id.name, courseId, postId],
    mutationFn: () => POST_course_community_post_like_by_id(courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 포스트 좋아요 취소 */
export const useDeleteCourseCommunityPostLike = (courseId: number, postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_community_post_like_by_id.name, courseId, postId],
    mutationFn: () => DELETE_course_community_post_like_by_id(courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_by_id.name, courseId, postId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 포스트 좋아요 (리스트용 - postId를 파라미터로 받음) */
export const usePostCourseCommunityPostLikeForList = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => POST_course_community_post_like_by_id(courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 포스트 좋아요 취소 (리스트용 - postId를 파라미터로 받음) */
export const useDeleteCourseCommunityPostLikeForList = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => DELETE_course_community_post_like_by_id(courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_posts_by_id.name, courseId] });
    },
  });
};

/** 커뮤니티 댓글 좋아요 */
export const usePostCourseCommunityPostCommentLike = (commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_community_post_comment_like_by_id.name, commentId],
    mutationFn: () => POST_course_community_post_comment_like_by_id(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
    },
  });
};

/** 커뮤니티 댓글 좋아요 취소 */
export const useDeleteCourseCommunityPostCommentLike = (commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_community_post_comment_like_by_id.name, commentId],
    mutationFn: () => DELETE_course_community_post_comment_like_by_id(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_community_post_comments_by_id.name] });
    },
  });
};