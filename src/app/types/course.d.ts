type MyCoursesItems = {
  courseId: number;
  title: string;
  price: number;
  viewCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string | null;
  isShow: boolean;
  createdAt: string;
};

type CourseDetail = {
  courseId: number;
  title: string;
  description: string;
  targetAudience: string;
  price: number;
  installEnvChecklist: { content: string; isSupported: boolean }[];
  keyPoints: string[];
  tags: string[];
  thumbnailUrl: string | null;
  practiceFile: {
    id: number;
    name: string;
    contentType: string;
    size: number;
    url: string;
  }[];
  createdAt: string;
  videoInfo: {
    videoType: string;
    videoUuid: string;
  };
};

type CourseFormProps = {
  subject: string;
  initialData?: CourseDetail;
  onSubmit: (formData: UploadformData) => void;
  submitText?: string;
  onBack: () => void;
};

type AllowedFileType = {
  document: {
    accept: string;
    types: string[];
  };
  video: {
    accept: string;
    types: string[];
  };
};

type CourseUpdateReq = {
  title: string;
  description: string;
  targetAudience: string;
  price: number;
  installEnvChecklist: { content: string; isSupported: boolean }[];
  keyPoints: string[];
  tags: string[];
  deletePracticeField: number[];
  updateVideoUuid: string | null;
};

type UploadformData = {
  keyPoints: string[];
  isShow: boolean;
  price: number;
  installEnvChecklist: { content: string; isSupported: boolean }[];
  targetAudience: string;
  videoUuid: string | null;
  videoFile?: File | null;
  thumbnailFile?: File | null;
  practiceFiles?: File[];
  title: string;
  description: string;
  tags: string[];
};

export type {
  AllowedFileType,
  CourseDetail,
  CourseFormProps,
  CourseUpdateReq,
  MyCoursesItems,
  UploadformData,
};
