import { useQuery, useMutation, MutationFunction } from "@tanstack/react-query";

import { getUserProfileInfo, putUserProfileInfoEdit } from "@/app/api/backend";
import { UserProfileInfoResponse } from "@/app/types";

// 사용자 프로필 정보
export const useGetUserProfileInfoQuery = () => {
	return useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileInfo,
	});
};

// 사용자 프로필 정보 수정
export const useEditUserProfileInfoMutation = () => {
	return useMutation<UserProfileInfoResponse, Error, FormData>({
		mutationKey: ["userProfile"],
		mutationFn: (data: FormData) => putUserProfileInfoEdit(data),
		onSuccess: () => console.log("성공?"),
	});
}
