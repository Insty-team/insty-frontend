// 추천된 강의 정보
export type RecommendedCourse = {
  course_id: string;
  course_title: string;
  thumbnail_url: string | null;
};

// 사용자 메시지 항목
export type UserMessageItem = {
  message_id: number;
  sender: 'user';
  content: string;
  created_at: string;
};

// 어시스턴트 메시지 항목
export type AssistantMessageItem = {
  message_id: number;
  sender: 'assistant';
  content: string;
  created_at: string;
  courses: RecommendedCourse[] | null;
};

// AI 기반 영상 추천 내역 조회 응답
export type RecommendationHistoryResponse = {
  messages: (UserMessageItem | AssistantMessageItem)[];
};

// AI 기반 영상 추천 요청
export type CourseRecommendationRequest = {
  query: string;
};

// AI 기반 영상 추천 응답
export type CourseRecommendationResponse = {
  message: string;
  courses: RecommendedCourse[];
};

// 추천된 외부 AI 서비스 정보
export type RecommendedService = {
  title: string;
  url: string;
  description: string;
  type: string;
  courses: RecommendedCourse[];
};

// AI 서비스 추천 응답
export type ServiceRecommendationResponse = {
  message: string;
  services: RecommendedService[];
};
