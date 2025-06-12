import { useQuery } from "@tanstack/react-query";

import { getUserProfileInfo } from "@/app/api/backend";

// 사용자 프로필 정보
export const useGetUserProfileInfoQuery = () => {
	return useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileInfo,
	});
};
