'use client';

import AuthGuard from '@/shared/components/AuthGuard';
import ProfileSidebar from '@/shared/components/ProfileSidebar';

import { CREATOR_CENTER_NAVIGATION } from '@/app/_components/navigations';

export default function CreatorCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">크리에이터 센터</h1>
          <p className="text-muted-foreground mt-1">강의를 제작하고 수강생과 소통하세요</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <ProfileSidebar navigation={CREATOR_CENTER_NAVIGATION} />
          <main className="min-w-0 flex-1 rounded-lg bg-gray-50 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
