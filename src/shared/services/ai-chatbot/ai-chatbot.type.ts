// 세션 상태 타입
export type ChatSessionStatus = 'active' | 'ended' | 'expired';

// 메시지 발신자 타입
export type MessageSender = 'user' | 'assistant' | 'system';

// 채팅 세션 목록 조회 응답
export type ChatSessionListResponse = {
  session_id: number;
  course_id: number;
  status: ChatSessionStatus;
  created_at: string;
  ended_at: string | null;
  is_installed: boolean;
};

// 채팅 세션 생성 요청
export type ChatSessionInitRequest = {
  course_id: number;
};

// 채팅 세션 생성 응답
export type ChatSessionInitResponse = {
  session_id: number;
  course_id: number;
  status: ChatSessionStatus;
  created_at: string;
  is_new: boolean;
};

// 채팅 메시지 첨부파일
export type ChatMessageAttachment = {
  file_url: string;
  file_type: string;
  file_size: number;
  file_name: string;
};

// 채팅 세션 메시지
export type ChatSessionMessage = {
  message_id: number;
  sender: MessageSender;
  content: string;
  created_at: string;
  attachments: ChatMessageAttachment[];
};

// 세션 메시지 목록 조회 응답
export type ChatSessionMessagesResponse = {
  session_id: number;
  course_id: number;
  messages: ChatSessionMessage[];
};

// 챗봇 메시지 전송 요청 (스트리밍)
export type ChatMessageStreamRequest = {
  course_id: number;
  message_text: string;
  file?: File | null;
  has_attachment?: boolean;
};

// 챗봇 메시지 전송 응답
export type ChatMessageResponse = {
  message_id: number;
  sender: MessageSender;
  content: string;
  created_at: string;
};

// 세션 설치 완료 처리 요청
export type ChatSessionInstallRequest = {
  is_installed: boolean;
};

// 세션 설치 완료 처리 응답
export type ChatSessionInstallResponse = {
  session_id: number;
  is_installed: boolean;
};

// 질문 이력 항목
export type QuestionHistoryItem = {
  session_id: number;
  course_title: string;
  message_id: number;
  question_text: string;
};

// 날짜별 질문 이력
export type QuestionHistoryByDate = {
  date: string;
  questions: QuestionHistoryItem[];
};

// 사용자 질문 이력 조회 응답
export type QuestionHistoryGroupedResponse = {
  question_history_by_date: QuestionHistoryByDate[];
};
