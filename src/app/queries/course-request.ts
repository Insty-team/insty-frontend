import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	getMyCourseRequests,
	postCourseRequests,
	postCourseRequestWithBase,
} from "../api/ai";
import type { SubmitCourseRequestData } from "../types/community";

// 내가 남긴 강의 요청 목록 조회
const useGetMyCourseRequestsQuery = () => {
	return useQuery({
		queryKey: ["myCourseRequests"],
		queryFn: getMyCourseRequests,
	});
};

// 강의 요청 생성
const usePostCourseRequestMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: SubmitCourseRequestData) => postCourseRequests(data),
		onSuccess: () => {
			// POST 성공 후 강의 요청 목록 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ["myCourseRequests"] });
		},
	});
};

// 크리에이터 대시보드에서 보는 "러너 요청 추천 리스트" (with-base 기준)
// - 실제 API 호출은 postCourseRequestWithBase
// - 결과는 캐시에 저장해두고, 필요할 때 refetch로 갱신해서 사용
const useCourseRequestRecommendationsWithBaseQuery = () => {
	return useQuery({
		queryKey: ["courseRequestRecommendationsWithBase"],
		queryFn: async () => {
			const res = await postCourseRequestWithBase();

			// API 스펙에 맞게 안전하게 파싱
			if (res?.success && res.data?.recommendations) {
				return res.data.recommendations;
			}

			return [];
		},
		staleTime: 1000 * 60 * 3, // 3분 동안은 신선한 데이터로 간주
		enabled: false, // 컴포넌트에서 refetch로만 트리거
	});
};

export {
	useCourseRequestRecommendationsWithBaseQuery,
	useGetMyCourseRequestsQuery,
	usePostCourseRequestMutation,
};
