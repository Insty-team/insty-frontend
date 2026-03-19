'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { cn } from '@/shared/lib/utils';
import { useGetProfile } from '@/shared/services/user/user.hook';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProfileSidebarProps {
  navigation: NavigationItem[];
}

export default function ProfileSidebar({ navigation }: ProfileSidebarProps) {
  const pathname = usePathname();
  const { data: profile, isLoading } = useGetProfile();
  const [isOpen, setIsOpen] = useState(false);

  // 현재 활성화된 메뉴 이름 찾기
  const activeNavItem = navigation.find((item) => pathname.startsWith(item.href));

  // 로딩 스켈레톤 - 데스크톱
  const DesktopSkeleton = () => (
    <div className="hidden w-70 flex-shrink-0 lg:block">
      <div className="rounded-lg bg-white p-6">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200"></div>
          <div className="mb-2 h-4 rounded bg-gray-200"></div>
          <div className="mx-auto h-3 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );

  // 로딩 스켈레톤 - 모바일
  const MobileSkeleton = () => (
    <div className="block lg:hidden">
      <div className="rounded-lg bg-white p-4">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-3 w-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <DesktopSkeleton />
        <MobileSkeleton />
      </>
    );
  }

  // 네비게이션 메뉴 컴포넌트
  const NavigationMenu = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        console.log(pathname);
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'hover:bg-muted flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors',
              isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 모바일 프로필 바 */}
      <div className="block lg:hidden">
        <div className="rounded-lg bg-white p-4">
          <div className="flex items-center justify-between">
            {/* 프로필 정보 */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
                <AvatarFallback className="text-sm">{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{profile?.nickname}</h3>
                <p className="text-muted-foreground truncate text-xs">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* 현재 위치 표시 */}
          {activeNavItem && (
            <div className="mt-6">
              <Breadcrumb>
                <BreadcrumbList className="text-xs">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/mypage/profile">마이페이지</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeNavItem.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>
      </div>

      {/* 데스크톱 사이드바 */}
      <div className="hidden w-70 flex-shrink-0 lg:block">
        {/* 프로필 정보 박스 */}
        <div className="mb-6 rounded-lg bg-white p-6 text-center">
          <Avatar className="mx-auto mb-4 h-20 w-20">
            <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
            <AvatarFallback className="text-lg">{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <h3 className="mb-1 text-lg font-semibold">{profile?.nickname}</h3>
          <p className="text-muted-foreground mb-4 text-sm">{profile?.email}</p>

          {profile?.introduce && <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{profile.introduce}</p>}
        </div>

        {/* 네비게이션 메뉴 */}
        <div className="rounded-lg bg-white p-6">
          <NavigationMenu />
        </div>
      </div>
    </>
  );
}
