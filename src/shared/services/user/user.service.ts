import { UserRequest, UserResponse } from './user.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 내 사용자 정보 수정 */
export const PUT_profile = async (data: UserRequest) => {
  const response = await api.put('/api/v1/users/profile', data);
  return response.data;
};
/** 이메일 회원 가입 */
/** 사용자 타입 변경 */
/** 내 비밀번호 수정 수정 */
/** 사용자 이메일 수신 동의 상태 값 변경 */

/** 내 사용자 정보 조회 */
export const GET_profile = async (): Promise<ApiResponse<UserResponse>> => {
  const response = await api.get('/api/v1/users/profile');
  return response.data;
};

/** 닉네임 중복 체크 */
export const GET_nickname_check = async (nickname: string): Promise<ApiResponse<boolean>> => {
  const response = await api.get(`/api/v1/users/nickname/check?nickname=${nickname}`);
  return response.data;
};

/** 이메일 중복 체크 */
export const GET_email_check = async (email: string): Promise<ApiResponse<boolean>> => {
  const response = await api.get(`/api/v1/users/email/check?email=${email}`);
  return response.data;
};

/** 탈퇴 */
export const DELETE_withdraw = async (): Promise<ApiResponse<boolean>> => {
  const response = await api.delete('/api/v1/users/withdraw');
  return response.data;
};
