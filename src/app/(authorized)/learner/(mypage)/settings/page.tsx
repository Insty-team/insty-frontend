'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';

export default function LearnerSettingsPage() {
  const [emailNotification, setEmailNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">설정</h2>
        <p className="text-muted-foreground mt-1">계정 및 알림 설정을 관리하세요</p>
      </div>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>수신할 알림을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notification">이메일 알림</Label>
              <p className="text-muted-foreground text-sm">새로운 강의 및 업데이트 소식을 이메일로 받습니다</p>
            </div>
            <Switch id="email-notification" checked={emailNotification} onCheckedChange={setEmailNotification} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notification">푸시 알림</Label>
              <p className="text-muted-foreground text-sm">새로운 댓글 및 답변 알림을 받습니다</p>
            </div>
            <Switch id="push-notification" checked={pushNotification} onCheckedChange={setPushNotification} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-email">마케팅 수신 동의</Label>
              <p className="text-muted-foreground text-sm">이벤트 및 할인 정보를 받습니다</p>
            </div>
            <Switch id="marketing-email" checked={marketingEmail} onCheckedChange={setMarketingEmail} />
          </div>
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>정기적으로 비밀번호를 변경하여 계정을 안전하게 보호하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>비밀번호 변경</Button>
        </CardContent>
      </Card>

      {/* 계정 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
          <CardDescription>계정 삭제 및 탈퇴</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">회원 탈퇴</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다. 구매한 강의에 대한 접근 권한도
                  함께 사라집니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  탈퇴하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
