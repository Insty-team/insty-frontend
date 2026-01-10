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

/** 강의 목록조회 */
// TODO: query params 추가
export const GET_courses = async (): Promise<PaginatedResponse<CoursesResponse>> => {
  const response = await api.get('/api/v1/courses');
  return response.data;
};

/** 강의 게시 */
export const POST_course = async (data: CourseRequest): Promise<ApiResponse<CourseDetailResponse>> => {
  const formData = new FormData();

  // JSON 파트
  const courseBody = {
    keyPoints: data.keyPoints,
    isShow: data.isShow,
    price: 0,
    installEnvChecklist: data.installEnvChecklist,
    targetAudience: data.targetAudience,
    videoUuid: data.videoUuid,
    title: data.title,
    tags: data.tags,
    description: data.description,
  };
  // 일부 서버는 RequestPart JSON을 Blob보다 "문자열(JSON)"로 받는 걸 선호합니다.
  formData.append('coursePostReq', JSON.stringify(courseBody));

  // 파일 파트
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }

  if (data.practiceFile && data.practiceFile.length > 0) {
    data.practiceFile.forEach((file) => formData.append('practiceFile', file));
  }

  // NOTE: Content-Type을 직접 지정하지 말아야 boundary가 자동으로 붙습니다.
  const response = await api.post('/api/v1/courses', formData);
  return response.data;
};

/** 강좌 수강하기 */
export const POST_course_progress_by_id = async (courseId: string): Promise<ApiResponse<CourseProgressResponse>> => {
  const response = await api.post(`/api/v1/courses/${courseId}/enrollment`);
  return response.data;
};

/** 내가 업로드한 강의 목록조회 */
export const GET_courses_my = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<CourseMyResponse>> => {
  const response = await api.get(`/api/v1/courses/my?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

/** 강의 상세조회(크리에이터용) */
export const GET_course_by_id_for_creator = async (courseId: string): Promise<ApiResponse<CourseCreatorResponse>> => {
  const response = await api.get(`/api/v1/courses/creator/${courseId}`);
  return response.data;
};

/** 내가 수강중인 강의 목록조회 */
export const GET_courses_Progress_by_me = async (): Promise<PaginatedResponse<CourseProgressByMeResponse>> => {
  const response = await api.get('/api/v1/courses/courseProgress');
  return response.data;
};
