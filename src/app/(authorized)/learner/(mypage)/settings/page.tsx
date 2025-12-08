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
  useGetNotificationSettings,
  usePutNotificationSettings,
} from '@/shared/services/notification/notification.hook';
import {
  NOTIFICATION_TYPE,
  NotificationSettingsRequest,
  NotificationSettingsResponseForLearner,
} from '@/shared/services/notification/notification.type';

import Withdrawal from '@/app/(authorized)/_components/Withdrawal';

export default function LearnerSettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettingsResponseForLearner['settings']>({
    [NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT]: {
      inAppEnabled: false,
      emailEnabled: false,
    },
    [NOTIFICATION_TYPE.NEW_COURSE]: {
      inAppEnabled: false,
      emailEnabled: false,
    },
    [NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER]: {
      inAppEnabled: false,
      emailEnabled: false,
    },
    [NOTIFICATION_TYPE.USER_MENTIONED]: {
      inAppEnabled: false,
      emailEnabled: false,
    },
  });

  const { data: notificationSettings } = useGetNotificationSettings();
  const { mutateAsync: updateNotificationSettings } = usePutNotificationSettings();

  const handleNotificationChange = async (data: NotificationSettingsRequest) => {
    setNotifications((prev) => ({
      ...prev,
      [data.notificationType]: { inAppEnabled: data.inAppEnabled, emailEnabled: data.emailEnabled },
    }));
    await updateNotificationSettings(data);
  };

  useEffect(() => {
    if (notificationSettings?.settings) {
      setNotifications(notificationSettings.settings as NotificationSettingsResponseForLearner['settings']);
    }
  }, [notificationSettings]);

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
                      checked={notifications[NOTIFICATION_TYPE.USER_MENTIONED].inAppEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.USER_MENTIONED,
                          inAppEnabled: value,
                          emailEnabled: notifications[NOTIFICATION_TYPE.USER_MENTIONED].emailEnabled,
                        })
                      }
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="mention-email-notification"
                      checked={notifications[NOTIFICATION_TYPE.USER_MENTIONED].emailEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.USER_MENTIONED,
                          inAppEnabled: notifications[NOTIFICATION_TYPE.USER_MENTIONED].inAppEnabled,
                          emailEnabled: value,
                        })
                      }
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
                      checked={notifications[NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER].inAppEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER,
                          inAppEnabled: value,
                          emailEnabled: notifications[NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER].emailEnabled,
                        })
                      }
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="new-answer-email-notification"
                      checked={notifications[NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER].emailEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER,
                          inAppEnabled: notifications[NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER].inAppEnabled,
                          emailEnabled: value,
                        })
                      }
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
                      checked={notifications[NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT].inAppEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT,
                          inAppEnabled: value,
                          emailEnabled: notifications[NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT].emailEnabled,
                        })
                      }
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center gap-2">
                    <Switch
                      id="answer-accepted-email-notification"
                      checked={notifications[NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT].emailEnabled}
                      onCheckedChange={(value) =>
                        handleNotificationChange({
                          notificationType: NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT,
                          inAppEnabled: notifications[NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT].inAppEnabled,
                          emailEnabled: value,
                        })
                      }
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
      <Withdrawal />
    </div>
  );
}
