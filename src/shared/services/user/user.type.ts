import { SocialLoginType } from '@/shared/types/auth.enum';

export type UserRequest = {
  userUpdateReq: {
    nickname: string;
    email: string;
    introduce: string;
    currentPassword: string;
    newPassword: string;
  };
  profileImage: File | null;
};

export type UserResponse = {
  id: number;
  email: string;
  nickname: string;
  isEmailAgreed: boolean;
  thumbnailUrl: string;
  introduce: string;
  socialType: SocialLoginType;
  createdAt: string;
};

export type EmailSignupRequest = {
  nickname: string;
  email: string;
  password: string;
};

export type EmailSignupResponse = {
  id: number;
  email: string;
  nickname: string;
};
