import { BookOpen, Bot, MessageSquare, Settings, User } from 'lucide-react';

export const LEARNER_NAVIGATION = [
  { name: '프로필 관리', href: '/learner/profile', icon: User },
  { name: '강의 구매내역', href: '/learner/purchases', icon: BookOpen },
  { name: 'AI 챗봇 질문 이력', href: '/learner/chat-history', icon: Bot },
  { name: '설정', href: '/learner/settings', icon: Settings },
  { name: '강의 요청하기', href: '/learner/request', icon: MessageSquare },
];

export default LEARNER_NAVIGATION;
