import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyCourseRequests, postCourseRequests } from "../api/ai";
import type { SubmitCourseRequestData } from "../types/community";

const useGetMyCourseRequestsQuery = () => {
	return useQuery({
		queryKey: ["myCourseRequests"],
		queryFn: getMyCourseRequests,
	});
};

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

export { useGetMyCourseRequestsQuery, usePostCourseRequestMutation };
