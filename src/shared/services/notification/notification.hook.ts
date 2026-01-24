import {
  GET_notification_settings,
  GET_notifications_me,
  POST_notification_read,
  POST_notification_read_all,
  PUT_notification_all_settings,
  PUT_notification_settings,
} from './notification.service';
import { NotificationSettingsRequest } from './notification.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 내 알림 설정 조회 */
export const useGetNotificationSettings = () => {
  return useQuery({
    queryKey: [GET_notification_settings.name],
    queryFn: () => GET_notification_settings(),
    select: ({ data }) => data,
  });
};

/** 특정 알림 타입 설정 변경 */
export const usePutNotificationSettings = () => {
  return useMutation({
    mutationKey: [PUT_notification_settings.name],
    mutationFn: (data: NotificationSettingsRequest) => PUT_notification_settings(data),
  });
};

/** 모든 알림 일괄 설정 */
export const usePutNotificationAllSettings = () => {
  return useMutation({
    mutationKey: [PUT_notification_all_settings.name],
    mutationFn: (data: { enableAll: boolean }) => PUT_notification_all_settings(data),
  });
};

/** 알림 읽음 처리 및 이동 */
export const usePostNotificationRead = () => {
  return useMutation({
    mutationKey: [POST_notification_read.name],
    mutationFn: (notificationId: number) => POST_notification_read(notificationId),
  });
};

/** 모든 알림 읽음 처리 */
export const usePostNotificationReadAll = () => {
  return useMutation({
    mutationKey: [POST_notification_read_all.name],
    mutationFn: () => POST_notification_read_all(),
  });
};

/** 사용자 알림 조회 */
export const useGetNotificationsMe = () => {
  return useQuery({
    queryKey: [GET_notifications_me.name],
    queryFn: () => GET_notifications_me(),
    select: ({ data }) => data,
  });
};
