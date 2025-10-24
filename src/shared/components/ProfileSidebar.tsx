'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
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

  if (isLoading) {
    return (
      <div className="w-70 flex-shrink-0">
        <div className="rounded-lg bg-white p-6">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200"></div>
            <div className="mb-2 h-4 rounded bg-gray-200"></div>
            <div className="mx-auto h-3 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-70 flex-shrink-0">
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
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
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
      </div>
    </div>
  );
}
