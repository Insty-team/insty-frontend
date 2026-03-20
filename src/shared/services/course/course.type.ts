export type VideoType = 'COURSE' | 'ANSWER' | 'QUESTION' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';

export type CourseDetailResponse = {
  courseId: string;
  creatorInfo: {
    id: string;
    nickname: string;
  };
  title: string;
  description: string;
  targetAudience: string;
  price: number;
  createdAt: string;
  installEnvChecklist: [
    {
      content: string;
      isSupported: true;
    },
  ];
  keyPoints: string[];
  tags: string[];
  thumbnailUrl: string;
  practiceFile: [
    {
      id: string;
      name: string;
      contentType: string;
      size: number;
      url: string;
    },
  ];
  videoInfo: {
    videoType: VideoType;
    videoUuid: string;
    originFileName: string;
  };
};

export type CourseRequest = {
  keyPoints: string[];
  isShow: boolean;
  price: number;
  installEnvChecklist: {
    content: string;
    isSupported: boolean;
  }[];
  targetAudience: string;
  videoUuid: string;
  title: string;
  tags: string[];
  description: string;
  /** 사용자가 직접 업로드한 경우에만 전송. 서버 생성 썸네일을 쓰면 null */
  thumbnail?: File | null;
  /** 실습 파일(없으면 null) */
  practiceFile?: File[] | null;
};

export type CoursesResponse = {
  courseId: string;
  creatorInfo: {
    id: string;
    nickname: string;
  };
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  durationSecond: number;
};

type CourseProgressStatusType = 'IN_PROGRESS' | 'COMPLETED';
export type CourseProgressResponse = {
  userId: string;
  courseId: string;
  status: CourseProgressStatusType;
};

export type CourseMyResponse = {
  courseId: string;
  title: string;
  price: number;
  viewCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
  isShow: boolean;
  createdAt: string;
};

export type CourseCreatorResponse = {
  courseId: string;
  creatorInfo: {
    id: string;
    nickname: string;
  };
  title: string;
  description: string;
  targetAudience: string;
  price: number;
  createdAt: string;
  installEnvChecklist: {
    content: string;
    isSupported: boolean;
  }[];
  keyPoints: string[];
  tags: string[];
  thumbnailUrl: string;
  practiceFile: {
    id: string;
    name: string;
    contentType: string;
    size: number;
    url: string;
  }[];
  videoInfo: {
    videoType: VideoType;
    videoUuid: string;
    originFileName: string;
  };
};

export type CourseProgressByMeResponse = {
  courseId: string;
  title: string;
  commentCount: number;
  thumbnailUrl: string;
  createdAt: string;
};

/**
 * 강의 QA 및 커뮤니티 관련 Type
 */

export type CourseQuestionStatus = 'WAITING' | 'ANSWERED' | 'ACCEPTED';
export type UserType = 'LEARNER' | 'CREATOR';

export type CourseQuestionSearchParams = {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  keyword?: string;
  statuses?: CourseQuestionStatus[];
};

export type CourseQuestionRequest = {
  title: string;
  content: string;
  videoUuid?: string;
  attachments?: File[];
};

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

export type CourseQuestionBaseResponse = {
  questionId: number;
  courseId: string;
  user: {
    id: number;
    nickname: string;
    userType: UserType;
  };
  title: string;
  content: string;
  status: CourseQuestionStatus;
  createdAt: string;
  updatedAt: string;
};

export type CourseQuestionListItemResponse = CourseQuestionBaseResponse;

export type CourseQuestionDetailResponse = CourseQuestionBaseResponse & {
  courseName: string;
  attachments: Attachment[];
  videoInfo: VideoInfo | null;
};

export type CourseQuestionResponse = CourseQuestionDetailResponse;

export type CourseQuestionUpdateRequest = {
  title: string;
  content: string;
  videoUuid?: string | null;
  deleteFileIds?: number[];
  attachments?: File[];
};

export type MyCourseQuestionResponse = {
  questionId: number;
  user: {
    id: number;
    nickname: string;
    userType: UserType;
  };
  courseId: number;
  title: string;
  content: string;
  status: CourseQuestionStatus;
  answerCount: number;
  hasNewAnswer: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseQuestionAnswersResponse = {
  answerId: number;
  user: {
    id: number;
    nickname: string;
    userType: UserType;
  };
  content: string;
  attachments: Attachment[];
  videoInfo: VideoInfo | null;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseQuestionAnswerResponse = CourseQuestionAnswersResponse;

export type CourseQuestionAnswerRequest = {
  content: string;
  videoUuid?: string;
  attachments?: File[];
};

export type CourseQuestionAnswerUpdateRequest = {
  content: string;
  videoUuid?: string | null;
  deleteFileIds?: number[];
  attachments?: File[];
};
