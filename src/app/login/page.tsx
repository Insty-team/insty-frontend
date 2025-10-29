'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/components/ui/input-group';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { emailReg, passwordReg } from '@/shared/lib/regex';
import { cn } from '@/shared/lib/utils';
import { usePostLogin } from '@/shared/services/auth/auth.hook';
import { LoginRequest } from '@/shared/services/auth/auth.type';
import { useAuthStore, useUserStore } from '@/shared/stores/auth';
import { SocialLoginType, UserType, UserTypeEnum } from '@/shared/types/auth.enum';
import { Eye, EyeOff } from 'lucide-react';

import googleSvg from '@/assets/google.svg';
import kakaoSvg from '@/assets/kakao.svg';
import instyPng from '@/assets/Logo.png';
import naverSvg from '@/assets/naver.svg';

export default function Login() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('userType') as UserTypeEnum;
  const router = useRouter();
  const isLoadingRef = useRef<boolean>(false);
  const { mutateAsync: postLogin } = usePostLogin();
  const [showPassword, setShowPassword] = useState(false);

  const userTypeText =
    userType === UserTypeEnum.CREATOR
      ? '크리에이터'
      : userType === UserTypeEnum.LEARNER
        ? '러너'
        : '잘못된 접근입니다.';

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      userType: userType as UserTypeEnum,
    },
  });

  const authStore = useAuthStore((state) => state);
  const userStore = useUserStore((state) => state);
  const onSubmit = async (data: LoginRequest) => {
    if (process.env.NEXT_PUBLIC_IS_LOCAL === 'true') {
      if (userType === UserTypeEnum.CREATOR) {
        data.email = 'front@example.com';
        data.password = 'asdf1234!';
      } else if (userType === UserTypeEnum.LEARNER) {
        data.email = 'frontLearn@example.com';
        data.password = 'asdf1234!';
      } else {
        throw new Error('잘못된 접근입니다.');
      }
    }

    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    await postLogin(data)
      .then((response) => {
        console.log('login response', response);

        authStore.setAccessToken(response.data.token.accessToken);
        authStore.setRefreshToken(response.data.token.refreshToken);

        userStore.setNickname(response.data.nickname);
        userStore.setUserType(response.data.userType as UserType);

        if (response.data.userType === UserTypeEnum.CREATOR) {
          router.push('/creator');
        } else if (response.data.userType === UserTypeEnum.LEARNER) {
          router.push('/learner');
        } else {
          throw new Error('잘못된 접근입니다.');
        }
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  };
  const handleSocialLogin = (type: SocialLoginType) => {};
  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className={cn('flex w-[420px] flex-col justify-center gap-6 rounded-2xl px-12 py-10 shadow-lg')}>
        <div className="flex w-full flex-col justify-center">
          <div className="flex flex-col items-center gap-5">
            <Image src={instyPng} alt="logo" width={120} priority />
            <p className="text-green text-xl font-semibold">{userTypeText} 로그인</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center space-y-3">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: '이메일을 입력해주세요.',
                  },
                  pattern: {
                    value: emailReg,
                    message: '이메일 형식이 잘못되었습니다.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="이메일을 입력해주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: {
                    value: true,
                    message: '비밀번호를 입력해주세요.',
                  },
                  pattern: {
                    value: passwordReg,
                    message: '영문/숫자/특수문자를 포함한 8~20자 이내로 입력해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="비밀번호를 입력해주세요."
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton onClick={() => setShowPassword(!showPassword)} size="icon-sm">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="cursor-pointer text-sm text-gray-700 select-none">
                <Checkbox />
                아이디 저장
              </Label>
            </div>
            <Button variant="default" size="lg" className="mt-4" type="submit">
              로그인
            </Button>
          </form>
        </Form>

        <div className="mt-2 flex flex-col items-center gap-3">
          <div className="text-xs font-medium text-gray-800">소셜 로그인으로 간편하게 시작하기</div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={(e) => {
                handleSocialLogin('KAKAO');
              }}
              className="cursor-pointer"
            >
              <Image src={kakaoSvg} alt="kakao" className="rounded-2xl" width={36} height={36} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleSocialLogin('GOOGLE');
              }}
            >
              <Image src={googleSvg} alt="google" className="cursor-pointer rounded-2xl" width={36} height={36} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleSocialLogin('NAVER');
              }}
            >
              <Image src={naverSvg} alt="naver" className="cursor-pointer rounded-2xl" width={36} height={36} />
            </button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-2">
            <span className="cursor-pointer text-sm text-gray-600 hover:underline">아이디 찾기</span>
            <Separator orientation="vertical" className="!h-[12px]" />
            <span className="cursor-pointer text-sm text-gray-600 hover:underline">비밀번호 찾기</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="text-sm text-gray-600">계정이 없으신가요?</div>
            <Link
              href="/signup"
              className="text-primary-green-600 hover:text-primary-green-700 text-sm font-medium underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
