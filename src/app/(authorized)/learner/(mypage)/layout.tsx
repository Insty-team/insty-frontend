'use client';

import ProfileSidebar from '@/shared/components/ProfileSidebar';
import { MessageSquare, Settings, ShoppingBag, User } from 'lucide-react';

const navigation = [
  { name: '프로필 관리', href: '/learner/profile', icon: User },
  { name: '구매내역', href: '/learner/purchases', icon: ShoppingBag },
  { name: '설정', href: '/learner/settings', icon: Settings },
  { name: '강의 요청하기', href: '/learner/request', icon: MessageSquare },
];

export default function LearnerMyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 프로필 사이드바 */}
        <ProfileSidebar navigation={navigation} userType="learner" />

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
