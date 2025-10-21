import { UserType } from '@/shared/types/auth.enum';

export type MentionSearchResponse = {
  id: string;
  nickname: string;
  userType: UserType;
  profileImageUrl: string;
};
