// 구매 상담 챗봇 요청
export type PurchaseAssistantRequest = {
  course_id: number;
  query: string;
};

// 구매 상담 챗봇 응답
export type PurchaseAssistantResponse = {
  recommendation: string;
  judgment: string;
  reasons: string[];
  usage_count: number;
};

// 구매 상담 챗봇 사용 횟수 정보
export type PurchaseAssistantUsageInfo = {
  usage_count: number;
  remaining: number;
};
