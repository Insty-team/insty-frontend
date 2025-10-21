import { NotificationRequest, NotificationResponse } from './notification.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 사용자 알림 설정 조회 */
export const GET_notification = async (): Promise<ApiResponse<NotificationResponse>> => {
  const response = await api.get('/api/v1/users/notification-preferences');
  return response.data;
};

/** 사용자 알림 설정 변경 */
export const PUT_notification = async (data: NotificationRequest) => {
  const response = await api.put('/api/v1/users/notification-preferences', data);
  return response.data;
};
