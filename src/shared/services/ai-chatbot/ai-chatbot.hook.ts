import {
  GET_chatbot_question_history,
  GET_chatbot_session_messages,
  GET_chatbot_sessions,
  PATCH_chatbot_session_install,
  POST_chatbot_message_stream,
  POST_chatbot_session,
} from './ai-chatbot.service';
import { ChatMessageStreamRequest, ChatSessionInitRequest, ChatSessionInstallRequest } from './ai-chatbot.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 사용자 세션 목록 조회 */
export const useGetChatbotSessions = () => {
  return useQuery({
    queryKey: [GET_chatbot_sessions.name],
    queryFn: () => GET_chatbot_sessions(),
    select: ({ data }) => data,
  });
};

/** 채팅 세션 생성 */
export const usePostChatbotSession = () => {
  return useMutation({
    mutationKey: [POST_chatbot_session.name],
    mutationFn: (data: ChatSessionInitRequest) => POST_chatbot_session(data),
  });
};

/** 세션 메시지 목록 조회 */
export const useGetChatbotSessionMessages = (sessionId: number) => {
  return useQuery({
    queryKey: [GET_chatbot_session_messages.name, sessionId],
    queryFn: () => GET_chatbot_session_messages(sessionId),
    enabled: !!sessionId,
    select: ({ data }) => data,
  });
};

/** 챗봇 메시지 전송 (스트리밍) */
export const usePostChatbotMessageStream = (sessionId: number) => {
  return useMutation({
    mutationKey: [POST_chatbot_message_stream.name, sessionId],
    mutationFn: (data: ChatMessageStreamRequest) => POST_chatbot_message_stream(sessionId, data),
  });
};

/** 세션 설치 완료 처리 */
export const usePatchChatbotSessionInstall = (sessionId: number) => {
  return useMutation({
    mutationKey: [PATCH_chatbot_session_install.name, sessionId],
    mutationFn: (data: ChatSessionInstallRequest) => PATCH_chatbot_session_install(sessionId, data),
  });
};

/** 사용자 질문 이력 조회 */
export const useGetChatbotQuestionHistory = (params?: { date?: string; keyword?: string }) => {
  return useQuery({
    queryKey: [GET_chatbot_question_history.name, params],
    queryFn: () => GET_chatbot_question_history(params),
    select: ({ data }) => data,
  });
};
