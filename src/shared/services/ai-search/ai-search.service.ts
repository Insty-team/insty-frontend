import {
  CourseRecommendationRequest,
  CourseRecommendationResponse,
  RecommendationHistoryResponse,
  ServiceRecommendationResponse,
} from './ai-search.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** AI 기반 영상 추천 내역 조회 */
export const GET_search_recommend_history = async (): Promise<ApiResponse<RecommendationHistoryResponse>> => {
  const response = await api.get('/api/v1/ai/search/recommend');
  return response.data;
};

/** AI 기반 영상 추천 수행 */
export const POST_search_recommend = async (
  data: CourseRecommendationRequest,
): Promise<ApiResponse<CourseRecommendationResponse>> => {
  const response = await api.post('/api/v1/ai/search/recommend', data);
  return response.data;
};

/** AI 서비스 추천 수행 */
export const POST_search_recommend_services = async (
  data: CourseRecommendationRequest,
): Promise<ApiResponse<ServiceRecommendationResponse>> => {
  const response = await api.post('/api/v1/ai/search/recommend-services', data);
  return response.data;
};
