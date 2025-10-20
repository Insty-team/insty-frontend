import { SocialLoginType, UserType } from '@/shared/types/auth.enum';

export type UserRequest = {};

export type UserResponse = {
  id: number;
  email: string;
  nickname: string;
  isEmailAgreed: boolean;
  thumbnailUrl: string;
  introduce: string;
  socialType: SocialLoginType;
  userType: UserType;
  createdAt: string;
};
