import {
  CourseCreatorResponse,
  CourseDetailResponse,
  CourseMyResponse,
  CourseProgressByMeResponse,
  CourseProgressResponse,
  CourseRequest,
  CoursesResponse,
} from './course.type';

import { api } from '@/shared/services/api';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api.type';

import { SortOption } from '@/app/(authorized)/creator/(mypage)/courses/_components/CourseFilters';

/** 강의 상세조회 */
export const GET_course_by_id = async (courseId: string): Promise<ApiResponse<CourseDetailResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}`);
  return response.data;
};

/** 강의 수정 */
// TODO: multipart/form-data 형식으로 수정
export const PUT_course_by_id = async (
  courseId: string,
  data: CourseRequest,
): Promise<ApiResponse<CourseDetailResponse>> => {
  const response = await api.put(`/api/v1/courses/${courseId}`, data);
  return response.data;
};

/** 강의 삭제 */
export const DELETE_course_by_id = async (courseId: string): Promise<ApiResponse<boolean>> => {
  const response = await api.delete(`/api/v1/courses/${courseId}`);
  return response.data;
};

/** 강좌의 visible 상태 변경 */
export const PUT_course_visible_by_id = async (courseId: string, isShow: boolean): Promise<ApiResponse<boolean>> => {
  const response = await api.put(`/api/v1/courses/${courseId}/visibility?isShow=${isShow}`);
  return response.data;
};

/** 강의 목록조회 */
// TODO: query params 추가
export const GET_courses = async (): Promise<PaginatedResponse<CoursesResponse>> => {
  const response = await api.get('/api/v1/courses');
  return response.data;
};

/** 강의 게시 */
// TODO: multipart/form-data 형식으로 수정
export const POST_course = async (data: CourseRequest): Promise<ApiResponse<CourseDetailResponse>> => {
  const response = await api.post('/api/v1/courses', data);
  return response.data;
};

/** 강좌 수강하기 */
export const POST_course_progress_by_id = async (courseId: string): Promise<ApiResponse<CourseProgressResponse>> => {
  const response = await api.post(`/api/v1/courses/courseProgress/${courseId}`);
  return response.data;
};

/** 내가 업로드한 강의 목록조회 */
export const GET_courses_my = async (
  page: number = 1,
  pageSize: number = 10,
  isShow?: boolean,
  sortType?: SortOption,
): Promise<PaginatedResponse<CourseMyResponse>> => {
  const response = await api.get(`/api/v1/courses/my`, {
    params: {
      page,
      pageSize,
      isShow,
      sortType,
    },
  });
  return response.data;
};

/** 강의 상세조회(크리에이터용) */
export const GET_course_by_id_for_creator = async (courseId: string): Promise<ApiResponse<CourseCreatorResponse>> => {
  const response = await api.get(`/api/v1/courses/creator/${courseId}`);
  return response.data;
};

/** 내가 수강중인 강의 목록조회 */
export const GET_courses_Progress_by_me = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<CourseProgressByMeResponse>> => {
  const response = await api.get('/api/v1/courses/courseProgress', {
    params: {
      page,
      pageSize,
    },
  });
  return response.data;
};

/** 강의 수강 여부 조회 */
export const GET_course_progress_exists_by_id = async (courseId: string): Promise<ApiResponse<boolean>> => {
  const response = await api.get(`/api/v1/courses/courseProgress/${courseId}/exists`);
  return response.data;
};
