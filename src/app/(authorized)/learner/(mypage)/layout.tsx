'use client';

import ProfileSidebar from '@/shared/components/ProfileSidebar';

import LEARNER_NAVIGATION from '@/app/_navigations/learner-navigation';

export default function CommonMyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 프로필 사이드바 */}
        <ProfileSidebar navigation={LEARNER_NAVIGATION} />

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
