// 영상 STT 요청
export type TranscribeVideoRequest = {
  file_url: string;
};

// 영상 STT 응답
export type TranscribeVideoResponse = {
  video_id: number;
};

// STT 상태 타입
export type TranscriptionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PENDING' | 'PROCESSING';

// STT 상태 조회 응답
export type TranscriptionStatusResponse = {
  status: TranscriptionStatus;
  progress: number;
  step: string;
  reason?: string | null;
};

// 벡터 상태 타입
export type VectorStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PENDING';

// 벡터 상태 조회 응답
export type VectorStatusResponse = {
  status: VectorStatus;
  progress: number;
  step: string;
};

// 메타데이터 제안 응답
export type MetadataSuggestionResponse = {
  title: string;
  description: string;
  price: string;
  target: string;
  tags: string[];
  installation_checklist: string[];
  core_contents: string[];
};

// 제목 제안 요청
export type TitleSuggestionRequest = {
  original_title: string;
};

// 제목 제안 응답
export type TitleSuggestionResponse = {
  title: string;
};

// 설명 제안 요청
export type DescriptionSuggestionRequest = {
  original_description: string;
};

// 설명 제안 응답
export type DescriptionSuggestionResponse = {
  description: string;
};

// 실습 가이드 제안 응답
export type PracticeGuideSuggestionResponse = {
  practice_draft: string;
};

// 영상 다중 삭제 요청
export type VideoBatchDeleteRequest = {
  video_uuids: string[];
};
