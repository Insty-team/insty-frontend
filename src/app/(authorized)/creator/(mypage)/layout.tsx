'use client';

import ProfileSidebar from '@/shared/components/ProfileSidebar';
import { BarChart3, BookOpen, CreditCard, User } from 'lucide-react';

const navigation = [
  { name: '프로필 관리', href: '/creator/profile', icon: User },
  { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
  { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
  { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
];

export default function CreatorMyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">크리에이터 센터</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 프로필 사이드바 */}
        <ProfileSidebar navigation={navigation} userType="creator" />

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
