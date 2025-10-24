'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { useAuthStore } from '@/shared/stores/auth';
import { UserTypeEnum } from '@/shared/types/auth.enum';
import { Bell, LogOut, ShoppingCart, Video } from 'lucide-react';

import CREATOR_NAVIGATION from '@/app/_navigations/creator-navigation';
import LEARNER_NAVIGATION from '@/app/_navigations/learner-navigation';

import LogoImage from '@/assets/Logo.png';

export default function Header() {
  const router = useRouter();
  const authStore = useAuthStore((state) => state);

  const { data: profile } = useGetProfile();

  const handleLogout = () => {
    // 로그아웃 로직
    authStore.setAccessToken(null);
    authStore.setRefreshToken(null);
    router.push('/login');
  };

  const isCreator = profile?.userType === UserTypeEnum.CREATOR;
  const isLearner = profile?.userType === UserTypeEnum.LEARNER;
  const navigations = isCreator ? CREATOR_NAVIGATION : isLearner ? LEARNER_NAVIGATION : [];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-6">
            <Link href={isCreator ? '/creator' : '/learner'} className="flex items-center gap-2">
              <Image src={LogoImage} alt="Insty" width={120} height={40} className="h-8 w-auto" />
            </Link>

            {/* 카테고리 메뉴 */}
            {/* <nav className="hidden items-center gap-6 md:flex">
              {isCreator ? (
                <Link
                  href="/creator"
                  className={`hover:text-primary text-sm font-medium transition-colors ${
                    pathname === '/creator' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  크리에이터 대시보드
                </Link>
              ) : (
                <Link
                  href="/my-courses"
                  className={`hover:text-primary text-sm font-medium transition-colors ${
                    pathname === '/my-courses' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  내 강의
                </Link>
              )}
            </nav> */}
          </div>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-4">
            {isCreator && (
              <Button asChild variant="default">
                <Link href="/creator/courses/new">
                  <Video className="mr-2 h-4 w-4" />
                  강의 등록
                </Link>
              </Button>
            )}

            {/* 알림 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>알림</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="font-medium">새로운 강의가 업데이트되었습니다</p>
                    <p className="text-muted-foreground text-xs">React 완전정복 강의에 새로운 섹션이 추가되었습니다</p>
                    <span className="text-muted-foreground text-xs">2시간 전</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="font-medium">질문에 답변이 달렸습니다</p>
                    <p className="text-muted-foreground text-xs">
                      &quot;useState 사용법&quot; 질문에 강사님이 답변하셨습니다
                    </p>
                    <span className="text-muted-foreground text-xs">5시간 전</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="text-primary w-full text-center">
                    모든 알림 보기
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 장바구니 */}
            {!isCreator && (
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    2
                  </Badge>
                </Link>
              </Button>
            )}

            {/* 프로필 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
                    <AvatarFallback>{profile?.nickname?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">{profile?.nickname}</p>
                    <p className="text-muted-foreground text-xs leading-none">{profile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navigations.map((navigation) => {
                  return (
                    <DropdownMenuItem asChild key={navigation.name}>
                      <Link href={navigation.href}>
                        <navigation.icon className="mr-2 h-4 w-4" />
                        <span>{navigation.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
