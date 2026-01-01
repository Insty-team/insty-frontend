import { UserType } from '@/shared/types/auth.enum';

export type MentionSearchResponse = {
  id: number;
  nickname: string;
  userType: UserType;
  profileImageUrl: string;
};
