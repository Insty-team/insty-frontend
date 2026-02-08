import { MentionSearchResponse } from './mention.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 멘션 가능한 사용자 검색 */
// TODO: query params 추가
export const GET_mention_search = async (query: string): Promise<ApiResponse<MentionSearchResponse>> => {
  const response = await api.get(`/api/v1/mentions/user/search `);
  return response.data;
};
