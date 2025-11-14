'use client';

import { useEffect, useState } from 'react';

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
import {
  useGetNotificationPreferences,
  usePutNotificationPreferences,
} from '@/shared/services/notification/notification.hook';
import { NotificationRequest } from '@/shared/services/notification/notification.type';

export default function LearnerSettingsPage() {
  const [notifications, setNotifications] = useState<NotificationRequest>({
    userMentionNotificationEnabled: false,
    userMentionEmailEnabled: false,
    newQuestionNotificationEnabled: false,
    newQuestionEmailEnabled: false,
    newAnswerNotificationEnabled: false,
    newAnswerEmailEnabled: false,
    answerAcceptedNotificationEnabled: false,
    answerAcceptedEmailEnabled: false,
    requestedCourseRegistrationNotificationEnabled: false,
    requestedCourseRegistrationEmailEnabled: false,
  });

  const { data: notificationPreferences } = useGetNotificationPreferences();
  const { mutateAsync: updateNotificationPreferences } = usePutNotificationPreferences();
  const handleNotificationChange = async (key: keyof NotificationRequest, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    await updateNotificationPreferences({ ...notifications, [key]: value });
  };

  useEffect(() => {
    if (notificationPreferences) {
      setNotifications(notificationPreferences);
    }
  }, [notificationPreferences]);

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
          <CardDescription>이벤트 별 푸시 알림과 이메일 수신 여부를 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-muted-foreground flex justify-end px-2 text-xs font-medium">
            <div className="w-[100px] text-center">푸시 알림</div>
            <div className="w-[100px] text-center">이메일 수신</div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="mention-web-notification">사용자 멘션</Label>
                  <p className="text-muted-foreground text-sm">댓글이나 답변에서 @멘션을 받으면 알려드려요</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="mention-web-notification"
                      checked={notifications.userMentionNotificationEnabled}
                      onCheckedChange={(value) => handleNotificationChange('userMentionNotificationEnabled', value)}
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="mention-email-notification"
                      checked={notifications.userMentionEmailEnabled}
                      onCheckedChange={(value) => handleNotificationChange('userMentionEmailEnabled', value)}
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="new-question-web-notification">새 질문</Label>
                  <p className="text-muted-foreground text-sm">관심 태그에 새로운 질문이 등록되면 알려드려요</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="new-question-web-notification"
                      checked={notifications.newQuestionNotificationEnabled}
                      onCheckedChange={(value) => handleNotificationChange('newQuestionNotificationEnabled', value)}
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="new-question-email-notification"
                      checked={notifications.newQuestionEmailEnabled}
                      onCheckedChange={(value) => handleNotificationChange('newQuestionEmailEnabled', value)}
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="new-answer-web-notification">새 답변</Label>
                  <p className="text-muted-foreground text-sm">내 질문에 새로운 답변이 달리면 알려드려요</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="new-answer-web-notification"
                      checked={notifications.newAnswerNotificationEnabled}
                      onCheckedChange={(value) => handleNotificationChange('newAnswerNotificationEnabled', value)}
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="new-answer-email-notification"
                      checked={notifications.newAnswerEmailEnabled}
                      onCheckedChange={(value) => handleNotificationChange('newAnswerEmailEnabled', value)}
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="answer-accepted-web-notification">답변 채택</Label>
                  <p className="text-muted-foreground text-sm">내 답변이 채택되면 바로 알려드려요</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="answer-accepted-web-notification"
                      checked={notifications.answerAcceptedNotificationEnabled}
                      onCheckedChange={(value) => handleNotificationChange('answerAcceptedNotificationEnabled', value)}
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="answer-accepted-email-notification"
                      checked={notifications.answerAcceptedEmailEnabled}
                      onCheckedChange={(value) => handleNotificationChange('answerAcceptedEmailEnabled', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
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
