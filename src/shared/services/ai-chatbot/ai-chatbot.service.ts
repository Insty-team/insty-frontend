import {
  ChatMessageResponse,
  ChatMessageStreamRequest,
  ChatSessionInitRequest,
  ChatSessionInitResponse,
  ChatSessionInstallRequest,
  ChatSessionInstallResponse,
  ChatSessionListResponse,
  ChatSessionMessagesResponse,
  QuestionHistoryGroupedResponse,
} from './ai-chatbot.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 사용자 세션 목록 조회 */
export const GET_chatbot_sessions = async (): Promise<ApiResponse<ChatSessionListResponse[]>> => {
  const response = await api.get('/api/v1/ai/chatbot/sessions');
  return response.data;
};

/** 채팅 세션 생성 */
export const POST_chatbot_session = async (
  data: ChatSessionInitRequest,
): Promise<ApiResponse<ChatSessionInitResponse>> => {
  const response = await api.post('/api/v1/ai/chatbot/sessions', data);
  return response.data;
};

/** 세션 메시지 목록 조회 */
export const GET_chatbot_session_messages = async (
  sessionId: number,
): Promise<ApiResponse<ChatSessionMessagesResponse>> => {
  const response = await api.get(`/api/v1/ai/chatbot/sessions/${sessionId}/messages`);
  return response.data;
};

/** 챗봇 메시지 전송 (스트리밍) */
export const POST_chatbot_message_stream = async (
  sessionId: number,
  data: ChatMessageStreamRequest,
): Promise<ApiResponse<ChatMessageResponse>> => {
  const formData = new FormData();
  formData.append('course_id', data.course_id.toString());
  formData.append('message_text', data.message_text);
  formData.append('has_attachment', (data.has_attachment ?? false).toString());

  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await api.post(`/api/v1/ai/chatbot/sessions/${sessionId}/messages/stream`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/** 세션 설치 완료 처리 */
export const PATCH_chatbot_session_install = async (
  sessionId: number,
  data: ChatSessionInstallRequest,
): Promise<ApiResponse<ChatSessionInstallResponse>> => {
  const response = await api.patch(`/api/v1/ai/chatbot/sessions/${sessionId}/mark-installed`, data);
  return response.data;
};

/** 사용자 질문 이력 조회 */
export const GET_chatbot_question_history = async (params?: {
  date?: string;
  keyword?: string;
}): Promise<ApiResponse<QuestionHistoryGroupedResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.date) {
    queryParams.append('date', params.date);
  }
  if (params?.keyword) {
    queryParams.append('keyword', params.keyword);
  }

  const queryString = queryParams.toString();
  const url = `/api/v1/ai/chatbot/question-history${queryString ? `?${queryString}` : ''}`;

  const response = await api.get(url);
  return response.data;
};
