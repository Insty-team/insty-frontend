'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/components/ui/input-group';
import { emailReg, passwordReg } from '@/shared/lib/regex';
import {
  usePostEmailVerifyPasswordResetCode,
  usePostPasswordReset,
  usePostPasswordResetSendEmail,
} from '@/shared/services/auth/auth.hook';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

type PasswordResetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step1Values = { email: string };
type Step2Values = { code: string };
type Step3Values = { newPassword: string; confirmPassword: string };

export function PasswordResetDialog({ open, onOpenChange }: PasswordResetDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: sendEmail, isPending: isSendingEmail } = usePostPasswordResetSendEmail();
  const { mutateAsync: verifyCode, isPending: isVerifying } = usePostEmailVerifyPasswordResetCode();
  const { mutateAsync: resetPassword, isPending: isResetting } = usePostPasswordReset();

  const formStep1 = useForm<Step1Values>({ defaultValues: { email: '' } });
  const formStep2 = useForm<Step2Values>({ defaultValues: { code: '' } });
  const formStep3 = useForm<Step3Values>({ defaultValues: { newPassword: '', confirmPassword: '' } });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep(1);
      setEmail('');
      formStep1.reset();
      formStep2.reset();
      formStep3.reset();
    }
    onOpenChange(nextOpen);
  };

  const onStep1Submit = async (data: Step1Values) => {
    try {
      const res = await sendEmail(data.email);
      if (res?.success) {
        setEmail(data.email);
        setStep(2);
        toast.success('인증코드가 이메일로 발송되었습니다.');
      } else {
        toast.error(res?.message ?? '인증코드 발송에 실패했습니다.');
      }
    } catch {
      toast.error('인증코드 발송에 실패했습니다. 이메일을 확인해주세요.');
    }
  };

  const onStep2Submit = async (data: Step2Values) => {
    try {
      const res = await verifyCode({ email, code: data.code });
      if (res?.success) {
        setStep(3);
        toast.success('인증이 완료되었습니다. 새 비밀번호를 입력해주세요.');
      } else {
        toast.error(res?.message ?? '인증에 실패했습니다.');
      }
    } catch {
      toast.error('인증에 실패했습니다. 인증코드를 확인해주세요.');
    }
  };

  const onStep3Submit = async (data: Step3Values) => {
    try {
      const res = await resetPassword({ email, newPassword: data.newPassword });
      if (res?.success) {
        toast.success('비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.');
        handleClose(false);
      } else {
        toast.error(res?.message ?? '비밀번호 변경에 실패했습니다.');
      }
    } catch {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };

  const isLoading = isSendingEmail || isVerifying || isResetting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]" showCloseButton={step === 1}>
        <DialogHeader>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogDescription>
            {step === 1 && '가입한 이메일 주소를 입력하면 인증코드를 보내드립니다.'}
            {step === 2 && `${email}로 발송된 인증코드를 입력해주세요.`}
            {step === 3 && '새 비밀번호를 입력해주세요.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <Form {...formStep1}>
            <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="space-y-4">
              <FormField
                control={formStep1.control}
                name="email"
                rules={{
                  required: { value: true, message: '이메일을 입력해주세요.' },
                  pattern: { value: emailReg, message: '이메일 형식이 잘못되었습니다.' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="이메일을 입력해주세요." type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600">
                  인증코드 발송
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...formStep2}>
            <form onSubmit={formStep2.handleSubmit(onStep2Submit)} className="space-y-4">
              <FormField
                control={formStep2.control}
                name="code"
                rules={{
                  required: { value: true, message: '인증코드를 입력해주세요.' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증코드</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="이메일로 받은 인증코드를 입력해주세요." autoComplete="one-time-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                  이전
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600">
                  인증하기
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...formStep3}>
            <form onSubmit={formStep3.handleSubmit(onStep3Submit)} className="space-y-4">
              <FormField
                control={formStep3.control}
                name="newPassword"
                rules={{
                  required: { value: true, message: '새 비밀번호를 입력해주세요.' },
                  pattern: {
                    value: passwordReg,
                    message: '영문/숫자/특수문자를 포함한 8~20자 이내로 입력해주세요.',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="새 비밀번호를 입력해주세요."
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
              <FormField
                control={formStep3.control}
                name="confirmPassword"
                rules={{
                  required: { value: true, message: '비밀번호 확인을 입력해주세요.' },
                  validate: (value) =>
                    value === formStep3.getValues('newPassword') || '비밀번호가 일치하지 않습니다.',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="비밀번호를 다시 입력해주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={isLoading}>
                  이전
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600">
                  비밀번호 변경
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
