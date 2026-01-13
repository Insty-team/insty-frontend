import { api } from '@/shared/services/api';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api.type';
import {
  CourseCommunityPostResponse,
  CourseCommunityPostRequest,
  CourseCommunityPostDetailResponse,
  CourseCommunityPostUpdateRequest,
  MyCourseCommunityPostsResponse,
  CourseCommunityPostCommentResponse,
  CourseCommunityPostCommentRequest,
  CourseCommunityPostCommentUpdateRequest,
  MyCourseCommunityPostCommentResponse
} from './community.type';

/** 커뮤니티 글 목록 검색 */
export const GET_course_community_posts_by_id = async (courseId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CourseCommunityPostResponse>> => {
  const response = await api.get(`/api/v1/community/courses/${courseId}/posts`, {
    params: {
      page,
      pageSize,
      orderBy: 'createdAt',
      order: 'desc',
    },
  });
  return response.data;
};

/** 커뮤니티 글 작성 */
export const POST_course_community_posts_by_id = async (courseId: number, data: CourseCommunityPostRequest) => {
  const formData = new FormData();

  const post = {
    title: data.title,
    content: data.content,
    videoUuid: data.videoUuid,
  };

  formData.append('post', JSON.stringify(post));

  // attachments가 있는 경우 FormData에 추가
  data.attachments?.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.post(`/api/v1/community/courses/${courseId}/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 커뮤니티 글 조회 (상세) */
export const GET_course_community_post_by_id = async (courseId: number, postId: number): Promise<ApiResponse<CourseCommunityPostDetailResponse>> => {
  const response = await api.get(`/api/v1/community/courses/${courseId}/posts/${postId}`);
  return response.data;
};

/** 커뮤니티 글 삭제 */
export const DELETE_course_community_post_by_id = async (courseId: number, postId: number): Promise<ApiResponse<boolean>> => {
  const response = await api.delete(`/api/v1/community/courses/${courseId}/posts/${postId}`);
  return response.data;
};

/** 커뮤니티 글 수정 */
export const PATCH_course_community_post_by_id = async (courseId: number, postId: number, data: CourseCommunityPostUpdateRequest): Promise<ApiResponse<CourseCommunityPostResponse>> => {
  const formData = new FormData();

  const post = {
    title: data.title,
    content: data.content,
    videoUuid: data.videoUuid,
    deleteFileIds: data.deleteFileIds,
  };

  formData.append('post', JSON.stringify(post));

  // attachments가 있는 경우 FormData에 추가
  data.attachments?.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.patch(`/api/v1/community/courses/${courseId}/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 내 커뮤니티 글 조회 */
export const GET_my_course_community_posts = async (page: number = 1, pageSize: number =10):Promise<PaginatedResponse<MyCourseCommunityPostsResponse>> => {
  const response = await api.get(`/api/v1/community/me/posts`, {
    params: {
      page,
      pageSize,
      orderBy: 'createdAt',
      order: 'desc',
    },
  });
  return response.data;
};

/** 커뮤니티 댓글 목록 조회 */
export const GET_course_community_post_comments_by_id = async (courseId: number, postId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CourseCommunityPostCommentResponse>> => {
  const response = await api.get(`/api/v1/community/courses/${courseId}/posts/${postId}/comments`, {
    params: {
      page,
      pageSize,
      orderBy: 'createdAt',
      order: 'asc',
    },
  });
  return response.data;
};

/** 커뮤니티 댓글 작성 */
export const POST_course_community_post_comment_by_id = async (courseId: number, postId: number, data: CourseCommunityPostCommentRequest): Promise<ApiResponse<CourseCommunityPostCommentResponse>> => {
  const formData = new FormData();

  const comment = {
    content: data.content,
    videoUuid: data.videoUuid,
  };

  formData.append('comment', JSON.stringify(comment));

  // attachments가 있는 경우 FormData에 추가
  data.attachments?.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.post(`/api/v1/community/courses/${courseId}/posts/${postId}/comments`, formData);
  return response.data;
};

/** 커뮤니티 댓글 삭제 */
export const DELETE_course_community_post_comment_by_id = async (commentId: number): Promise<ApiResponse<boolean>> => {
  const response = await api.delete(`/api/v1/community/comments/${commentId}`);
  return response.data;
};

/** 커뮤니티 댓글 수정 */
export const PATCH_course_community_post_comment_by_id = async (commentId: number, data: CourseCommunityPostCommentUpdateRequest): Promise<ApiResponse<CourseCommunityPostCommentResponse>> => {
  const formData = new FormData();

  const comment = {
    content: data.content,
    videoUuid: data.videoUuid,
    deleteFileIds: data.deleteFileIds,
  };

  formData.append('comment', JSON.stringify(comment));

  // attachments가 있는 경우 FormData에 추가
  data.attachments?.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.patch(`/api/v1/community/comments/${commentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 내 커뮤니티 댓글 조회 */
export const GET_my_course_community_post_comments = async (page: number = 1, pageSize: number =10): Promise<PaginatedResponse<MyCourseCommunityPostCommentResponse>> => {
  const response = await api.get(`/api/v1/community/me/comments`, {
    params: {
      page,
      pageSize,
      orderBy: 'createdAt',
      order: 'desc',
    },
  });
  return response.data;
};