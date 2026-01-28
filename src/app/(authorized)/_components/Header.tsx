'use client';

import Notification from './Notification';

import Image from 'next/image';
import Link from 'next/link';

import { LoginRequiredLink } from '@/shared/components/LoginRequiredLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
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
import { LogIn, LogOut } from 'lucide-react';

import { NAVIGATIONS } from '@/app/_components/navigations';

import LogoImage from '@/assets/Logo.png';

export default function Header() {
  const { logout, accessToken } = useAuthStore((state) => state);

  const isGuest = !accessToken;

  const { data: profile } = useGetProfile();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex items-center gap-2">
              <Image src={LogoImage} alt="Insty" width={120} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-4">
            <LoginRequiredLink
              href="/creator-center"
              className="text-sm font-medium underline-offset-4 hover:underline"
              dialogDescription={
                <>
                  강의를 등록하고 수강생들과 소통하려면
                  <br />
                  먼저 로그인해 주세요.
                </>
              }
            >
              크리에이터 센터
            </LoginRequiredLink>

            {/* 알림 */}
            {!isGuest && <Notification />}

            {/* 프로필 메뉴 */}
            {isGuest ? (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인하기
                </Link>
              </Button>
            ) : (
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
                  {NAVIGATIONS.map((navigation) => {
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
