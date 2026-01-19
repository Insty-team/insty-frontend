import { BarChart3, BookOpen, Bot, CreditCard, MessageSquare, Settings, User } from 'lucide-react';

export const LEARNER_NAVIGATION = [
  { name: '프로필 관리', href: '/learner/profile', icon: User },
  { name: '강의 수강내역', href: '/learner/purchases', icon: BookOpen },
  { name: 'Q&A · 커뮤니티 · 챗봇', href: '/learner/history', icon: Bot },
  { name: '설정', href: '/learner/settings', icon: Settings },
  { name: '강의 요청하기', href: '/learner/course-request', icon: MessageSquare },
];
export const CREATOR_NAVIGATION = [
  { name: '프로필 관리', href: '/creator/profile', icon: User },
  { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
  { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
  { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
  { name: '설정', href: '/creator/settings', icon: Settings },
];

export const NAVIGATIONS = [...LEARNER_NAVIGATION, ...CREATOR_NAVIGATION];
