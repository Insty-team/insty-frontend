'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAuthStore } from '@/shared/stores/auth';
import { LogIn, Sparkles } from 'lucide-react';

interface LoginRequiredLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** 로그인 다이얼로그 제목 */
  dialogTitle?: string;
  /** 로그인 다이얼로그 설명 */
  dialogDescription?: React.ReactNode;
  /** 로그인 다이얼로그 부가 설명 */
  dialogSubDescription?: React.ReactNode;
}

export function LoginRequiredLink({
  href,
  children,
  className,
  dialogTitle = '잠깐, 로그인이 필요해요!',
  dialogDescription = (
    <>
      이 기능을 이용하려면
      <br />
      먼저 로그인해 주세요.
    </>
  ),
  dialogSubDescription = (
    <>
      <span className="text-foreground font-medium">Insty</span>에서 나만의 강의를 만들고, 전 세계 학습자들과 지식을
      나눠보세요.
    </>
  ),
}: LoginRequiredLinkProps) {
  const { accessToken } = useAuthStore((state) => state);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isGuest = !accessToken;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isGuest) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <Sparkles className="text-primary h-7 w-7" />
            </div>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            <DialogDescription className="pt-2 text-base">{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 mt-2 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">{dialogSubDescription}</p>
          </div>
          <DialogFooter className="mt-4 flex-col gap-3 sm:flex-col">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                로그인하기
              </Link>
            </Button>
            <div className="text-muted-foreground text-center text-sm">
              아직 계정이 없으신가요?{' '}
              <Link href="/signup" className="text-primary font-medium underline-offset-4 hover:underline">
                회원가입
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
