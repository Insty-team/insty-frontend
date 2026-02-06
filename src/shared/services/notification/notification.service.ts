import {
  NotificationMeResponse,
  NotificationSettingsRequest,
  NotificationSettingsResponseForCreator,
  NotificationSettingsResponseForLearner,
} from './notification.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';

/** 내 알림 설정 조회 */
export const GET_notification_settings = async (): Promise<
  ApiResponse<NotificationSettingsResponseForLearner | NotificationSettingsResponseForCreator>
> => {
  const response = await api.get('/api/v1/notification/settings');
  return response.data;
};

/** 특정 알림 타입 설정 변경 */
export const PUT_notification_settings = async (data: NotificationSettingsRequest): Promise<ApiResponse<void>> => {
  const response = await api.put('/api/v1/notification/settings', data);
  return response.data;
};

/** 모든 알림 일괄 설정 */
export const PUT_notification_all_settings = async (data: { enableAll: boolean }): Promise<ApiResponse<void>> => {
  const response = await api.put('/api/v1/notification/settings/bulk', data);
  return response.data;
};

/** 알림 읽음 처리 및 이동 */
export const POST_notification_read = async (notificationId: number): Promise<ApiResponse<void>> => {
  const response = await api.post(`/api/v1/notification/${notificationId}/read`);
  return response.data;
};

/** 모든 알림 읽음 처리 */
export const POST_notification_read_all = async (): Promise<ApiResponse<void>> => {
  const response = await api.post(`/api/v1/notification/read-all`);
  return response.data;
};

/** 사용자 알림 조회 */
export const GET_notifications_me = async (): Promise<ApiResponse<NotificationMeResponse[]>> => {
  const response = await api.get('/api/v1/notification');
  return response.data;
};
