import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Spinner } from '@/shared/components/ui/spinner';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import { Attachment, CourseQuestionStatus, VideoType } from '@/shared/services/course/course.type';
import { Calendar } from 'lucide-react';
import QuestionLabel from '@/shared/components/question/QuestionLabel';
import useVideoPlaylist from '@/shared/hooks/video/useVideoPlaylist';
import ReactPlayer from 'react-player';

const QuestionVideoPlayer = ({ questionId, videoType }: { questionId: number; videoType: VideoType }) => {
  const { m3u8Url, isLoading: isLoadingVideo } = useVideoPlaylist({
    type: videoType,
    id: questionId.toString(),
    enabled: !!questionId,
  });

  return (
    <div className="mt-3 overflow-hidden rounded-lg border">
      {isLoadingVideo || !m3u8Url ? (
        <div className="flex items-center justify-center bg-muted py-20">
          <Spinner className="size-6" />
        </div>
      ) : (
        <div className="aspect-video">
          <ReactPlayer src={m3u8Url} controls width="100%" height="100%" />
        </div>
      )}
    </div>
  );
};

type QuestionDetailProps = {
  questionData: {
    title: string;
    content: string;
    status?: CourseQuestionStatus;
    courseName?: string;
    user?: {
      id?: number;
      nickname?: string;
    };
    createdAt?: string;
    attachments?: Attachment[];
    videoInfo?: {
      videoType: VideoType;
      videoUuid: string;
      originFileName: string;
    } | null;
    questionId?: number;
  } | null | undefined;
  isLoading?: boolean;
  isError?: boolean;
  showStatus?: boolean;
  variant?: 'boxed' | 'plain';
};

export default function QuestionDetail({
  questionData,
  isLoading = false,
  isError = false,
  showStatus = true,
  variant = 'boxed',
}: QuestionDetailProps) {
  const renderAttachments = (attachments: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {attachments
          .filter((file) => file?.url)
          .slice(0, 2)
          .map((file) => (
            <div key={file.id} className="relative inline-block">
              <Image
                src={file.url}
                alt={file.name}
                width={0}
                height={0}
                sizes="100vw"
                className="h-60 w-auto rounded border object-contain"
              />
            </div>
          ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
        <Spinner className="size-4" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        Failed to load question details.
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        Question information not found.
      </div>
    );
  }

  const content = (
    <>
      {/* 상태 배지 */}
      {showStatus && questionData.status && <QuestionLabel status={questionData.status} />}

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-foreground">Q. {questionData.title}</h1>

      {/* 사용자 정보 */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {questionData.user?.nickname?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{questionData.user?.nickname}</span>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Calendar className="h-3 w-3" />
            {questionData.createdAt ? dayjs(questionData.createdAt).format('MMM DD, YYYY HH:mm') : ''}
          </div>
        </div>
      </div>

      {/* 질문 내용 */}
      <div className="pt-4 border-t">
        <div
          className="text-sm leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{ __html: getDisplayContent(questionData.content) }}
        />
        {questionData.attachments && renderAttachments(questionData.attachments)}
        {questionData.videoInfo?.videoUuid && questionData.questionId && (
          <QuestionVideoPlayer questionId={questionData.questionId} videoType={questionData.videoInfo.videoType} />
        )}
      </div>
    </>
  );

  if (variant === 'plain') {
    return <div className="space-y-4">{content}</div>;
  }

  return <div className="border rounded-sm px-6 py-4 space-y-4">{content}</div>;
}
