'use client';

import Notification from './Notification';

import { useState } from 'react';

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
import { Separator } from '@/shared/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { useAuthStore } from '@/shared/stores/auth';
import { LogIn, LogOut, Menu, X } from 'lucide-react';

import { NAVIGATIONS } from '@/app/_components/navigations';

import LogoImage from '@/assets/Logo.png';

export default function Header() {
  const { logout, accessToken } = useAuthStore((state) => state);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGuest = !accessToken;

  const { data: profile } = useGetProfile();
  console.log('profile in header', profile);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* 로고 */}
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex items-center gap-2">
              <Image src={LogoImage} alt="Insty" width={120} height={40} className="h-6 w-auto md:h-8" />
            </Link>
          </div>

          {/* 데스크탑: 우측 액션 버튼 */}
          <div className="hidden items-center gap-4 md:flex">
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

          {/* 모바일: 햄버거 메뉴 */}
          <div className="flex items-center gap-2 md:hidden">
            {/* 알림 (로그인 시) */}
            {!isGuest && <Notification />}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Image src={LogoImage} alt="Insty" width={100} height={32} className="h-6 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-4">
                  {/* 프로필 섹션 */}
                  {!isGuest && profile && (
                    <>
                      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
                          <AvatarFallback>{profile?.nickname?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{profile?.nickname}</p>
                          <p className="text-muted-foreground text-xs">{profile?.email}</p>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* 네비게이션 메뉴 */}
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/creator-center"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
                    >
                      크리에이터 센터
                    </Link>

                    {!isGuest && (
                      <>
                        <Separator className="my-2" />
                        {NAVIGATIONS.map((navigation) => (
                          <Link
                            key={navigation.name}
                            href={navigation.href}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
                          >
                            <navigation.icon className="h-4 w-4" />
                            <span>{navigation.name}</span>
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>

                  <Separator />

                  {/* 로그인/로그아웃 버튼 */}
                  {isGuest ? (
                    <Button asChild className="w-full rounded-none">
                      <Link href="/login" onClick={closeMobileMenu}>
                        <LogIn className="mr-2 h-4 w-4" />
                        로그인하기
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={handleLogout} className="w-full rounded-none">
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
