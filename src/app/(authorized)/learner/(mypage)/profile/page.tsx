'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetProfile } from '@/shared/services/user/user.hook';

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
          <h2 className="text-2xl font-bold">프로필</h2>
          <p className="text-muted-foreground mt-1">나의 프로필 정보를 확인하세요</p>
        </div>
        <Link href="/learner/profile/edit">
          <Button variant="outline">수정하기</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 프로필 사진 섹션 */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-sm font-medium">프로필 사진</Label>
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
                <AvatarFallback className="text-2xl">{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            {/* 기본 정보 섹션 */}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-sm font-medium">닉네임</Label>
              <p className="text-lg font-medium">{profile?.nickname || '닉네임이 없습니다'}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-sm font-medium">이메일</Label>
              <p className="text-lg">{profile?.email || '이메일이 없습니다'}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-sm font-medium">소개</Label>
              <p className="text-lg leading-relaxed">{profile?.introduce || '소개가 없습니다'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
