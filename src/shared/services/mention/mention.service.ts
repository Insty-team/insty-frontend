import { MentionSearchResponse } from './mention.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 멘션 가능한 사용자 검색 */
export const GET_mention_search = async (
  search: string,
  size: number,
): Promise<ApiResponse<MentionSearchResponse[]>> => {
  const response = await api.get(`/api/v1/mentions/user/search `, {
    params: {
      search,
      size,
    },
  });
  return response.data;
};
