'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

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
  thumbnail?: File;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending } = usePutProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const updateData = {
      nickname: data.nickname,
      introduce: data.introduce,
      thumbnail: selectedFile || undefined,
    };

    updateProfile(updateData, {
      onSuccess: () => {
        alert('프로필이 업데이트되었습니다!');
        router.push('/learner/profile'); // 프로필 보기 페이지로 이동
      },
      onError: () => {
        alert('프로필 업데이트에 실패했습니다.');
      },
    });
  };

  const handleCancel = () => {
    router.push('/learner/profile'); // 프로필 보기 페이지로 이동
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setSelectedFile(file);

      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">프로필 수정</h2>
          <p className="text-muted-foreground mt-1">나의 정보를 수정하세요</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 프로필 사진 섹션 */}
            <div className="flex items-center gap-6">
              <div className="relative space-y-1">
                <Label>프로필 사진</Label>
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleImageClick}>
                  <AvatarImage src={previewUrl || profile?.thumbnailUrl} alt={profile?.nickname} />
                  <AvatarFallback className="text-2xl">{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity hover:opacity-100">
                  <span className="text-sm font-medium text-white">변경</span>
                </div>
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <Button variant="outline" size="sm" onClick={handleImageClick}>
                  사진 변경
                </Button>
                <p className="text-muted-foreground mt-2 text-sm">JPG, PNG 파일 (최대 5MB)</p>
                {selectedFile && <p className="mt-1 text-sm text-green-600">새로운 사진이 선택되었습니다</p>}
              </div>
            </div>

            {/* 기본 정보 섹션 */}
            <div className="space-y-1">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                {...register('nickname', {
                  required: '닉네임을 입력해주세요',
                  minLength: { value: 2, message: '닉네임은 2자 이상이어야 합니다' },
                  maxLength: { value: 20, message: '닉네임은 20자 이하여야 합니다' },
                })}
              />
              {errors.nickname && <p className="text-destructive text-sm">{errors.nickname.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" {...register('email')} disabled />
              <p className="text-muted-foreground text-sm">이메일은 변경할 수 없습니다</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="introduce">소개</Label>
              <Textarea
                id="introduce"
                {...register('introduce', {
                  maxLength: { value: 500, message: '소개는 500자 이하여야 합니다' },
                })}
                rows={4}
                placeholder="자기소개를 입력해주세요"
              />
              {errors.introduce && <p className="text-destructive text-sm">{errors.introduce.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
