'use client';

import ProfileSidebar from '@/shared/components/ProfileSidebar';

import { NAVIGATIONS } from '@/app/_components/navigations';

export default function CommonMyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-4 lg:py-8">
      {/* 페이지 타이틀 - 데스크톱에서만 표시 */}
      <div className="mb-5 hidden lg:block">
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* 프로필 사이드바 */}
        <ProfileSidebar navigation={NAVIGATIONS} />

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1 rounded-sm bg-gray-400/10 px-4 py-4 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
