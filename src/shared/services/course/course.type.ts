export type VideoType = 'COURSE' | 'ANSWER' | 'QUESTION';

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

export type CourseRequest = {};

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
