'use client';

import Withdrawal from '../../_components/Withdrawal';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { Mail, Pencil, User } from 'lucide-react';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold sm:text-lg">기본 정보</h2>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">나의 프로필 정보를 확인하고 수정하세요</p>
        </div>
        <Link href="/mypage/profile/edit" className="sm:hidden">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Pencil className="h-3.5 w-3.5" />
            수정
          </Button>
        </Link>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        {/* 닉네임 */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 sm:h-9 sm:w-9">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs sm:text-sm">닉네임</p>
            <p className="truncate text-sm font-medium sm:text-base">{profile?.nickname || '-'}</p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 sm:h-9 sm:w-9">
            <Mail className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs sm:text-sm">이메일</p>
            <p className="truncate text-sm font-medium sm:text-base">{profile?.email || '-'}</p>
          </div>
        </div>
      </div>

      {/* 소개 섹션 */}
      <Separator />

      <div>
        <h3 className="mb-3 text-base font-bold sm:text-lg">소개</h3>

        {profile?.introduce ? (
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
            {profile.introduce}
          </p>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center sm:p-5">
            <p className="text-muted-foreground text-xs sm:text-sm">아직 소개가 작성되지 않았어요</p>
            <Link href="/mypage/profile/edit">
              <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs sm:text-sm">
                소개 작성하기
              </Button>
            </Link>
          </div>
        )}
      </div>
      {/* 계정 관리 */}
      <Withdrawal />
    </div>
  );
}
