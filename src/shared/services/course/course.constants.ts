export type CourseQuestionStatus = 'WAITING' | 'ANSWERED' | 'ACCEPTED';

type StatusMeta = {
  label: string;
  className: string;
};

export const COURSE_QUESTION_STATUS_META: Record<CourseQuestionStatus, StatusMeta> = {
  WAITING: {
    label: 'Waiting',
    className: 'border-gray-300 bg-gray-50 text-gray-700',
  },
  ANSWERED: {
    label: 'Answered',
    className: 'border-lime-300 bg-lime-50 text-lime-700',
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'border-green-300 bg-green-50 text-green-700',
  },
};
