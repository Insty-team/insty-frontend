import {
  GET_video_thumbnail,
  POST_answer_video_upload,
  POST_course_video_upload,
  POST_question_video_upload,
  POST_video_playlist,
  POST_video_preview,
} from './video.service';
import {
  AnswerVideoUploadRequest,
  CourseVideoUploadRequest,
  QuestionVideoUploadRequest,
  VideoPlaylistRequest,
  VideoPreviewRequest,
  VideoThumbnailResponse,
} from './video.type';

import { ApiResponse } from '@/shared/types/api.type';
import { Query, useMutation, useQuery } from '@tanstack/react-query';

/** 질문 영상 업로드 */
export const usePostQuestionVideoUpload = () => {
  return useMutation({
    mutationKey: [POST_question_video_upload.name],
    mutationFn: (data: QuestionVideoUploadRequest) => POST_question_video_upload(data),
  });
};

/** 강의 영상 업로드 */
export const usePostCourseVideoUpload = () => {
  return useMutation({
    mutationKey: [POST_course_video_upload.name],
    mutationFn: (data: CourseVideoUploadRequest) => POST_course_video_upload(data),
  });
};

/** 답변 영상 업로드 */
export const usePostAnswerVideoUpload = () => {
  return useMutation({
    mutationKey: [POST_answer_video_upload.name],
    mutationFn: (data: AnswerVideoUploadRequest) => POST_answer_video_upload(data),
  });
};

/** 영상 미리보기 */
export const usePostVideoPreview = () => {
  return useMutation({
    mutationKey: [POST_video_preview.name],
    mutationFn: (data: VideoPreviewRequest) => POST_video_preview(data),
  });
};
/** 영상 조회 */
export const usePostVideoPlaylist = () => {
  return useMutation({
    mutationKey: [POST_video_playlist.name],
    mutationFn: (data: VideoPlaylistRequest) => POST_video_playlist(data),
  });
};
/** 영상 썸네일 조회 */
export const useGetVideoThumbnail = (
  videoUuid: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | ((query: Query<ApiResponse<VideoThumbnailResponse>, Error>) => number | false);
    retry?: boolean;
  },
) => {
  return useQuery({
    queryKey: [GET_video_thumbnail.name, videoUuid],
    queryFn: () => GET_video_thumbnail(videoUuid),
    enabled: options?.enabled !== undefined ? options.enabled : !!videoUuid,
    select: (response) => response.data,
    refetchInterval: options?.refetchInterval,
    retry: options?.retry,
  });
};
