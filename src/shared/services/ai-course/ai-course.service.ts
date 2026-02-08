import { PurchaseAssistantRequest, PurchaseAssistantResponse, PurchaseAssistantUsageInfo } from './ai-course.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 구매 상담 챗봇 - 영상 적합성 판단 및 피드백 제공 */
export const POST_course_purchase_assistant = async (
  data: PurchaseAssistantRequest,
): Promise<ApiResponse<PurchaseAssistantResponse>> => {
  const response = await api.post('/api/v1/ai/courses/purchase-assistant', data);
  return response.data;
};

/** 구매 상담 챗봇 사용 횟수 조회 */
export const GET_course_purchase_assistant_usage_info = async (
  courseId: number,
): Promise<ApiResponse<PurchaseAssistantUsageInfo>> => {
  const response = await api.get(`/api/v1/ai/courses/purchase-assistant/usage-info?course_id=${courseId}`);
  return response.data;
};
