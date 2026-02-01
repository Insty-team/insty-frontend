'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
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
import { usePostLogin, useSocialLogin } from '@/shared/services/auth/auth.hook';
import { LoginRequest } from '@/shared/services/auth/auth.type';
import { useAuthStore, useUserStore } from '@/shared/stores/auth';
import { SocialLoginType } from '@/shared/types/auth.enum';
import { BookOpen, Eye, EyeOff, Play, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import googleSvg from '@/assets/google.svg';
import kakaoSvg from '@/assets/kakao.svg';
import instyPng from '@/assets/Logo.png';
import naverSvg from '@/assets/naver.svg';

export default function Login() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <section className="flex min-h-screen">
      <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-12 lg:flex" />
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8">
        <div className="flex w-full max-w-[420px] flex-col justify-center gap-6 rounded-2xl bg-white px-10 py-10 shadow-lg">
          <div className="flex animate-pulse flex-col items-center gap-4">
            <div className="h-10 w-24 rounded bg-gray-200" />
            <div className="h-6 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/home';
  const errorParam = searchParams.get('error');
  const isLoadingRef = useRef<boolean>(false);
  const { mutateAsync: postLogin } = usePostLogin();
  const [showPassword, setShowPassword] = useState(false);

  // URL에 에러 파라미터가 있는 경우 토스트 표시
  useEffect(() => {
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        invalid_callback: '잘못된 로그인 콜백입니다. 다시 시도해주세요.',
        login_failed: '소셜 로그인에 실패했습니다. 다시 시도해주세요.',
        access_denied: '로그인이 취소되었습니다.',
      };
      toast.error(errorMessages[errorParam] || '로그인 중 오류가 발생했습니다.');

      // URL에서 에러 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [errorParam, router]);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const authStore = useAuthStore((state) => state);
  const userStore = useUserStore((state) => state);

  // 소셜 로그인 훅 (책임분리: 비즈니스 로직은 훅에서 처리)
  const { startLogin: startSocialLogin, isLoading: isSocialLoading, isError: isSocialError } = useSocialLogin();

  const onSubmit = async (data: LoginRequest) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    await postLogin(data)
      .then((response) => {
        console.log('onSubmit success', response);
        authStore.setAccessToken(response.data.token.accessToken);
        authStore.setRefreshToken(response.data.token.refreshToken);

        userStore.setNickname(response.data.nickname);
        router.push(redirectTo);
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  };

  /**
   * 소셜 로그인 핸들러
   * - UI 이벤트만 처리하고, 비즈니스 로직은 useSocialLogin 훅에 위임
   * - redirectTo를 state에 포함하여 로그인 후 원래 페이지로 이동
   */
  const handleSocialLogin = (type: SocialLoginType) => {
    if (isSocialLoading) {
      toast.info('로그인 처리 중입니다. 잠시만 기다려주세요.');
      return;
    }
    startSocialLogin(type, redirectTo);
  };

  return (
    <section className="flex min-h-screen">
      {/* 왼쪽: 서비스 소개 영역 */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-12 lg:flex">
        <div className="flex max-w-md flex-col items-center gap-10 text-center text-white">
          <Image src={instyPng} alt="logo" className="w-[180px] brightness-0 invert" priority />
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">설치 가이드 플랫폼</h1>
            <p className="text-lg text-emerald-100">인스티와 함께 시작하세요!</p>
          </div>

          <div className="mt-4 space-y-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">영상으로 쉽게 배우기</h3>
                <p className="text-sm text-emerald-100">전문가의 설치 가이드 영상을 보고 따라하세요</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">문서로 꼼꼼히 확인</h3>
                <p className="text-sm text-emerald-100">단계별 문서 가이드로 놓친 부분을 체크하세요</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">나만의 가이드 제작</h3>
                <p className="text-sm text-emerald-100">설치 가이드를 만들어 공유하고 수익을 창출하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 로그인 폼 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8">
        <div className="flex w-full max-w-[420px] flex-col justify-center gap-6 rounded-2xl bg-white px-10 py-10 shadow-lg">
          <div className="flex w-full flex-col justify-center">
            <div className="flex flex-col items-center gap-4">
              <Image src={instyPng} alt="logo" width={100} priority className="lg:hidden" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
                <p className="mt-1 text-sm text-gray-500">계정에 로그인하여 시작하세요</p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center space-y-3">
              <div className="space-y-5">
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
              <div className="flex items-center justify-between space-x-2">
                <Label className="cursor-pointer text-sm text-gray-700 select-none">
                  <Checkbox />
                  아이디 저장
                </Label>
                <span className="cursor-pointer text-sm text-gray-600 hover:underline">비밀번호 찾기</span>
              </div>
              <Button variant="default" size="lg" className="mt-4 bg-emerald-500 hover:bg-emerald-600" type="submit">
                로그인
              </Button>
            </form>
          </Form>

          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="text-xs font-medium text-gray-500">소셜 로그인으로 간편하게 시작하기</div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => handleSocialLogin('KAKAO')}
                disabled={isSocialLoading}
                className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="카카오 로그인"
              >
                <Image src={kakaoSvg} alt="kakao" className="rounded-full" width={40} height={40} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('GOOGLE')}
                disabled={isSocialLoading}
                className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="구글 로그인"
              >
                <Image src={googleSvg} alt="google" className="rounded-full" width={40} height={40} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('NAVER')}
                disabled={isSocialLoading}
                className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="네이버 로그인"
              >
                <Image src={naverSvg} alt="naver" className="rounded-full" width={40} height={40} />
              </button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-gray-600">계정이 없으신가요?</span>
            <Link
              href="/signup"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
