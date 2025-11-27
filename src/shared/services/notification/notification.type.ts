// - NEW_COURSE: 새 강의 알림 - 내가 관심/구독 중인 새로운 강의가 등록되었을 때 수강중인 Runner에게 발송 (수신자 : RUNNER)
// - NEW_COMMUNITY_QUESTION: 새 질문 알림 - 자신의 강의에 새로운 질문이 등록되었을 때 발송 (수신자 : CREATOR)
// - NEW_COMMUNITY_ANSWER: 새 답변 알림 - 내가 작성한 질문에 새로운 답변이 달렸을 때 발송 (수신자 : RUNNER / CREATOR)
// - COMMUNITY_ANSWER_ACCEPT: 답변 채택 알림 - 내가 참여한(댓글을 단) 질문 중 답변이 채택되었을 때 발송 (수신자 : RUNNER / CREATOR)
// - USER_MENTIONED: 멘션 알림 - 커뮤니티 질문/답변에서 다른 사용자가 나를 멘션했을 때 발송 (수신자 : RUNNER / CREATOR)

export const NOTIFICATION_TYPE = {
  COMMUNITY_ANSWER_ACCEPT: 'COMMUNITY_ANSWER_ACCEPT',
  NEW_COURSE: 'NEW_COURSE',
  NEW_COMMUNITY_ANSWER: 'NEW_COMMUNITY_ANSWER',
  NEW_COMMUNITY_QUESTION: 'NEW_COMMUNITY_QUESTION',
  USER_MENTIONED: 'USER_MENTIONED',
} as const;

type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
export type NotificationTypeForLearner = Exclude<NotificationType, 'NEW_COMMUNITY_QUESTION'>;
export type NotificationTypeForCreator = Exclude<NotificationType, 'NEW_COURSE'>;

export type NotificationSettingsResponseForLearner = {
  settings: {
    [key in NotificationTypeForLearner]: {
      inAppEnabled: boolean;
      emailEnabled: boolean;
    };
  };
};
export type NotificationSettingsResponseForCreator = {
  settings: {
    [key in NotificationTypeForCreator]: {
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
