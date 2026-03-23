// 강의 요청 폼 필드 타입
export type CourseFormFieldType = 'radio' | 'checkbox' | 'input_text' | 'text_area';

// 폼 옵션
export type CourseFormOption = {
  id: number;
  label: string;
  order_no: number;
};

// 폼 필드
export type CourseFormField = {
  id: number;
  field_key: string;
  label: string;
  type: CourseFormFieldType;
  is_required: boolean;
  order_no: number;
  options: CourseFormOption[];
};

// 강의 요청 폼 조회 응답
export type CourseFormResponse = {
  form: CourseFormField[];
};

// 크리에이터 추천 폼 옵션
export type CreatorRecommendationFormOption = {
  id: number;
  label: string;
  order_no: number;
};

// 크리에이터 추천 폼 필드
export type CreatorRecommendationFormField = {
  id: number;
  field_key: string;
  label: string;
  type: CourseFormFieldType;
  is_required: boolean;
  order_no: number;
  options: CreatorRecommendationFormOption[];
};

// 크리에이터 추천 폼 조회 응답
export type CreatorRecommendationFormResponse = {
  form: CreatorRecommendationFormField[];
};

// 강의 요청 답변
export type CourseRequestAnswer = {
  field_id: number;
  answer_text?: string | null;
  answer_option_ids?: number[] | null;
};

// 강의 요청 생성 요청
export type CourseRequest = {
  title: string;
  description: string;
  answers: CourseRequestAnswer[];
};

// 강의 요청 응답
export type CourseResponse = {
  request_id: number;
  title: string;
  description: string;
  requests_status: string;
  action_status: string | null;
  action_at: string | null;
  created_course_id: number | null;
  created_at: string;
};

// 선택된 필드 항목
export type SelectedFieldItem = {
  field_key: string;
  answer_text: string;
};

// 강의 요청 추천 항목
export type CourseRequestRecommendationItem = {
  request_id: number;
  title: string;
  description: string;
  selected_fields: SelectedFieldItem[];
  reason: string;
};

// 강의 요청 추천 응답
export type CourseRequestRecommendationResponse = {
  recommendations: CourseRequestRecommendationItem[];
};

// 강의 요청 상태 업데이트 요청
export type CourseRequestStatusUpdateRequest = {
  action_status: 'ACCEPTED' | 'DECLINED' | 'IGNORED' | 'COMPLETED';
};

// 강의 요청 상태 업데이트 응답
export type CourseRequestStatusUpdateResponse = {
  request_id: number;
  action_status: string;
  action_at: string;
};

// 강의 요청 업로드 가능 여부 응답
export type CourseRequestAvailabilityResponse = {
  available: boolean;
  status: 'IGNORED' | 'DECLINED' | 'ACCEPTED' | 'ACCEPTED_BY_ME' | 'COMPLETED' | 'NOT_RECOMMENDED' | 'UNKNOWN';
};

// 크리에이터 관심 답변
export type CreatorInterestAnswer = {
  field_id: number;
  answer_text?: string | null;
  answer_option_ids?: number[] | null;
};

// 크리에이터 관심 폼
export type CreatorInterestForm = {
  answers: CreatorInterestAnswer[];
};

// 크리에이터 최근 추천 폼 작성 이력 조회 응답
export type FormCheckResponse = {
  exists: boolean;
  form: CreatorInterestForm | null;
};

// 강의 요청 제안 요청
export type CourseRequestSuggestion = {
  os_env: string;
  difficulty: string[];
  software_name: string;
  extra_question?: string | null;
  request_text: string;
};

// 강의 요청 제안 응답
export type CourseResponseSuggestion = {
  title: string;
  description: string;
};

// 질문 초안 생성 요청
export type QuestionDraftRequest = {
  course_id: number;
  query: string;
  has_attachment?: boolean;
  files?: File[];
};

// 질문 초안 생성 응답
export type QuestionDraftResponse = {
  question_title: string;
  question_content: string;
  has_attachment: boolean;
};

// 답변 초안 생성 요청
export type AnswerDraftRequest = {
  course_id: number;
  query: string;
  has_attachment?: boolean;
  files?: File[];
};

// 답변 초안 생성 응답
export type AnswerDraftResponse = {
  answer_content: string;
  has_attachment: boolean;
};
