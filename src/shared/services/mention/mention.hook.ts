import { GET_mention_search } from './mention.service';

import { useQuery } from '@tanstack/react-query';

/** 멘션 가능한 사용자 검색 */
export const useGetMentionSearch = (search: string, size: number) => {
  return useQuery({
    queryKey: [GET_mention_search.name, search],
    queryFn: () => GET_mention_search(search, size),
    enabled: !!search,
    select: ({ data }) => data,
  });
};
