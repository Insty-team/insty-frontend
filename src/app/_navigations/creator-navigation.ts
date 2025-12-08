import { BarChart3, BookOpen, CreditCard, Settings, User } from 'lucide-react';

export const CREATOR_NAVIGATION = [
  { name: '프로필 관리', href: '/creator/profile', icon: User },
  { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
  { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
  { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
  { name: '설정', href: '/creator/settings', icon: Settings },
];

export default CREATOR_NAVIGATION;
