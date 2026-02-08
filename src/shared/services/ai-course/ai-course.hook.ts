import { GET_course_purchase_assistant_usage_info, POST_course_purchase_assistant } from './ai-course.service';
import { PurchaseAssistantRequest } from './ai-course.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 구매 상담 챗봇 - 영상 적합성 판단 및 피드백 제공 */
export const usePostCoursePurchaseAssistant = () => {
  return useMutation({
    mutationKey: [POST_course_purchase_assistant.name],
    mutationFn: (data: PurchaseAssistantRequest) => POST_course_purchase_assistant(data),
  });
};

/** 구매 상담 챗봇 사용 횟수 조회 */
export const useGetCoursePurchaseAssistantUsageInfo = (courseId: number) => {
  return useQuery({
    queryKey: [GET_course_purchase_assistant_usage_info.name, courseId],
    queryFn: () => GET_course_purchase_assistant_usage_info(courseId),
    enabled: !!courseId,
    select: ({ data }) => data,
  });
};
