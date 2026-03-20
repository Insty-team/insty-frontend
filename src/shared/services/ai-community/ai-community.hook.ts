import {
  DELETE_community_course_request,
  GET_community_course_request_availability,
  GET_community_course_request_final_result,
  GET_community_course_request_form,
  GET_community_course_requests,
  GET_community_creator_recommendation_form,
  GET_community_creator_recommendation_form_last,
  PATCH_community_course_request_recommendation_status,
  POST_community_answer_draft,
  POST_community_course_request,
  POST_community_course_request_recommendation_with_base,
  POST_community_course_request_recommendation_without_base,
  POST_community_course_request_suggestion,
  POST_community_question_draft,
  POST_community_thought_draft,
} from './ai-community.service';
import {
  AnswerDraftRequest,
  CommunityThoughtDraftRequest,
  CourseRequest,
  CourseRequestAnswer,
  CourseRequestStatusUpdateRequest,
  CourseRequestSuggestion,
  QuestionDraftRequest,
} from './ai-community.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 내 강의 요청 목록 조회 */
export const useGetCommunityCourseRequests = () => {
  return useQuery({
    queryKey: [GET_community_course_requests.name],
    queryFn: () => GET_community_course_requests(),
    select: ({ data }) => data,
  });
};

/** 강의 요청 생성 */
export const usePostCommunityCourseRequest = () => {
  return useMutation({
    mutationKey: [POST_community_course_request.name],
    mutationFn: (data: CourseRequest) => POST_community_course_request(data),
  });
};

/** 강의 요청 단일 삭제 */
export const useDeleteCommunityCourseRequest = () => {
  return useMutation({
    mutationKey: [DELETE_community_course_request.name],
    mutationFn: (requestId: number) => DELETE_community_course_request(requestId),
  });
};

/** 강의 요청 폼 조회 */
export const useGetCommunityCourseRequestForm = () => {
  return useQuery({
    queryKey: [GET_community_course_request_form.name],
    queryFn: () => GET_community_course_request_form(),
    select: ({ data }) => data,
  });
};

/** 크리에이터 추천 폼 조회 */
export const useGetCommunityCreatorRecommendationForm = () => {
  return useQuery({
    queryKey: [GET_community_creator_recommendation_form.name],
    queryFn: () => GET_community_creator_recommendation_form(),
    select: ({ data }) => data,
  });
};

/** (영상 기반) 강의 요청 추천 */
export const usePostCommunityCourseRequestRecommendationWithBase = () => {
  return useMutation({
    mutationKey: [POST_community_course_request_recommendation_with_base.name],
    mutationFn: () => POST_community_course_request_recommendation_with_base(),
  });
};

/** (폼 기반) 강의 요청 추천 */
export const usePostCommunityCourseRequestRecommendationWithoutBase = () => {
  return useMutation({
    mutationKey: [POST_community_course_request_recommendation_without_base.name],
    mutationFn: (data: { answers: CourseRequestAnswer[] }) =>
      POST_community_course_request_recommendation_without_base(data),
  });
};

/** 추천 강의 요청 상태 업데이트 */
export const usePatchCommunityCourseRequestRecommendationStatus = (requestId: number) => {
  return useMutation({
    mutationKey: [PATCH_community_course_request_recommendation_status.name, requestId],
    mutationFn: (data: CourseRequestStatusUpdateRequest) =>
      PATCH_community_course_request_recommendation_status(requestId, data),
  });
};

/** 강의 요청 업로드 가능 여부 조회 */
export const useGetCommunityCourseRequestAvailability = (requestId: number) => {
  return useQuery({
    queryKey: [GET_community_course_request_availability.name, requestId],
    queryFn: () => GET_community_course_request_availability(requestId),
    enabled: !!requestId,
    select: ({ data }) => data,
  });
};

/** 강의 요청 최종 결과 조회 */
export const useGetCommunityCourseRequestFinalResult = (requestId: number) => {
  return useQuery({
    queryKey: [GET_community_course_request_final_result.name, requestId],
    queryFn: () => GET_community_course_request_final_result(requestId),
    enabled: !!requestId,
    select: ({ data }) => data,
  });
};

/** 크리에이터 최근 추천 폼 작성 이력 조회 */
export const useGetCommunityCreatorRecommendationFormLast = () => {
  return useQuery({
    queryKey: [GET_community_creator_recommendation_form_last.name],
    queryFn: () => GET_community_creator_recommendation_form_last(),
    select: ({ data }) => data,
  });
};

/** 강의 요청 주제 제안 */
export const usePostCommunityCourseRequestSuggestion = () => {
  return useMutation({
    mutationKey: [POST_community_course_request_suggestion.name],
    mutationFn: (data: CourseRequestSuggestion) => POST_community_course_request_suggestion(data),
  });
};

/** 질문 초안 생성 */
export const usePostCommunityQuestionDraft = () => {
  return useMutation({
    mutationKey: [POST_community_question_draft.name],
    mutationFn: (data: QuestionDraftRequest) => POST_community_question_draft(data),
  });
};

/** 답변 초안 생성 */
export const usePostCommunityAnswerDraft = () => {
  return useMutation({
    mutationKey: [POST_community_answer_draft.name],
    mutationFn: (data: AnswerDraftRequest) => POST_community_answer_draft(data),
  });
};

/** 커뮤니티 포스트 초안 생성 */
export const usePostCommunityThoughtDraft = () => {
  return useMutation({
    mutationKey: [POST_community_thought_draft.name],
    mutationFn: (data: CommunityThoughtDraftRequest) => POST_community_thought_draft(data),
  });
};
