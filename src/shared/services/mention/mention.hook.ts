import { GET_mention_search } from './mention.service';

import { useQuery } from '@tanstack/react-query';

/** 멘션 가능한 사용자 검색 */
export const useGetMentionSearch = (query: string) => {
  return useQuery({
    queryKey: [GET_mention_search.name, query],
    queryFn: () => GET_mention_search(query),
    enabled: !!query,
    select: ({ data }) => data,
  });
};
