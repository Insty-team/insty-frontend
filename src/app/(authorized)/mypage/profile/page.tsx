'use client';

import Withdrawal from '../../_components/Withdrawal';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">프로필</h2>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">나의 프로필 정보를 확인하세요</p>
        </div>
        <Link href="/mypage/profile/edit">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
            <Pencil className="h-3.5 w-3.5" />
            수정
          </Button>
        </Link>
      </div>

      {/* 프로필 사진 섹션 */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-sm sm:h-24 sm:w-24">
          <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
          <AvatarFallback className="bg-slate-50 text-xl font-semibold text-slate-500 sm:text-2xl">
            {profile?.nickname?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold sm:text-lg">{profile?.nickname || '닉네임 없음'}</p>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">{profile?.email}</p>
        </div>
      </div>

      <Separator />

      {/* 기본 정보 섹션 */}
      <div className="space-y-5">
        <div className="grid gap-1.5">
          <p className="text-muted-foreground text-sm font-medium">닉네임</p>
          <p className="rounded-md border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm sm:text-base">
            {profile?.nickname || '-'}
          </p>
        </div>

        <div className="grid gap-1.5">
          <p className="text-muted-foreground text-sm font-medium">이메일</p>
          <p className="rounded-md border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm sm:text-base">
            {profile?.email || '-'}
          </p>
        </div>

        <div className="grid gap-1.5">
          <p className="text-muted-foreground text-sm font-medium">소개</p>
          {profile?.introduce ? (
            <p className="rounded-md border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
              {profile.introduce}
            </p>
          ) : (
            <p className="text-muted-foreground rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-3 py-4 text-center text-sm italic">
              아직 소개가 작성되지 않았어요
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* 계정 관리 */}
      <Withdrawal />
    </div>
  );
}
