'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { useGetProfile, usePutProfile } from '@/shared/services/user/user.hook';

type ProfileFormData = {
  nickname: string;
  email: string;
  introduce: string;
};

export default function LearnerMyPageProfile() {
  const { data: profile, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending } = usePutProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      nickname: profile?.nickname || '',
      email: profile?.email || '',
      introduce: profile?.introduce || '',
    },
    values: profile
      ? {
          nickname: profile.nickname,
          email: profile.email,
          introduce: profile.introduce,
        }
      : undefined,
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data as any, {
      onSuccess: () => {
        setIsEditing(false);
        alert('프로필이 업데이트되었습니다!');
      },
      onError: () => {
        alert('프로필 업데이트에 실패했습니다.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">프로필 관리</h2>
        <p className="text-muted-foreground mt-1">나의 정보를 관리하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>프로필 사진</CardTitle>
          <CardDescription>프로필 이미지를 변경하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.thumbnailUrl} alt={profile?.nickname} />
              <AvatarFallback>{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                사진 변경
              </Button>
              <p className="text-muted-foreground mt-2 text-sm">JPG, PNG 파일 (최대 5MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>닉네임과 소개를 수정할 수 있습니다</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                수정
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                {...register('nickname', {
                  required: '닉네임을 입력해주세요',
                  minLength: { value: 2, message: '닉네임은 2자 이상이어야 합니다' },
                  maxLength: { value: 20, message: '닉네임은 20자 이하여야 합니다' },
                })}
                disabled={!isEditing}
              />
              {errors.nickname && <p className="text-destructive text-sm">{errors.nickname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" {...register('email')} disabled />
              <p className="text-muted-foreground text-sm">이메일은 변경할 수 없습니다</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduce">소개</Label>
              <Textarea
                id="introduce"
                {...register('introduce', {
                  maxLength: { value: 500, message: '소개는 500자 이하여야 합니다' },
                })}
                rows={4}
                placeholder="자기소개를 입력해주세요"
                disabled={!isEditing}
              />
              {errors.introduce && <p className="text-destructive text-sm">{errors.introduce.message}</p>}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? '저장 중...' : '저장'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isPending}>
                  취소
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
