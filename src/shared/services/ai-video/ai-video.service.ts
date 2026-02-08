import {
  DescriptionSuggestionRequest,
  DescriptionSuggestionResponse,
  MetadataSuggestionResponse,
  PracticeGuideSuggestionResponse,
  TitleSuggestionRequest,
  TitleSuggestionResponse,
  TranscribeVideoRequest,
  TranscribeVideoResponse,
  TranscriptionStatusResponse,
  VectorStatusResponse,
  VideoBatchDeleteRequest,
} from './ai-video.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 영상 STT (Transcribe) */
export const POST_video_transcribe = async (
  videoId: number,
  data: TranscribeVideoRequest,
): Promise<ApiResponse<TranscribeVideoResponse>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoId}/transcribe`, data);
  return response.data;
};

/** STT 상태 조회 */
export const GET_video_transcription_status = async (
  videoUuid: string,
): Promise<ApiResponse<TranscriptionStatusResponse>> => {
  const response = await api.get(`/api/v1/ai/videos/${videoUuid}/transcription-status`);
  return response.data;
};

/** 음성텍스트 임베딩 (Vector Upsert) */
export const POST_video_vector_upsert = async (videoUuid: string): Promise<ApiResponse<string>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoUuid}/vector-upsert`);
  return response.data;
};

/** 임베딩 상태 조회 */
export const GET_video_vector_status = async (videoUuid: string): Promise<ApiResponse<VectorStatusResponse>> => {
  const response = await api.get(`/api/v1/ai/videos/${videoUuid}/vector-status`);
  return response.data;
};

/** AI 기반 영상 초안 생성 */
export const POST_video_metadata_suggestion = async (
  videoUuid: string,
): Promise<ApiResponse<MetadataSuggestionResponse>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoUuid}/metadata-suggestion`);
  return response.data;
};

/** AI 기반 영상 제목 수정 제안 */
export const POST_video_suggest_title = async (
  videoUuid: string,
  data: TitleSuggestionRequest,
): Promise<ApiResponse<TitleSuggestionResponse>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoUuid}/suggest-title`, data);
  return response.data;
};

/** AI 기반 영상 설명 수정 제안 */
export const POST_video_suggest_description = async (
  videoUuid: string,
  data: DescriptionSuggestionRequest,
): Promise<ApiResponse<DescriptionSuggestionResponse>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoUuid}/suggest-description`, data);
  return response.data;
};

/** AI 기반 실습자료 생성 */
export const POST_video_suggest_practice_guide = async (
  videoUuid: string,
): Promise<ApiResponse<PracticeGuideSuggestionResponse>> => {
  const response = await api.post(`/api/v1/ai/videos/${videoUuid}/suggest-practice-guide`);
  return response.data;
};

/** 영상 관련 데이터 단일 삭제 */
export const DELETE_video = async (videoUuid: string): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await api.delete(`/api/v1/ai/videos/${videoUuid}`);
  return response.data;
};

/** 영상 관련 데이터 다중 삭제 */
export const DELETE_videos_batch = async (
  data: VideoBatchDeleteRequest,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await api.delete('/api/v1/ai/videos/', { data });
  return response.data;
};
