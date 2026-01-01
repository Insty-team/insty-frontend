import {
  AnswerVideoUploadRequest,
  AnswerVideoUploadResponse,
  CourseVideoUploadRequest,
  CourseVideoUploadResponse,
  QuestionVideoUploadRequest,
  QuestionVideoUploadResponse,
  VideoPlaylistRequest,
  VideoPlaylistResponse,
  VideoPreviewRequest,
  VideoPreviewResponse,
  VideoThumbnailResponse,
} from './video.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';
import axios from 'axios';

/** 질문 영상 업로드 */
export const POST_question_video_upload = async (
  data: QuestionVideoUploadRequest,
): Promise<ApiResponse<QuestionVideoUploadResponse>> => {
  const response = await api.post('/api/v1/videos/upload/question', data);
  return response.data;
};

/** 강의 영상 업로드 */
export const POST_course_video_upload = async (
  data: CourseVideoUploadRequest,
): Promise<ApiResponse<CourseVideoUploadResponse>> => {
  const response = await api.post('/api/v1/videos/upload/course', data);
  return response.data;
};

/** 답변 영상 업로드 */
export const POST_answer_video_upload = async (
  data: AnswerVideoUploadRequest,
): Promise<ApiResponse<AnswerVideoUploadResponse>> => {
  const response = await api.post('/api/v1/videos/upload/answer', data);
  return response.data;
};

/** 영상 미리보기 */
export const POST_video_preview = async (data: VideoPreviewRequest): Promise<ApiResponse<VideoPreviewResponse>> => {
  const response = await api.post('/api/v1/videos/preview', data);
  return response.data;
};

/** 영상 조회 */
export const POST_video_playlist = async (data: VideoPlaylistRequest): Promise<ApiResponse<VideoPlaylistResponse>> => {
  const response = await api.post('/api/v1/videos/playlist', data);
  return response.data;
};

/** 영상 썸네일 조회 */
export const GET_video_thumbnail = async (videoUuid: string): Promise<ApiResponse<VideoThumbnailResponse>> => {
  const response = await api.get(`/api/v1/videos/${videoUuid}/thumbnail`);
  return response.data;
};

/** 영상 데이터 가져오기 */
export const GET_video_playlist_by_signed_url = async (signedUrl: string) => {
  const getVideoData = await axios.get(signedUrl, {
    withCredentials: true,
  });
  const lines = getVideoData.data.trim().split('\n');
  const variantM3u8 = lines.find((line: string) => line.endsWith('.m3u8') && !line.startsWith('#'));

  const baseUrl = signedUrl.substring(0, signedUrl.lastIndexOf('/') + 1);
  const m3u8Url = baseUrl + variantM3u8;
  return m3u8Url;
};
