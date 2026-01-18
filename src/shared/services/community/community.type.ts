export type VideoType = 'COURSE' | 'ANSWER' | 'QUESTION';

export type Attachment = {
  id: number;
  name: string;
  contentType: string;
  size: number;
  url: string;
};

export type CourseCommunityPostResponse = {
  postId: number;
  user: {
    id: number;
    nickname: string;
    userType?: string;
  };
  courseId?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  attachments?: Attachment[];
  videoInfo?: {
    videoType: VideoType;
    videoUuid: string;
    originFileName: string;
  } | null;
  likeCount?: number;
};

export type CourseCommunityPostRequest = {
  title: string;
  content: string;
  videoUuid?: string;
  attachments?: File[];
};

export type CourseCommunityPostDetailResponse = CourseCommunityPostResponse & {
  attachments: Attachment[];
  videoInfo: {
    videoType: VideoType;
    videoUuid: string;
    originFileName: string;
  };
  likeCount?: number;
  likedByMe?: boolean;
};

export type CourseCommunityPostUpdateRequest = {
  title: string;
  content: string;
  videoUuid?: string;
  deleteFileIds?: number[];
  attachments?: File[];
};

export type MyCourseCommunityPostsResponse = {
  postId: number;
  courseId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
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
  likeCount?: number;
  likedByMe?: boolean;
};

export type CourseCommunityPostCommentRequest = {
  content: string;
  videoUuid?: string;
  attachments?: File[];
};

export type CourseCommunityPostCommentUpdateRequest = {
  content: string;
  videoUuid?: string;
  deleteFileIds?: number[];
  attachments?: File[];
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
}