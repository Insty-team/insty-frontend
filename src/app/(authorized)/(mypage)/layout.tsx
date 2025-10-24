'use client';

import { usePathname } from 'next/navigation';

import ProfileSidebar from '@/shared/components/ProfileSidebar';
import { BarChart3, BookOpen, CreditCard, MessageSquare, Settings, ShoppingBag, User } from 'lucide-react';

// 사용자 타입에 따른 네비게이션 설정
const getNavigationByUserType = (userType: 'creator' | 'learner') => {
  if (userType === 'creator') {
    return [
      { name: '프로필 관리', href: '/creator/profile', icon: User },
      { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
      { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
      { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
    ];
  } else {
    return [
      { name: '프로필 관리', href: '/learner/profile', icon: User },
      { name: '구매내역', href: '/learner/purchases', icon: ShoppingBag },
      { name: '설정', href: '/learner/settings', icon: Settings },
      { name: '강의 요청하기', href: '/learner/request', icon: MessageSquare },
    ];
  }
};

export default function CommonMyPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // URL 경로에서 사용자 타입 추출
  const userType = pathname.startsWith('/creator') ? 'creator' : 'learner';
  const navigation = getNavigationByUserType(userType);

  const pageTitle = userType === 'creator' ? '크리에이터 센터' : '마이페이지';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 프로필 사이드바 */}
        <ProfileSidebar navigation={navigation} userType={userType} />

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
