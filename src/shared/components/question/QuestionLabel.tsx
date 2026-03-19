import { CheckCircle, Clock, MessageCircleQuestion } from 'lucide-react';

type CourseQuestionStatus = 'WAITING' | 'ANSWERED' | 'ACCEPTED';

type QuestionLabelProps = {
  status?: CourseQuestionStatus;
  className?: string;
};

const STATUS_CONFIG = {
  WAITING: {
    label: 'Waiting',
    className: 'border-gray-300 bg-gray-50 text-gray-700',
    icon: Clock,
  },
  ANSWERED: {
    label: 'Answered',
    className: 'border-lime-300 bg-lime-50 text-lime-700',
    icon: MessageCircleQuestion,
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'border-green-300 bg-green-50 text-green-700',
    icon: CheckCircle,
  },
};

export default function QuestionLabel({ status, className = '' }: QuestionLabelProps) {
  const statusMeta = status ? STATUS_CONFIG[status] : STATUS_CONFIG.WAITING;
  const Icon = statusMeta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${statusMeta.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {statusMeta.label}
    </span>
  );
}
