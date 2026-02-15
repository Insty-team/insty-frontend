'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { PROFILE_QUERY_KEY, useGetProfile, usePutProfile } from '@/shared/services/user/user.hook';
import { GET_nickname_check } from '@/shared/services/user/user.service';
import { UserRequest } from '@/shared/services/user/user.type';
import { Camera } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

type ProfileFormData = UserRequest;

export default function ProfileEditPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: profile, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending } = usePutProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    values: {
      userUpdateReq: {
        nickname: profile?.nickname || '',
        email: profile?.email || '',
        introduce: profile?.introduce || '',
        currentPassword: '',
        newPassword: '',
      },
      profileImage: null,
    },
  });

  const watchedNickname = form.watch('userUpdateReq.nickname');
  const isNicknameUnchanged = watchedNickname === profile?.nickname;

  // 닉네임 변경 시 중복확인 상태 초기화
  useEffect(() => {
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);
  }, [watchedNickname]);

  const handleNicknameCheck = async () => {
    const nickname = form.getValues('userUpdateReq.nickname');
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
      form.trigger('userUpdateReq.nickname');
      return;
    }

    setIsCheckingNickname(true);
    try {
      const result = await GET_nickname_check(nickname);
      const available = result.data.available;
      setIsNicknameAvailable(available);
      setIsNicknameChecked(true);
    } catch {
      alert('닉네임 중복 확인에 실패했습니다.');
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const canSave = isNicknameUnchanged || (isNicknameChecked && isNicknameAvailable);

  const onSubmit = (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append('userUpdateReq', new Blob([JSON.stringify(data.userUpdateReq)], { type: 'application/json' }));
    formData.append('profileImage', selectedFile || '');

    updateProfile(formData as unknown as UserRequest, {
      onSuccess: () => {
        alert('프로필이 업데이트되었습니다!');
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        router.push('/mypage/profile');
      },
      onError: () => {
        alert('프로필 업데이트에 실패했습니다.');
      },
    });
  };

  const handleCancel = () => {
    router.push('/mypage/profile');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setSelectedFile(file);
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
          <h2 className="text-lg font-bold sm:text-xl">프로필 수정</h2>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">나의 정보를 수정하세요</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 프로필 사진 섹션 */}
          <div className="flex items-center gap-5">
            <div className="group relative cursor-pointer" onClick={handleImageClick}>
              <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-sm sm:h-24 sm:w-24">
                <AvatarImage src={previewUrl || profile?.thumbnailUrl} alt={profile?.nickname} />
                <AvatarFallback className="bg-slate-50 text-xl font-semibold text-slate-500 sm:text-2xl">
                  {profile?.nickname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={handleImageClick}>
                사진 변경
              </Button>
              <p className="text-muted-foreground mt-1.5 text-xs">JPG, PNG (최대 5MB)</p>
              {selectedFile && <p className="mt-1 text-xs text-emerald-600">새로운 사진이 선택됨</p>}
            </div>
          </div>

          <Separator />

          {/* 기본 정보 섹션 */}
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="userUpdateReq.nickname"
              rules={{
                required: { value: true, message: '닉네임을 입력해주세요.' },
                minLength: { value: 2, message: '닉네임은 2자 이상이어야 합니다' },
                maxLength: { value: 20, message: '닉네임은 20자 이하여야 합니다' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input type="text" placeholder="닉네임을 입력해주세요" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleNicknameCheck}
                      disabled={
                        isCheckingNickname ||
                        isNicknameUnchanged ||
                        !field.value ||
                        field.value.length < 2
                      }
                      className="h-9 shrink-0"
                    >
                      {isCheckingNickname ? '확인 중...' : '중복확인'}
                    </Button>
                  </div>
                  {!isNicknameUnchanged && isNicknameChecked && (
                    <p
                      className={`text-xs ${isNicknameAvailable ? 'text-emerald-600' : 'text-destructive'}`}
                    >
                      {isNicknameAvailable
                        ? '사용 가능한 닉네임입니다.'
                        : '이미 사용 중인 닉네임입니다.'}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userUpdateReq.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="이메일을 입력해주세요" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userUpdateReq.introduce"
              rules={{
                maxLength: { value: 500, message: '소개는 500자 이하여야 합니다' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소개</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="자기소개를 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* 버튼 섹션 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isPending || !canSave}>
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
