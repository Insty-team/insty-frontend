import {
  DELETE_video,
  DELETE_videos_batch,
  GET_video_transcription_status,
  GET_video_vector_status,
  POST_video_metadata_suggestion,
  POST_video_suggest_description,
  POST_video_suggest_practice_guide,
  POST_video_suggest_title,
  POST_video_transcribe,
  POST_video_vector_upsert,
} from './ai-video.service';
import {
  DescriptionSuggestionRequest,
  TitleSuggestionRequest,
  TranscribeVideoRequest,
  TranscriptionStatusResponse,
  VectorStatusResponse,
  VideoBatchDeleteRequest,
} from './ai-video.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 영상 STT (Transcribe) */
export const usePostVideoTranscribe = (videoId: number) => {
  return useMutation({
    mutationKey: [POST_video_transcribe.name, videoId],
    mutationFn: (data: TranscribeVideoRequest) => POST_video_transcribe(videoId, data),
  });
};

/** STT 상태 조회 */
export const useGetVideoTranscriptionStatus = (videoUuid: string) => {
  return useQuery({
    queryKey: [GET_video_transcription_status.name, videoUuid],
    queryFn: () => GET_video_transcription_status(videoUuid),
    enabled: !!videoUuid,
    select: ({ data }) => data,
    refetchInterval: (query) => {
      const data = query.state.data as TranscriptionStatusResponse | undefined;
      const status = data?.status;
      return status === 'IN_PROGRESS' || status === 'PENDING' ? 2000 : false;
    },
  });
};

/** 음성텍스트 임베딩 (Vector Upsert) */
export const usePostVideoVectorUpsert = (videoUuid: string) => {
  return useMutation({
    mutationKey: [POST_video_vector_upsert.name, videoUuid],
    mutationFn: () => POST_video_vector_upsert(videoUuid),
  });
};

/** 임베딩 상태 조회 */
export const useGetVideoVectorStatus = (videoUuid: string) => {
  return useQuery({
    queryKey: [GET_video_vector_status.name, videoUuid],
    queryFn: () => GET_video_vector_status(videoUuid),
    enabled: !!videoUuid,
    select: ({ data }) => data,
    refetchInterval: (query) => {
      const data = query.state.data as VectorStatusResponse | undefined;
      const status = data?.status;
      return status === 'IN_PROGRESS' || status === 'PENDING' ? 2000 : false;
    },
  });
};

/** AI 기반 영상 초안 생성 */
export const usePostVideoMetadataSuggestion = (videoUuid: string) => {
  return useMutation({
    mutationKey: [POST_video_metadata_suggestion.name, videoUuid],
    mutationFn: () => POST_video_metadata_suggestion(videoUuid),
  });
};

/** AI 기반 영상 제목 수정 제안 */
export const usePostVideoSuggestTitle = (videoUuid: string) => {
  return useMutation({
    mutationKey: [POST_video_suggest_title.name, videoUuid],
    mutationFn: (data: TitleSuggestionRequest) => POST_video_suggest_title(videoUuid, data),
  });
};

/** AI 기반 영상 설명 수정 제안 */
export const usePostVideoSuggestDescription = (videoUuid: string) => {
  return useMutation({
    mutationKey: [POST_video_suggest_description.name, videoUuid],
    mutationFn: (data: DescriptionSuggestionRequest) => POST_video_suggest_description(videoUuid, data),
  });
};

/** AI 기반 실습자료 생성 */
export const usePostVideoSuggestPracticeGuide = (videoUuid: string) => {
  return useMutation({
    mutationKey: [POST_video_suggest_practice_guide.name, videoUuid],
    mutationFn: () => POST_video_suggest_practice_guide(videoUuid),
  });
};

/** 영상 관련 데이터 단일 삭제 */
export const useDeleteVideo = () => {
  return useMutation({
    mutationKey: [DELETE_video.name],
    mutationFn: (videoUuid: string) => DELETE_video(videoUuid),
  });
};

/** 영상 관련 데이터 다중 삭제 */
export const useDeleteVideosBatch = () => {
  return useMutation({
    mutationKey: [DELETE_videos_batch.name],
    mutationFn: (data: VideoBatchDeleteRequest) => DELETE_videos_batch(data),
  });
};
