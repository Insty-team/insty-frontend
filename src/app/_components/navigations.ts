import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CreditCard,
  FileQuestion,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
} from 'lucide-react';

export const LEARNER_NAVIGATION = [
  { name: '프로필 관리', href: '/mypage/profile', icon: User },
  { name: '강의 수강내역', href: '/mypage/purchases', icon: BookOpen },
  { name: '커뮤니티', href: '/learner/community', icon: MessageSquare },
  { name: '히스토리', href: '/learner/history', icon: Bot },  { name: '알림 설정', href: '/mypage/settings', icon: Settings },
  { name: '강의 요청하기', href: '/mypage/course-request', icon: MessageSquare },
];

/** 크리에이터 센터 전용 네비게이션 (강의 제작자용) - 더 구체적 경로를 먼저 배치 */
export const CREATOR_CENTER_NAVIGATION = [
  { name: '대시보드', href: '/creator-center', icon: BarChart3 },
  // { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
  // { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
  { name: '강의 등록하기', href: '/creator/courses/new', icon: PlusCircle },
  { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
  { name: 'Q&A · 커뮤니티 · 챗봇 답변', href: '/creator-center/qa', icon: FileQuestion },
  { name: '요청된 강의 확인', href: '/creator-center/course-requests', icon: MessageSquare },
  { name: '알림 설정', href: '/creator/settings', icon: Bell },
];

export const NAVIGATIONS = [...LEARNER_NAVIGATION];
