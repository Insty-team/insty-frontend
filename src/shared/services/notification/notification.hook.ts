import { GET_notification, PUT_notification } from './notification.service';
import { NotificationRequest } from './notification.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 사용자 알림 설정 조회 */
export const useGetNotification = () => {
  return useQuery({
    queryKey: [GET_notification.name],
    queryFn: () => GET_notification(),
    select: ({ data }) => data,
  });
};

/** 사용자 알림 설정 변경 */
export const usePutNotification = () => {
  return useMutation({
    mutationKey: [PUT_notification.name],
    mutationFn: (data: NotificationRequest) => PUT_notification(data),
  });
};
