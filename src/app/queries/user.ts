import { useQuery, useMutation } from "@tanstack/react-query";

import { getUserProfileInfo, patchUserEmailAgree, patchUserType, putUserProfileInfoEdit } from "@/app/api/backend";
import { UserProfileInfoResponse, UserType } from "@/app/types";
import { useAgreeEmail } from "@/app/utils";

import { queryClient } from "./queryClient";
import { useUserStore } from "../stores";

// 사용자 프로필 정보
export const useGetUserProfileInfoQuery = () => {
	return useQuery({
		queryKey: ["userProfile"],
		queryFn: () => getUserProfileInfo(),
	});
};

// 사용자 프로필 정보 수정
export const useEditUserProfileInfoMutation = () => {
	return useMutation<UserProfileInfoResponse, Error, FormData>({
		mutationKey: ["userProfile"],
		mutationFn: (data: FormData) => putUserProfileInfoEdit(data),
	});
}

// 사용자 이메일 수신 동의
export const usePatchUserEmailAgreeMutation = () => {
	const [_, setIsAgreeEmail] = useAgreeEmail();

	return useMutation<UserProfileInfoResponse, Error, boolean>({
		mutationKey: ["userProfile"],
		mutationFn: (isEmailAgree: boolean) => patchUserEmailAgree(isEmailAgree),
		onSuccess: (res) => {
			setIsAgreeEmail(res.isEmailAgreed)
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
		}
	})
}

// 사용자 타입 변경
export const usePatchUserTypeMutation = () => {
	return useMutation<UserProfileInfoResponse, Error, UserType>({
		mutationKey: ["userProfile"],
		mutationFn: (userType) => patchUserType(userType),
	})
}