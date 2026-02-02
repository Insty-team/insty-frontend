'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/components/ui/input-group';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { useDebounce } from '@/shared/lib/hooks';
import { emailReg, nicknameReg, passwordReg } from '@/shared/lib/regex';
import { cn } from '@/shared/lib/utils';
import { usePostEmailVerifyCheck, usePostEmailVerifySend } from '@/shared/services/auth/auth.hook';
import { useGetEmailCheck, useGetNicknameCheck, usePostEmailSignup } from '@/shared/services/user/user.hook';
import { CheckCircle, Eye, EyeOff, Mail } from 'lucide-react';

import instyPng from '@/assets/Logo.png';

type SignupFormValues = {
  nickname: string;
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
};

type ValidationStatus = 'idle' | 'checking' | 'available' | 'unavailable';
type EmailVerificationStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

/**
 * 회원가입 폼 컴포넌트
 */
export const SignupForm = () => {
  const router = useRouter();

  // 회원가입 mutation
  const { mutate: emailSignup } = usePostEmailSignup({
    onSuccess: (data) => {
      if (data.success) {
        router.push('/login');
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // 이메일 인증 관련 mutation
  const { mutate: sendVerificationCode, isPending: isSendingCode } = usePostEmailVerifySend();
  const { mutate: verifyCode, isPending: isVerifyingCode } = usePostEmailVerifyCheck();

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<EmailVerificationStatus>('idle');
  const [verificationError, setVerificationError] = useState<string>('');

  const form = useForm<SignupFormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      email: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const nicknameValue = form.watch('nickname');
  const emailValue = form.watch('email');
  const passwordValue = form.watch('password');
  const passwordConfirmValue = form.watch('passwordConfirm');

  // 닉네임 중복 확인
  const debouncedNickname = useDebounce(nicknameValue?.trim(), 400);
  const isNicknameValid = !!debouncedNickname && nicknameReg.test(debouncedNickname);
  const { data: isNicknameAvailable, isFetching: isNicknameChecking } = useGetNicknameCheck(
    isNicknameValid ? debouncedNickname : '',
  );

  // 이메일 중복 확인
  const debouncedEmail = useDebounce(emailValue?.trim(), 400);
  const isEmailValid = !!debouncedEmail && emailReg.test(debouncedEmail);
  const { data: isEmailAvailable, isFetching: isEmailChecking } = useGetEmailCheck(isEmailValid ? debouncedEmail : '');

  // 이메일이 변경되면 인증 상태 초기화
  useEffect(() => {
    if (emailVerificationStatus !== 'idle') {
      setEmailVerificationStatus('idle');
      setVerificationError('');
      form.setValue('verificationCode', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail]);

  // 비밀번호가 변경되면 비밀번호 확인 필드 validation 재실행
  useEffect(() => {
    if (passwordValue !== passwordConfirmValue) {
      form.setError('passwordConfirm', { message: '비밀번호가 일치하지 않습니다.' });
    } else {
      form.clearErrors('passwordConfirm');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordValue, passwordConfirmValue]);

  // 닉네임 상태 계산
  const getNicknameStatus = (): ValidationStatus => {
    if (!debouncedNickname || !isNicknameValid) return 'idle';
    if (isNicknameChecking) return 'checking';
    if (isNicknameAvailable === undefined) return 'idle';
    return isNicknameAvailable ? 'available' : 'unavailable';
  };

  // 이메일 상태 계산
  const getEmailStatus = (): ValidationStatus => {
    if (!debouncedEmail || !isEmailValid) return 'idle';
    if (isEmailChecking) return 'checking';
    if (isEmailAvailable === undefined) return 'idle';
    return isEmailAvailable ? 'available' : 'unavailable';
  };

  const nicknameStatus = getNicknameStatus();
  const emailStatus = getEmailStatus();

  // 인증번호 발송
  const handleSendVerificationCode = () => {
    if (emailStatus !== 'available') return;

    setVerificationError('');
    sendVerificationCode(emailValue.trim(), {
      onSuccess: (data) => {
        if (data.success) {
          setEmailVerificationStatus('sent');
        } else {
          setEmailVerificationStatus('error');
          setVerificationError(data.message || '인증번호 발송에 실패했습니다.');
        }
      },
      onError: () => {
        setEmailVerificationStatus('error');
        setVerificationError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    const code = form.getValues('verificationCode');
    if (!code) {
      setVerificationError('인증번호를 입력해주세요.');
      return;
    }

    setVerificationError('');
    verifyCode(
      { email: emailValue.trim(), code },
      {
        onSuccess: (data) => {
          if (data.success) {
            setEmailVerificationStatus('verified');
          } else {
            setEmailVerificationStatus('error');
            setVerificationError(data.message || '인증번호가 올바르지 않습니다.');
          }
        },
        onError: () => {
          setEmailVerificationStatus('error');
          setVerificationError('인증 확인에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const onSubmit = (data: SignupFormValues) => {
    if (nicknameStatus !== 'available' || emailVerificationStatus !== 'verified') {
      return;
    }
    emailSignup({
      nickname: data.nickname,
      email: data.email,
      password: data.password,
    });
  };

  // 인증번호 발송 버튼 활성화 조건
  const canSendVerificationCode = emailStatus === 'available' && emailVerificationStatus !== 'verified';

  // 제출 버튼 비활성화 조건
  const isSubmitDisabled =
    !form.formState.isValid || nicknameStatus !== 'available' || emailVerificationStatus !== 'verified';

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8">
      <div className="flex w-full max-w-[420px] flex-col justify-center gap-5 rounded-2xl bg-white px-10 py-8 shadow-lg">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-4">
          <Image src={instyPng} alt="logo" width={100} priority className="lg:hidden" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            <p className="mt-1 text-sm text-gray-500">새 계정을 만들어 시작하세요</p>
          </div>
        </div>

        {/* 폼 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            {/* 닉네임 */}
            <FormField
              control={form.control}
              name="nickname"
              rules={{
                required: '닉네임을 입력해주세요.',
                pattern: { value: nicknameReg, message: '2~10자의 한글/영문/숫자로 입력해주세요.' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="닉네임을 입력해주세요" maxLength={10} autoComplete="off" />
                  </FormControl>
                  <ValidationMessage
                    status={nicknameStatus}
                    availableText="사용 가능한 닉네임입니다"
                    unavailableText="이미 사용 중인 닉네임입니다"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: '이메일을 입력해주세요.',
                pattern: { value: emailReg, message: '올바른 이메일 형식으로 입력해주세요.' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="이메일을 입력해주세요"
                        type="email"
                        autoComplete="off"
                        disabled={emailVerificationStatus === 'verified'}
                      />
                      <InputGroupAddon align="inline-end">
                        {emailVerificationStatus === 'verified' ? (
                          <div className="flex items-center gap-1 pr-2 text-sm text-green-600">
                            <CheckCircle className="size-4" />
                            <span>인증완료</span>
                          </div>
                        ) : (
                          <InputGroupButton
                            type="button"
                            variant="secondary"
                            onClick={handleSendVerificationCode}
                            disabled={!canSendVerificationCode || isSendingCode}
                          >
                            {isSendingCode ? (
                              <Spinner className="size-4" />
                            ) : emailVerificationStatus === 'sent' || emailVerificationStatus === 'error' ? (
                              '재발송'
                            ) : (
                              '인증번호 발송'
                            )}
                          </InputGroupButton>
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <ValidationMessage
                    status={emailStatus}
                    availableText="사용 가능한 이메일입니다"
                    unavailableText="이미 가입된 이메일입니다"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 인증번호 입력 (인증번호 발송 후에만 표시) */}
            {(emailVerificationStatus === 'sent' || emailVerificationStatus === 'error') && (
              <FormField
                control={form.control}
                name="verificationCode"
                rules={{
                  required: '인증번호를 입력해주세요.',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증번호</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="이메일로 전송된 인증번호를 입력해주세요"
                          maxLength={6}
                          autoComplete="off"
                        />
                        <InputGroupAddon align="inline-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleVerifyCode}
                            disabled={!field.value || isVerifyingCode}
                            className="mr-1"
                          >
                            {isVerifyingCode ? <Spinner className="size-4" /> : '인증 확인'}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    {verificationError && <p className="text-destructive text-xs">{verificationError}</p>}
                    <p className="text-xs text-gray-500">
                      <Mail className="mr-1 inline-block size-3" />
                      이메일에서 인증번호를 확인 후 입력해주세요
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 비밀번호 */}
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: '비밀번호를 입력해주세요.',
                pattern: { value: passwordReg, message: '영문/숫자/특수문자 포함 8~20자로 입력해주세요.' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해주세요"
                        autoComplete="new-password"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비밀번호 확인 */}
            <FormField
              control={form.control}
              name="passwordConfirm"
              rules={{
                required: '비밀번호를 다시 입력해주세요.',
                validate: (v) => v === form.getValues('password') || '비밀번호가 일치하지 않습니다.',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPasswordConfirm ? 'text' : 'password'}
                        placeholder="비밀번호를 다시 입력해주세요"
                        autoComplete="new-password"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setShowPasswordConfirm((v) => !v)}
                        >
                          {showPasswordConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitDisabled}
              className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600"
            >
              회원가입
            </Button>
          </form>
        </Form>

        <Separator />

        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-gray-600">이미 계정이 있으신가요?</span>
          <Link
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

// 중복 확인 메시지 컴포넌트
const ValidationMessage = ({
  status,
  availableText,
  unavailableText,
}: {
  status: ValidationStatus;
  availableText: string;
  unavailableText: string;
}) => {
  if (status === 'idle') return null;

  if (status === 'checking') {
    return (
      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <Spinner className="size-3" /> 확인 중...
      </p>
    );
  }

  return (
    <p className={cn('text-xs', status === 'available' ? 'text-green-600' : 'text-destructive')}>
      {status === 'available' ? availableText : unavailableText}
    </p>
  );
};
