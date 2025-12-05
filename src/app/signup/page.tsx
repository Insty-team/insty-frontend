'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { emailReg, nicknameReg, passwordReg } from '@/shared/lib/regex';
import { cn } from '@/shared/lib/utils';
import { usePostEmailVerifyCheck, usePostEmailVerifySend } from '@/shared/services/auth/auth.hook';
import { useGetEmailCheck, useGetNicknameCheck } from '@/shared/services/user/user.hook';
import { Eye, EyeOff } from 'lucide-react';

import instyPng from '@/assets/Logo.png';

type SignupFormValues = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  emailCode: string;
};

type NicknameStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'duplicated' | 'error';
type EmailDupStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'duplicated' | 'error';
type EmailStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SignupPage() {
  const router = useRouter();
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const [emailDupStatus, setEmailDupStatus] = useState<EmailDupStatus>('idle');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailDupMessage, setEmailDupMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formError, setFormError] = useState('');
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);

  const { mutateAsync: sendEmailVerify, isPending: isEmailSending } = usePostEmailVerifySend();
  const { mutateAsync: verifyEmailCode, isPending: isEmailCodeChecking } = usePostEmailVerifyCheck();

  const form = useForm<SignupFormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
      emailCode: '',
    },
  });

  const nicknameValue = form.watch('nickname');
  const emailValue = form.watch('email');
  const nicknameError = form.formState.errors.nickname;
  const emailError = form.formState.errors.email;
  const debouncedNickname = useDebounce(nicknameValue?.trim(), 400);
  const debouncedEmail = useDebounce(emailValue?.trim(), 400);
  const shouldCheckNickname = !!debouncedNickname && nicknameReg.test(debouncedNickname);
  const {
    data: nicknameCheckResult,
    isFetching: isNicknameChecking,
    isError: isNicknameError,
  } = useGetNicknameCheck(shouldCheckNickname ? debouncedNickname : '');
  const shouldCheckEmail = !!debouncedEmail && emailReg.test(debouncedEmail);
  const {
    data: emailCheckResult,
    isFetching: isEmailChecking,
    isError: isEmailError,
  } = useGetEmailCheck(shouldCheckEmail ? debouncedEmail : '');

  useEffect(() => {
    if (!debouncedNickname) {
      setNicknameStatus('idle');
      setNicknameMessage('');
      return;
    }

    if (!nicknameReg.test(debouncedNickname)) {
      setNicknameStatus('invalid');
      setNicknameMessage('2~10자의 한글/영문/숫자 조합으로 입력해주세요.');
      return;
    }

    if (isNicknameChecking) {
      setNicknameStatus('checking');
      setNicknameMessage('닉네임 중복을 확인 중입니다.');
      return;
    }

    if (isNicknameError) {
      setNicknameStatus('error');
      setNicknameMessage('닉네임 검증에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    if (nicknameCheckResult === undefined) {
      return;
    }

    if (nicknameCheckResult) {
      setNicknameStatus('available');
      setNicknameMessage('사용 가능한 닉네임입니다.');
    } else {
      setNicknameStatus('duplicated');
      setNicknameMessage('이미 사용 중인 닉네임입니다.');
    }
  }, [debouncedNickname, isNicknameChecking, isNicknameError, nicknameCheckResult]);

  const { setValue } = form;

  useEffect(() => {
    setIsEmailVerified(false);
    setEmailStatus('idle');
    setEmailMessage('');
    setEmailDupStatus('idle');
    setEmailDupMessage('');
    setValue('emailCode', '');
    setShowEmailCodeInput(false);
  }, [emailValue, setValue]);

  useEffect(() => {
    if (!debouncedEmail) {
      setEmailDupStatus('idle');
      setEmailDupMessage('');
      return;
    }

    if (!emailReg.test(debouncedEmail)) {
      setEmailDupStatus('invalid');
      setEmailDupMessage('올바른 이메일 형식으로 입력해주세요.');
      return;
    }

    if (isEmailChecking) {
      setEmailDupStatus('checking');
      setEmailDupMessage('이메일 중복을 확인 중입니다.');
      return;
    }

    if (isEmailError) {
      setEmailDupStatus('error');
      setEmailDupMessage('이메일 검증에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    if (emailCheckResult === undefined) {
      return;
    }

    if (emailCheckResult) {
      setEmailDupStatus('available');
      setEmailDupMessage('사용 가능한 이메일입니다. 인증을 진행해주세요.');
    } else {
      setEmailDupStatus('duplicated');
      setEmailDupMessage('이미 가입된 이메일입니다. 다른 이메일을 입력해주세요.');
    }
  }, [debouncedEmail, isEmailChecking, isEmailError, emailCheckResult]);

  const handleSendVerification = async () => {
    const trimmedEmail = emailValue?.trim();

    if (!trimmedEmail || !emailReg.test(trimmedEmail)) {
      setEmailStatus('error');
      setEmailMessage('올바른 이메일을 입력한 뒤 다시 시도해주세요.');
      return;
    }

    if (emailDupStatus !== 'available') {
      setEmailStatus('error');
      setEmailMessage('이메일 중복 확인을 완료한 뒤 다시 시도해주세요.');
      return;
    }

    setEmailStatus('sending');
    setEmailMessage('인증코드를 이메일로 전송 중입니다.');

    try {
      await sendEmailVerify(trimmedEmail);
      setEmailStatus('sent');
      setShowEmailCodeInput(true);
      setEmailMessage('인증코드를 이메일로 전송했습니다. 받은 코드를 입력해주세요.');
    } catch {
      setEmailStatus('error');
      setEmailMessage('인증코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleVerifyEmailCode = async () => {
    const trimmedEmail = emailValue?.trim();
    const code = form.getValues('emailCode')?.trim();

    if (!trimmedEmail || !code) {
      setEmailStatus('error');
      setEmailMessage('이메일과 인증코드를 모두 입력해주세요.');
      return;
    }

    setEmailStatus('verifying');
    setEmailMessage('인증코드를 확인 중입니다.');

    try {
      await verifyEmailCode({ email: trimmedEmail, code });
      setEmailStatus('verified');
      setIsEmailVerified(true);
      setEmailMessage('이메일 인증이 완료되었습니다.');
    } catch {
      setEmailStatus('error');
      setIsEmailVerified(false);
      setEmailMessage('인증코드가 올바르지 않습니다. 다시 확인해주세요.');
    }
  };

  const onSubmit = (data: SignupFormValues) => {
    if (nicknameStatus !== 'available') {
      setFormError('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    if (!isEmailVerified) {
      setFormError('이메일 인증을 완료해주세요.');
      return;
    }

    setFormError('');
    console.log('signup', data);
  };

  const isSubmitDisabled = !form.formState.isValid || nicknameStatus !== 'available' || !isEmailVerified;

  const nicknameStatusColor = useMemo(() => {
    switch (nicknameStatus) {
      case 'available':
        return 'text-green-600';
      case 'duplicated':
      case 'error':
      case 'invalid':
        return 'text-destructive';
      default:
        return 'text-gray-500';
    }
  }, [nicknameStatus]);

  const emailStatusColor = useMemo(() => {
    switch (emailStatus) {
      case 'sent':
      case 'verified':
        return 'text-green-600';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-gray-500';
    }
  }, [emailStatus]);

  const emailDupStatusColor = useMemo(() => {
    switch (emailDupStatus) {
      case 'available':
        return 'text-green-600';
      case 'duplicated':
      case 'error':
      case 'invalid':
        return 'text-destructive';
      default:
        return 'text-gray-500';
    }
  }, [emailDupStatus]);

  const emailFeedbackColor = emailMessage ? emailStatusColor : emailDupStatusColor;
  const emailFeedbackMessage = emailMessage || emailDupMessage;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className={cn('flex w-[420px] flex-col justify-center gap-6 rounded-2xl px-12 py-10 shadow-lg')}>
        <div className="flex w-full flex-col justify-center">
          <div className="flex flex-col items-center gap-5">
            <Image src={instyPng} alt="logo" width={120} priority />
            <p className="text-green text-xl font-semibold">회원가입</p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full items-center space-y-3"
            autoComplete="off"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="nickname"
                rules={{
                  required: '닉네임을 입력해주세요.',
                  pattern: {
                    value: nicknameReg,
                    message: '2~10자의 한글/영문/숫자 조합으로 입력해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="사용하실 닉네임을 입력해주세요."
                        maxLength={10}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage className={cn(!nicknameError && 'text-xs', !nicknameError && nicknameStatusColor)}>
                      {!nicknameError &&
                        (nicknameStatus === 'checking' ? (
                          <span className="inline-flex items-center gap-2">
                            <Spinner className="size-3.5" />
                            {nicknameMessage}
                          </span>
                        ) : (
                          nicknameMessage || '\u00A0'
                        ))}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: emailReg,
                    message: '이메일 형식이 올바르지 않습니다.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="이메일을 입력해주세요."
                          type="email"
                          disabled={isEmailVerified}
                          autoComplete="off"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            disabled={
                              isEmailVerified || isEmailSending || !field.value || emailDupStatus !== 'available'
                            }
                            onClick={handleSendVerification}
                          >
                            {isEmailSending ? '발송 중...' : '인증코드 발송'}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage className={cn(!emailError && 'text-xs', !emailError && emailFeedbackColor)}>
                      {!emailError && (emailFeedbackMessage || '\u00A0')}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {showEmailCodeInput && (
                <FormField
                  control={form.control}
                  name="emailCode"
                  rules={{
                    validate: (value) => {
                      if (emailStatus === 'verified') return true;
                      return value ? true : '이메일 인증코드를 입력해주세요.';
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일 인증코드</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="인증코드 6자리를 입력해주세요."
                            maxLength={6}
                            disabled={emailStatus === 'verified'}
                            autoComplete="off"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={emailStatus !== 'sent' || !field.value || isEmailCodeChecking}
                          onClick={handleVerifyEmailCode}
                        >
                          {isEmailCodeChecking ? '확인 중...' : '인증 확인'}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: '비밀번호를 입력해주세요.',
                  pattern: {
                    value: passwordReg,
                    message: '영문/숫자/특수문자를 포함해 8~20자로 입력해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="비밀번호를 입력해주세요."
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setShowPassword((prev) => !prev)}
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

              <FormField
                control={form.control}
                name="passwordConfirm"
                rules={{
                  required: '비밀번호를 한 번 더 입력해주세요.',
                  validate: (value) => value === form.getValues('password') || '비밀번호가 일치하지 않습니다.',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="비밀번호를 다시 입력해주세요."
                          type={showPasswordConfirm ? 'text' : 'password'}
                          autoComplete="new-password"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setShowPasswordConfirm((prev) => !prev)}
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
            </div>

            {formError && <p className="text-destructive text-sm">{formError}</p>}

            <Button type="submit" size="lg" disabled={isSubmitDisabled}>
              회원가입
            </Button>
          </form>
        </Form>

        <Separator />
        <div className="flex items-center justify-center gap-1">
          <div className="text-sm text-gray-600">이미 계정을 보유하고 계신가요?</div>
          <Link
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="text-primary-green-600 hover:text-primary-green-700 text-sm font-medium underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
