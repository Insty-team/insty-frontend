import {
  CourseCreatorResponse,
  CourseDetailResponse,
  CourseMyResponse,
  CourseProgressByMeResponse,
  CourseProgressResponse,
  CourseRequest,
  CoursesResponse,
  CourseQuestionDetailResponse,
  CourseQuestionListItemResponse,
  CourseQuestionRequest,
  CourseQuestionSearchParams,
  CourseQuestionUpdateRequest,
  MyCourseQuestionResponse,
  CourseQuestionAnswersResponse,
  CourseQuestionAnswerResponse,
  CourseQuestionAnswerRequest,
  CourseQuestionAnswerUpdateRequest
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

/** 
 * 강의 QA 및 커뮤니티 관련 API
 */

/** 강의 질문 목록 검색 */
export const GET_course_questions_by_id = async (
  courseId: number,
  params: CourseQuestionSearchParams = {
    page: 1,
    pageSize: 20,
    orderBy: 'createdAt',
    order: 'desc',
  },
): Promise<PaginatedResponse<CourseQuestionListItemResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}/questions`, {
    params,
  });
  return response.data;
};

/** 질문 작성 */
export const POST_course_question_by_id= async (
  courseId: number,
  data: CourseQuestionRequest,
): Promise<ApiResponse<CourseQuestionDetailResponse>> => {
  const formData = new FormData();

  const courseQuestionReq = {
    title: data.title,
    content: data.content,
    videoUuid: data.videoUuid,
  };

  formData.append(
    'courseQuestionReq',
    new Blob([JSON.stringify(courseQuestionReq)], { type: 'application/json' }),
  );

  const attachments = data.attachments ?? [];
  if (attachments.length > 2) {
    throw new Error('attachments는 최대 2개까지 업로드할 수 있습니다.');
  }

  attachments.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.post(`/api/v1/courses/${courseId}/questions`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 질문 상세 조회 - 질문의 본문, 상태, 첨부파일, 비디오 정보와 최신순 답변 요약 조회 */
export const GET_course_question__by_id = async (courseId: number, questionId: number): Promise<ApiResponse<CourseQuestionDetailResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}/questions/${questionId}`);
  return response.data;
};

/** 질문 수정 */
export const PUT_course_question_by_id = async (
  courseId: number,
  questionId: number,
  data: CourseQuestionUpdateRequest,
): Promise<ApiResponse<CourseQuestionDetailResponse>> => {
  const formData = new FormData();

  const courseQuestionReq = {
    title: data.title,
    content: data.content,
    videoUuid: data.videoUuid,
    deleteFileIds: data.deleteFileIds,
  };

  formData.append(
    'courseQuestionReq',
    new Blob([JSON.stringify(courseQuestionReq)], { type: 'application/json' }),
  );

  const attachments = data.attachments ?? [];
  if (attachments.length > 2) {
    throw new Error('attachments는 최대 2개까지 업로드할 수 있습니다.');
  }

  attachments.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.put(`/api/v1/courses/${courseId}/questions/${questionId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 질문 삭제 */
export const DELETE_course_question_by_id = async (courseId: number, questionId: number): Promise<ApiResponse<boolean>> => {
  const response = await api.delete(`/api/v1/courses/${courseId}/questions/${questionId}`);
  return response.data;
};

/** 내 질문 목록 검색 */
export const GET_course_questions_my = async (courseId: number, params: CourseQuestionSearchParams = {
    page: 1,
    pageSize: 20,
    orderBy: 'createdAt',
    order: 'desc',
  }): Promise<PaginatedResponse<MyCourseQuestionResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}/questions/me`, {
    params,
  });
  return response.data;
};

/** 답변 목록 조회 */
export const GET_course_question_answers_by_id = async (courseId: number, questionId: number, page: number = 1,
  pageSize: number = 10,): Promise<PaginatedResponse<CourseQuestionAnswersResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}/questions/${questionId}/answers`, {
    params: {
      page,
      pageSize,
    },
  });
  return response.data;
};

/** 답변 작성 */
export const POST_course_question_answer_by_id = async (courseId: number, questionId: number, data: CourseQuestionAnswerRequest): Promise<ApiResponse<CourseQuestionAnswerResponse>> => {
  const formData = new FormData();

  const courseAnswerCreateReq = {
    content: data.content,
    videoUuid: data.videoUuid,
  };

  formData.append(
    'courseAnswerCreateReq',
    new Blob([JSON.stringify(courseAnswerCreateReq)], { type: 'application/json' }),
  );

  const attachments = data.attachments ?? [];
  if (attachments.length > 2) {
    throw new Error('attachments는 최대 2개까지 업로드할 수 있습니다.');
  }

  attachments.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await api.post(`/api/v1/courses/${courseId}/questions/${questionId}/answers`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 답변 채택 */
export const POST_course_question_answer_accept_by_id = async (courseId: number, questionId: number, answerId: number): Promise<ApiResponse<CourseQuestionAnswerResponse>> => {
  const response = await api.post(`/api/v1/courses/${courseId}/questions/${questionId}/answers/${answerId}/accept`);
  return response.data;
};
/** 답변 삭제 */
export const DELETE_course_question_answer_by_id = async (courseId: number, questionId: number, answerId: number): Promise<ApiResponse<boolean>> => {
  const response = await api.delete(`/api/v1/courses/${courseId}/questions/${questionId}/answers/${answerId}`);
  return response.data;
};

/** 답변 수정 */
export const PUT_course_question_answer_by_id = async (courseId: number, questionId: number, answerId: number, data: CourseQuestionAnswerUpdateRequest): Promise<ApiResponse<CourseQuestionAnswerResponse>> => {
  const response = await api.put(`/api/v1/courses/${courseId}/questions/${questionId}/answers/${answerId}`, data);
  return response.data;
};

/** 채택된 답변 조회 */
export const GET_course_question_answer_accept_by_id = async (courseId: number, questionId: Number): Promise<ApiResponse<CourseQuestionAnswerResponse>> => {
  const response = await api.get(`/api/v1/courses/${courseId}/questions/${questionId}/answers/accepted`);
  return response.data;
};