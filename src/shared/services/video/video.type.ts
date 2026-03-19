import { VideoType } from '../course/course.type';

export type QuestionVideoUploadRequest = {
  fileName: string;
  contentType: string;
};

export type QuestionVideoUploadResponse = {
  uuid: string;
  uploadUrl: string;
  expiredAt: string;
};

export type CourseVideoUploadRequest = {
  fileName: string;
  contentType: string;
};

export type CourseVideoUploadResponse = {
  uuid: string;
  uploadUrl: string;
  expiredAt: string;
};

export type AnswerVideoUploadRequest = {
  fileName: string;
  contentType: string;
};

export type AnswerVideoUploadResponse = {
  uuid: string;
  uploadUrl: string;
  expiredAt: string;
};


export type CommunityPostVideoUploadRequest = {
  fileName: string;
  contentType: string;
};

export type CommunityPostVideoUploadResponse = {
  uuid: string;
  uploadUrl: string;
  expiredAt: string;
};

export type CommunityCommentVideoUploadRequest = {
  fileName: string;
  contentType: string;
};

export type CommunityCommentVideoUploadResponse = {
  uuid: string;
  uploadUrl: string;
  expiredAt: string;
};

export type VideoPreviewRequest = {
  type: VideoType;
  id: string;
};

export type VideoPreviewResponse = {
  signedUrl: string;
};

export type VideoPlaylistRequest = {
  type: VideoType;
  id: string;
};

export type VideoPlaylistResponse = {
  signedUrl: string;
};

export type VideoThumbnailResponse = {
  thumbnailUrl: string;
};
