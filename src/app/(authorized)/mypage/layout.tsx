'use client';

import ProfileHeader from '@/shared/components/ProfileHeader';

import { NAVIGATIONS } from '@/app/_components/navigations';

export default function CommonMyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-3 pb-4">
        {/* 프로필 헤더 (프로필 정보 + 탭 네비게이션) */}
        <ProfileHeader navigation={NAVIGATIONS} />

        {/* 메인 컨텐츠 */}
        <main className="mt-4 bg-white p-4 sm:mt-6 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
