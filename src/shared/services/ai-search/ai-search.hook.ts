import { GET_search_recommend_history, POST_search_recommend, POST_search_recommend_services } from './ai-search.service';
import { CourseRecommendationRequest } from './ai-search.type';

import { useAuthStore } from '@/shared/stores/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

/** AI 기반 영상 추천 내역 조회 */
export const useGetSearchRecommendHistory = () => {
  const { accessToken } = useAuthStore((state) => state);
  return useQuery({
    queryKey: [GET_search_recommend_history.name],
    queryFn: () => GET_search_recommend_history(),
    select: ({ data }) => data,
    enabled: !!accessToken,
  });
};

/** AI 기반 영상 추천 수행 */
export const usePostSearchRecommend = () => {
  return useMutation({
    mutationKey: [POST_search_recommend.name],
    mutationFn: (data: CourseRecommendationRequest) => POST_search_recommend(data),
  });
};

/** AI 서비스 추천 수행 */
export const usePostSearchRecommendServices = () => {
  return useMutation({
    mutationKey: [POST_search_recommend_services.name],
    mutationFn: (data: CourseRecommendationRequest) => POST_search_recommend_services(data),
  });
};
