import { DELETE_withdraw, GET_email_check, GET_nickname_check, GET_profile, PUT_profile } from './user.service';
import { UserRequest } from './user.type';

import { useAuthStore } from '@/shared/stores/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

/** 내 사용자 정보 수정 */
export const usePutProfile = () => {
  return useMutation({
    mutationKey: [PUT_profile.name],
    mutationFn: (data: UserRequest) => PUT_profile(data),
  });
};

/** 이메일 회원 가입 */
/** 사용자 타입 변경 */
/** 내 비밀번호 수정 수정 */
/** 사용자 이메일 수신 동의 상태 값 변경 */

/** 내 사용자 정보 조회 */
export const useGetProfile = () => {
  const { accessToken } = useAuthStore((state) => state);
  return useQuery({
    queryKey: [GET_profile.name],
    queryFn: () => GET_profile(),
    select: ({ data }) => data,
    enabled: !!accessToken,
  });
};

/** 닉네임 중복 체크 */
export const useGetNicknameCheck = (nickname: string) => {
  return useQuery({
    queryKey: [GET_nickname_check.name, nickname],
    queryFn: () => GET_nickname_check(nickname),
    enabled: !!nickname,
    select: ({ data }) => data,
  });
};

/** 이메일 중복 체크 */
export const useGetEmailCheck = (email: string) => {
  return useQuery({
    queryKey: [GET_email_check.name, email],
    queryFn: () => GET_email_check(email),
    enabled: !!email,
    select: ({ data }) => data,
  });
};

/** 탈퇴 */
export const useDeleteWithdraw = () => {
  return useMutation({
    mutationKey: [DELETE_withdraw.name],
    mutationFn: () => DELETE_withdraw(),
  });
};
