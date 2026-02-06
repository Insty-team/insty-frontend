'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { Pencil } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProfileHeaderProps {
  navigation: NavigationItem[];
}

export default function ProfileHeader({ navigation }: ProfileHeaderProps) {
  const pathname = usePathname();
  const { data: profile, isLoading } = useGetProfile();

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div className="overflow-hidden bg-white">
        {/* 배경 스켈레톤 */}
        <div className="h-20 animate-pulse bg-slate-200 sm:h-28" />

        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          {/* 프로필 정보 스켈레톤 */}
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
            <div className="-mt-10 h-16 w-16 animate-pulse rounded-full border-4 border-white bg-slate-200 sm:-mt-12 sm:h-20 sm:w-20" />
            <div className="mt-3 flex flex-1 flex-col items-center gap-3 sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-center sm:text-left">
                <div className="mx-auto h-5 w-24 animate-pulse rounded bg-slate-200 sm:mx-0" />
                <div className="mx-auto h-4 w-32 animate-pulse rounded bg-slate-200 sm:mx-0" />
              </div>
            </div>
          </div>

          {/* 탭 스켈레톤 */}
          <div className="mt-6 flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      {/* 배경 그라데이션 */}
      <div className="h-20 bg-gradient-to-r from-slate-100 to-slate-200 sm:h-28" />

      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        {/* 프로필 정보 섹션 */}
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
          {/* 아바타 */}
          <Avatar className="-mt-10 h-16 w-16 border-4 border-white shadow-md sm:-mt-12 sm:h-20 sm:w-20">
            <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
            <AvatarFallback className="bg-slate-100 text-lg font-semibold text-slate-600 sm:text-xl">
              {profile?.nickname?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 이름 & 이메일 & 수정 버튼 */}
          <div className="mt-3 flex flex-1 flex-col items-center gap-3 sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h2 className="text-base font-bold sm:text-lg">{profile?.nickname || '닉네임 없음'}</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">{profile?.email}</p>
            </div>

            <Link href="/mypage/profile/edit" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Pencil className="h-3.5 w-3.5" />
                프로필 수정
              </Button>
            </Link>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="scrollbar-hide -mx-4 mt-5 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:mt-6 sm:gap-2 sm:px-6">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900',
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
