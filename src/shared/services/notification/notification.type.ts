export const NOTIFICATION_TYPE = {
  COMMUNITY_ANSWER_ACCEPT: 'COMMUNITY_ANSWER_ACCEPT',
  NEW_COURSE: 'NEW_COURSE',
  NEW_COMMUNITY_ANSWER: 'NEW_COMMUNITY_ANSWER',
  NEW_COMMUNITY_QUESTION: 'NEW_COMMUNITY_QUESTION',
  USER_MENTIONED: 'USER_MENTIONED',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export type NotificationSettingsResponse = {
  settings: {
    [key in NotificationType]: {
      inAppEnabled: boolean;
      emailEnabled: boolean;
    };
  };
};

export type NotificationSettingsRequest = {
  notificationType: NotificationType;
  inAppEnabled: boolean;
  emailEnabled: boolean;
};

export type NotificationMeResponse = {
  id: number;
  title: string;
  message: string;
  redirectUrl: string;
  isRead: boolean;
  createdAt: string;
};

export const NOTIFICATION_TYPE_MAP = {
  [NOTIFICATION_TYPE.COMMUNITY_ANSWER_ACCEPT]: '답변 채택',
  [NOTIFICATION_TYPE.NEW_COURSE]: '새 강의',
  [NOTIFICATION_TYPE.NEW_COMMUNITY_ANSWER]: '새 답변',
  [NOTIFICATION_TYPE.NEW_COMMUNITY_QUESTION]: '새 질문',
  [NOTIFICATION_TYPE.USER_MENTIONED]: '사용자 멘션',
} as const;
