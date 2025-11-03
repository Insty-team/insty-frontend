import { GET_notification_preferences, PUT_notification_preferences } from './notification.service';
import { NotificationRequest } from './notification.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 사용자 알림 설정 조회 */
export const useGetNotificationPreferences = () => {
  return useQuery({
    queryKey: [GET_notification_preferences.name],
    queryFn: () => GET_notification_preferences(),
    select: ({ data }) => data,
  });
};

/** 사용자 알림 설정 변경 */
export const usePutNotificationPreferences = () => {
  return useMutation({
    mutationKey: [PUT_notification_preferences.name],
    mutationFn: (data: NotificationRequest) => PUT_notification_preferences(data),
  });
};
