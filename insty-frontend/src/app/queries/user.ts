import { useQuery } from "@tanstack/react-query";

import { getUserProfileInfo } from "@/app/api/backend";

// 사용자 프로필 정보
export const useGetUserProfile = () => {
	return useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileInfo,
		staleTime: 1000 * 60 * 5, // 5분간 fresh
	});
};
