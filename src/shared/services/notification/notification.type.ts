export type NotificationResponse = {
  id: string;
  userId: string;
  userMentionNotificationEnabled: boolean;
  userMentionEmailEnabled: boolean;
  newQuestionNotificationEnabled: boolean;
  newQuestionEmailEnabled: boolean;
  newAnswerNotificationEnabled: boolean;
  newAnswerEmailEnabled: boolean;
  answerAcceptedNotificationEnabled: boolean;
  answerAcceptedEmailEnabled: boolean;
  requestedCourseRegistrationNotificationEnabled: boolean;
  requestedCourseRegistrationEmailEnabled: boolean;
};

export type NotificationRequest = {
  userMentionNotificationEnabled: boolean;
  userMentionEmailEnabled: boolean;
  newQuestionNotificationEnabled: boolean;
  newQuestionEmailEnabled: boolean;
  newAnswerNotificationEnabled: boolean;
  newAnswerEmailEnabled: boolean;
  answerAcceptedNotificationEnabled: boolean;
  answerAcceptedEmailEnabled: boolean;
  requestedCourseRegistrationNotificationEnabled: boolean;
  requestedCourseRegistrationEmailEnabled: boolean;
};
