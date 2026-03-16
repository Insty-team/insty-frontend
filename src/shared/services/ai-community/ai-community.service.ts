import {
  AnswerDraftRequest,
  AnswerDraftResponse,
  CourseFormResponse,
  CourseRequest,
  CourseRequestAnswer,
  CourseRequestAvailabilityResponse,
  CourseRequestRecommendationResponse,
  CourseRequestStatusUpdateRequest,
  CourseRequestStatusUpdateResponse,
  CourseRequestSuggestion,
  CourseResponse,
  CourseResponseSuggestion,
  CreatorRecommendationFormResponse,
  FormCheckResponse,
  QuestionDraftRequest,
  QuestionDraftResponse,
} from './ai-community.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 내 강의 요청 목록 조회 */
export const GET_community_course_requests = async (): Promise<ApiResponse<CourseResponse[]>> => {
  const response = await api.get('/api/v1/ai/community/course-requests');
  return response.data;
};

/** 강의 요청 생성 */
export const POST_community_course_request = async (data: CourseRequest): Promise<ApiResponse<CourseResponse>> => {
  const response = await api.post('/api/v1/ai/community/course-requests', data);
  return response.data;
};

/** 강의 요청 단일 삭제 */
export const DELETE_community_course_request = async (requestId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/api/v1/ai/community/course-requests/${requestId}`);
  return response.data;
};

/** 강의 요청 폼 조회 */
export const GET_community_course_request_form = async (): Promise<ApiResponse<CourseFormResponse>> => {
  const response = await api.get('/api/v1/ai/community/course-requests/form');
  return response.data;
};

/** 크리에이터 추천 폼 조회 */
export const GET_community_creator_recommendation_form = async (): Promise<
  ApiResponse<CreatorRecommendationFormResponse>
> => {
  const response = await api.get('/api/v1/ai/community/creator-recommendation/form');
  return response.data;
};

/** (영상 기반) 강의 요청 추천 */
export const POST_community_course_request_recommendation_with_base = async (): Promise<
  ApiResponse<CourseRequestRecommendationResponse>
> => {
  const response = await api.post('/api/v1/ai/community/course-request-recommendation/with-base', undefined, { timeout: 60000 });
  return response.data;
};

/** (폼 기반) 강의 요청 추천 */
export const POST_community_course_request_recommendation_without_base = async (data: {
  answers: CourseRequestAnswer[];
}): Promise<ApiResponse<CourseRequestRecommendationResponse>> => {
  const response = await api.post('/api/v1/ai/community/course-request-recommendation/without-base', data, {
    timeout: 60000,
  });
  return response.data;
};

/** 추천 강의 요청 상태 업데이트 */
export const PATCH_community_course_request_recommendation_status = async (
  requestId: number,
  data: CourseRequestStatusUpdateRequest,
): Promise<ApiResponse<CourseRequestStatusUpdateResponse>> => {
  const response = await api.patch(`/api/v1/ai/community/course-request-recommendation/${requestId}/status`, data);
  return response.data;
};

/** 강의 요청 업로드 가능 여부 조회 */
export const GET_community_course_request_availability = async (
  requestId: number,
): Promise<ApiResponse<CourseRequestAvailabilityResponse>> => {
  const response = await api.get(`/api/v1/ai/community/course-request-recommendation/${requestId}/availability`);
  return response.data;
};

/** 강의 요청 최종 결과 조회 */
export const GET_community_course_request_final_result = async (requestId: number): Promise<ApiResponse<any>> => {
  const response = await api.get(`/api/v1/ai/community/course-requests/${requestId}/final-result`, { timeout: 60000 });
  return response.data;
};

/** 크리에이터 최근 추천 폼 작성 이력 조회 */
export const GET_community_creator_recommendation_form_last = async (): Promise<ApiResponse<FormCheckResponse>> => {
  const response = await api.get('/api/v1/ai/community/creator-recommendation/form/last');
  return response.data;
};

/** 강의 요청 주제 제안 */
export const POST_community_course_request_suggestion = async (
  data: CourseRequestSuggestion,
): Promise<ApiResponse<CourseResponseSuggestion>> => {
  const response = await api.post('/api/v1/ai/community/course-request-suggestion', data);
  return response.data;
};

/** 질문 초안 생성 */
export const POST_community_question_draft = async (
  data: QuestionDraftRequest,
): Promise<ApiResponse<QuestionDraftResponse>> => {
  const formData = new FormData();
  formData.append('course_id', data.course_id.toString());
  formData.append('query', data.query);
  formData.append('has_attachment', (data.has_attachment ?? false).toString());

  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await api.post('/api/v1/ai/community/question-draft', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 답변 초안 생성 */
export const POST_community_answer_draft = async (
  data: AnswerDraftRequest,
): Promise<ApiResponse<AnswerDraftResponse>> => {
  const formData = new FormData();
  formData.append('course_id', data.course_id.toString());
  formData.append('query', data.query);
  formData.append('has_attachment', (data.has_attachment ?? false).toString());

  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await api.post('/api/v1/ai/community/answer-draft', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
