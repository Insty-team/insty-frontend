export type VideoType = 'COURSE' | 'ANSWER' | 'QUESTION' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';

export type Attachment = {
  id: number;
  name: string;
  contentType: string;
  size: number;
  url: string;
};

export type VideoInfo = {
  videoType: VideoType;
  videoUuid: string;
  originFileName: string;
};

export type CourseCommunityPostResponse = {
  postId: number;
  user: {
    id: number;
    nickname: string;
    userType?: string;
  };
  courseId?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  attachments?: Attachment[];
  videoInfo: VideoInfo | null;
  likeCount?: number;
  likedByMe?: boolean;
};

export type CourseCommunityPostRequest = {
  content: string;
  videoUuid?: string | null;
  attachments?: File[] | null;
};

export type CourseCommunityPostDetailResponse = CourseCommunityPostResponse & {
  courseName: string;
};

export type CourseCommunityPostUpdateRequest = {
  content: string;
  videoUuid: string | null;
  deleteFileIds?: number[] | null;
  attachments?: File[] | null;
};

export type MyCourseCommunityPostsResponse = {
  postId: number;
  courseId: number;
  content: string;
  attachments: Attachment[];
  videoInfo: VideoInfo | null;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
  likedByMe?: boolean;
};

export type CourseCommunityPostCommentResponse = {
  commentId: number;
  postId: number;
  user: {
    id: number;
    nickname: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  videoInfo: VideoInfo | null;
  likeCount?: number;
  likedByMe?: boolean;
};

export type CourseCommunityPostCommentRequest = {
  content: string;
  videoUuid?: string | null;
  attachments?: File[] | null;
};

export type CourseCommunityPostCommentUpdateRequest = {
  content: string;
  videoUuid?: string | null;
  deleteFileIds?: number[] | null;
  attachments?: File[] | null;
};

export type MyCourseCommunityPostCommentResponse = {
  commentId: number;
  postId: number;
  courseId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommunityLikeResponse = {
  likeCount: number;
  likedByMe: boolean;
};
