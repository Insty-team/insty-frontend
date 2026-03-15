'use client';

import { useEffect, useState } from 'react';

import ConfirmModal from '@/shared/components/ConfirmModal';
import RichTextEditor from '@/shared/components/editor/RichTextEditor';
import QuestionAnswers from '@/shared/components/question/QuestionAnswers';
import QuestionDetail from '@/shared/components/question/QuestionDetail';
import QuestionLabel from '@/shared/components/question/QuestionLabel';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import { usePostCommunityAnswerDraft } from '@/shared/services/ai-community/ai-community.hook';
import {
  useDeleteCourseQuestion,
  useDeleteCourseQuestionAnswer,
  useGetCourseQuestion,
  useGetCourseQuestionAnswerAccepted,
  useGetCourseQuestionAnswers,
  usePatchCourseQuestion,
  usePatchCourseQuestionAnswerById,
  usePostCourseQuestionAnswer,
  usePostCourseQuestionAnswerAccept,
} from '@/shared/services/course/course.hook';
import type { Attachment } from '@/shared/services/course/course.type';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { ChevronLeft, MoreHorizontal, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  readonly courseId: number;
  readonly questionId: number;
  readonly onBack: () => void;
};

export default function QuestionDetailSheet({ courseId, questionId, onBack }: Props) {
  const [answerContent, setAnswerContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftPreview, setDraftPreview] = useState<string | null>(null);

  const [isQuestionEditing, setIsQuestionEditing] = useState(false);
  const [isQuestionDeleteOpen, setIsQuestionDeleteOpen] = useState(false);

  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionAttachedFiles, setQuestionAttachedFiles] = useState<File[]>([]);
  const [questionVideoFile, setQuestionVideoFile] = useState<File | null>(null);
  const [questionExistingAttachments, setQuestionExistingAttachments] = useState<Attachment[]>([]);
  const [questionExistingVideo, setQuestionExistingVideo] = useState<{ originFileName?: string } | null>(null);
  const [questionDeletedAttachmentIds, setQuestionDeletedAttachmentIds] = useState<number[]>([]);
  const [questionEditorKey, setQuestionEditorKey] = useState(0);

  // 답변 관련 state
  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false);
  const [cancelAcceptConfirmOpen, setCancelAcceptConfirmOpen] = useState(false);
  const [deleteAnswerConfirmOpen, setDeleteAnswerConfirmOpen] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [answers, setAnswers] = useState<any[]>([]);
  const [editorKey, setEditorKey] = useState(0);

  const { data: userProfile } = useGetProfile();
  const currentUserId = userProfile?.id;

  const { mutate: postAnswer, isPending: isPosting } = usePostCourseQuestionAnswer(courseId, questionId);
  const { uploadVideo } = usePresignedVideoUpload();
  const { mutateAsync: generateAnswerDraft } = usePostCommunityAnswerDraft();
  const { data: answersData, isFetching: isAnswersFetching } = useGetCourseQuestionAnswers(
    courseId,
    questionId,
    page,
    pageSize,
  );
  const { data: acceptedAnswer } = useGetCourseQuestionAnswerAccepted(courseId, questionId);
  const { mutate: toggleAcceptAnswer, isPending: isAccepting } = usePostCourseQuestionAnswerAccept(
    courseId,
    questionId,
  );
  const { mutate: deleteAnswer, isPending: isDeletingAnswer } = useDeleteCourseQuestionAnswer(courseId, questionId);
  const { mutate: patchAnswer, isPending: isPatchingAnswer } = usePatchCourseQuestionAnswerById(courseId, questionId);
  const { mutate: patchQuestion, isPending: isPatchingQuestion } = usePatchCourseQuestion();
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useDeleteCourseQuestion();

  const pagination = answersData?.pagination;
  const acceptedAnswerItem = Array.isArray(acceptedAnswer) ? acceptedAnswer[0] : acceptedAnswer;

  useEffect(() => {
    if (answersData?.items) {
      if (page === 1) {
        setAnswers(answersData.items);
      } else {
        setAnswers((prev) => {
          const existingIds = new Set(prev.map((a) => a.answerId));
          const newAnswers = answersData.items.filter((item: any) => !existingIds.has(item.answerId));
          return [...prev, ...newAnswers];
        });
      }
    }
  }, [answersData, page]);

  useEffect(() => {
    if (pagination) {
      setHasMore(page < pagination.totalPages);
    }
  }, [pagination, page]);

  const handleGenerateDraft = async () => {
    const userInput = answerContent.trim();
    if (!userInput) {
      toast.error('Please enter some text to generate a draft.');
      return;
    }

    setIsGeneratingDraft(true);
    try {
      const images = uploadedFiles.filter((f) => f.type.startsWith('image/'));

      const response = await generateAnswerDraft({
        course_id: courseId,
        query: userInput,
        has_attachment: images.length > 0,
        files: images.length > 0 ? images : undefined,
      });

      if (response.data?.answer_content) {
        setDraftPreview(response.data.answer_content);
      }
    } catch (error) {
      console.error('Failed to generate draft:', error);
      toast.error('Failed to generate AI draft.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleInsertDraft = () => {
    if (draftPreview) {
      setAnswerContent(draftPreview);
      setDraftPreview(null);
      toast.success('AI draft inserted.');
    }
  };

  const handleDismissDraft = () => {
    setDraftPreview(null);
  };

  const handleRetryDraft = () => {
    setDraftPreview(null);
    handleGenerateDraft();
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) return;

    const images = uploadedFiles.filter((f) => f.type.startsWith('image/'));
    const videoFile = uploadedFiles.find((f) => f.type.startsWith('video/')) ?? null;

    try {
      let videoUuid: string | undefined;

      if (videoFile) {
        videoUuid = await uploadVideo({ kind: 'ANSWER', file: videoFile });
      }

      postAnswer(
        {
          content: answerContent,
          videoUuid,
          attachments: images.length > 0 ? images : undefined,
        },
        {
          onSuccess: () => {
            setAnswerContent('');
            setUploadedFiles([]);
            setPage(1);
            setAnswers([]);
            setEditorKey((prev) => prev + 1);
          },
        },
      );
    } catch (e) {
      console.error('답변 비디오 업로드/등록 실패:', e);
      toast.error('Failed to upload video.');
    }
  };

  const handleLoadMore = () => {
    if (!isAnswersFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleUpdateAnswer = (
    answerId: number,
    content: string,
    files: File[],
    deleteAttachmentIds: number[],
    videoUuid?: string | null,
  ) => {
    patchAnswer({
      answerId,
      data: {
        content,
        attachments: files.length > 0 ? files : undefined,
        deleteFileIds: deleteAttachmentIds.length > 0 ? deleteAttachmentIds : undefined,
        videoUuid,
      },
    });
  };

  const handleAcceptAnswer = (answerId: number) => {
    setSelectedAnswerId(answerId);
    if (acceptedAnswerItem) {
      setCancelAcceptConfirmOpen(true);
      return;
    }

    setAcceptConfirmOpen(true);
  };

  const handleDeleteAnswer = (answerId: number) => {
    setSelectedAnswerId(answerId);
    setDeleteAnswerConfirmOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedAnswerId) return;

    toggleAcceptAnswer(selectedAnswerId, {
      onSuccess: () => {
        toast.success('Answer accepted successfully.');
        setAcceptConfirmOpen(false);
        setSelectedAnswerId(null);
      },
      onError: () => {
        toast.error('Failed to accept answer.');
      },
    });
  };

  const handleConfirmCancelAccept = () => {
    if (!selectedAnswerId) return;

    toggleAcceptAnswer(selectedAnswerId, {
      onSuccess: () => {
        toast.success('Answer acceptance canceled.');
        setCancelAcceptConfirmOpen(false);
        setSelectedAnswerId(null);
      },
      onError: () => {
        toast.error('Failed to cancel acceptance.');
      },
    });
  };

  const handleConfirmDeleteAnswer = () => {
    if (!selectedAnswerId) return;

    deleteAnswer(selectedAnswerId, {
      onSuccess: () => {
        setDeleteAnswerConfirmOpen(false);
        setSelectedAnswerId(null);
        setPage(1);
        setAnswers([]);
      },
    });
  };

  const handleOpenChangeAcceptConfirm = (nextOpen: boolean) => {
    setAcceptConfirmOpen(nextOpen);
    if (!nextOpen) setSelectedAnswerId(null);
  };

  const handleOpenChangeCancelAcceptConfirm = (nextOpen: boolean) => {
    setCancelAcceptConfirmOpen(nextOpen);
    if (!nextOpen) setSelectedAnswerId(null);
  };

  const handleOpenChangeDeleteAnswerConfirm = (nextOpen: boolean) => {
    setDeleteAnswerConfirmOpen(nextOpen);
    if (!nextOpen) setSelectedAnswerId(null);
  };

  const handleConfirmDeleteQuestion = () => {
    deleteQuestion(
      { courseId, questionId },
      {
        onSuccess: () => {
          setIsQuestionDeleteOpen(false);
          toast.success('Question deleted.');
          onBack();
        },
        onError: (error: any) => {
          console.error('질문 삭제 실패:', error);
          toast.error('Failed to delete question.');
        },
      },
    );
  };

  const startQuestionEdit = () => {
    if (!questionData) return;
    setQuestionTitle(questionData.title ?? '');
    setQuestionContent(getDisplayContent(questionData.content ?? ''));
    setQuestionExistingAttachments(questionData.attachments ?? []);
    setQuestionExistingVideo(questionData.videoInfo ? { originFileName: questionData.videoInfo.originFileName } : null);
    setQuestionAttachedFiles([]);
    setQuestionDeletedAttachmentIds([]);
    setQuestionEditorKey((prev) => prev + 1);
    setIsQuestionEditing(true);
  };

  const cancelQuestionEdit = () => {
    setIsQuestionEditing(false);
    setQuestionTitle('');
    setQuestionContent('');
    setQuestionAttachedFiles([]);
    setQuestionVideoFile(null);
    setQuestionExistingAttachments([]);
    setQuestionExistingVideo(null);
    setQuestionDeletedAttachmentIds([]);
    setQuestionEditorKey((prev) => prev + 1);
  };

  const handleQuestionFilesChange = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    const video = files.find((f) => f.type.startsWith('video/')) ?? null;
    setQuestionAttachedFiles(images);
    setQuestionVideoFile(video);
  };

  const handleRemoveQuestionExistingAttachment = (attachmentId: number) => {
    setQuestionExistingAttachments((prev) => prev.filter((file) => file.id !== attachmentId));
    setQuestionDeletedAttachmentIds((prev) => (prev.includes(attachmentId) ? prev : [...prev, attachmentId]));
  };

  const saveQuestionEdit = () => {
    const nextTitle = questionTitle.trim();
    const nextContent = questionContent.trim();
    if (!nextTitle || !nextContent) return;

    (async () => {
      try {
        let videoUuid: string | null;
        if (questionVideoFile) {
          // 새 비디오 업로드
          videoUuid = await uploadVideo({ kind: 'QUESTION', file: questionVideoFile });
        } else if (questionData?.videoInfo && !questionExistingVideo) {
          // 기존 비디오 삭제
          videoUuid = null;
        } else if (questionData?.videoInfo) {
          // 기존 비디오 유지
          videoUuid = questionData.videoInfo.videoUuid;
        } else {
          // 비디오 없음
          videoUuid = null;
        }

        patchQuestion(
          {
            courseId,
            questionId,
            data: {
              title: nextTitle,
              content: nextContent,
              videoUuid,
              attachments: questionAttachedFiles.length > 0 ? questionAttachedFiles : undefined,
              deleteFileIds: questionDeletedAttachmentIds.length > 0 ? questionDeletedAttachmentIds : undefined,
            },
          },
          {
            onSuccess: () => {
              toast.success('Question updated.');
              cancelQuestionEdit();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              console.error('질문 수정 실패:', error);
              toast.error('Failed to update question.');
            },
          },
        );
      } catch (e) {
        console.error('질문 비디오 업로드/수정 실패:', e);
        toast.error('Failed to upload video.');
      }
    })();
  };

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
  } = useGetCourseQuestion(courseId, questionId);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8" aria-label="Go back">
            <ChevronLeft className="size-6" />
          </Button>
          <p className="font-base text-lg">Question List</p>
        </div>

        <div className="flex items-center gap-2">
          {questionData?.courseName && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Content</Badge>
              <span className="text-muted-foreground text-sm">{questionData.courseName}</span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="overflow-y-auto">
        <div className="space-y-4 px-4">
          <div className="relative">
            {isQuestionEditing ? (
              <div className="space-y-4 rounded-sm border px-6 py-4">
                <div className="space-y-2">
                  <Input
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    disabled={isPatchingQuestion}
                  />
                </div>

                <div className="space-y-2">
                  <RichTextEditor
                    key={questionEditorKey}
                    value={questionContent}
                    onChange={setQuestionContent}
                    enableMention={true}
                    placeholder="Enter your question details..."
                    showSendButton={false}
                    showAttachButton={true}
                    onFilesChange={handleQuestionFilesChange}
                    existingAttachments={questionExistingAttachments}
                    onRemoveExistingAttachment={handleRemoveQuestionExistingAttachment}
                    existingVideo={questionExistingVideo}
                    onRemoveExistingVideo={() => setQuestionExistingVideo(null)}
                    isDisabled={isPatchingQuestion}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={cancelQuestionEdit} disabled={isPatchingQuestion}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveQuestionEdit} disabled={isPatchingQuestion}>
                    {isPatchingQuestion ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-sm border px-6 py-4">
                {(questionData?.status || (questionData?.user?.id && currentUserId === questionData.user.id)) && (
                  <div className="flex items-center justify-between">
                    <div>{questionData?.status && <QuestionLabel status={questionData.status} />}</div>
                    <div>
                      {questionData?.user?.id && currentUserId === questionData.user.id ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8" aria-label="Manage question">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={startQuestionEdit}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsQuestionDeleteOpen(true)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  </div>
                )}

                <QuestionDetail
                  questionData={questionData}
                  isLoading={isQuestionLoading}
                  isError={isQuestionError}
                  showStatus={false}
                  variant="plain"
                />
              </div>
            )}
          </div>

          {/* 답변 목록 */}
          {questionData && (
            <QuestionAnswers
              answers={answers}
              acceptedAnswer={acceptedAnswerItem}
              totalCount={pagination?.totalItems}
              currentUserId={currentUserId}
              questionAuthorId={questionData.user?.id}
              onAccept={handleAcceptAnswer}
              onUpdate={handleUpdateAnswer}
              onDelete={handleDeleteAnswer}
              isAccepting={isAccepting}
              acceptingAnswerId={selectedAnswerId}
              isUpdating={isPatchingAnswer}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              isLoadingMore={isAnswersFetching}
            />
          )}
        </div>
      </ScrollArea>

      <ConfirmModal
        open={acceptConfirmOpen}
        onOpenChange={handleOpenChangeAcceptConfirm}
        title="Accept Answer"
        description="Are you sure you want to accept this answer?"
        confirmText="Confirm"
        cancelText="Cancel"
        isConfirming={isAccepting}
        onConfirm={handleConfirmAccept}
      />

      <ConfirmModal
        open={cancelAcceptConfirmOpen}
        onOpenChange={handleOpenChangeCancelAcceptConfirm}
        title="Cancel Acceptance"
        description="Are you sure you want to cancel the acceptance?"
        confirmText="Confirm"
        cancelText="Cancel"
        isConfirming={isAccepting}
        onConfirm={handleConfirmCancelAccept}
      />

      <ConfirmModal
        open={deleteAnswerConfirmOpen}
        onOpenChange={handleOpenChangeDeleteAnswerConfirm}
        title="Delete Answer"
        description="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingAnswer}
        onConfirm={handleConfirmDeleteAnswer}
      />

      <ConfirmModal
        open={isQuestionDeleteOpen}
        onOpenChange={setIsQuestionDeleteOpen}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingQuestion}
        onConfirm={handleConfirmDeleteQuestion}
      />

      {/* 답변 작성 폼 */}
      <div className="bg-background sticky bottom-0 px-4 py-2">
        <div className="space-y-3">
          {draftPreview && (
            <div className="relative rounded-lg border border-[#b2f381]/50 bg-white p-4 dark:border-[#51a611]/50 dark:bg-gray-950">
              <div className="absolute -inset-0.5 rounded-lg bg-[#67d215] opacity-20 blur" />
              <div className="relative">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#67d215] dark:text-[#9bef5b]" />
                    <span className="text-sm font-semibold text-[#51a611] dark:text-[#9bef5b]">AI Draft Ready</span>
                  </div>
                </div>
                <div
                  className="mb-3 line-clamp-3 text-sm text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: draftPreview }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismissDraft}
                    className="border-[#b2f381]/50 dark:border-[#51a611]/50"
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetryDraft}
                    disabled={isGeneratingDraft}
                    className="border-[#b2f381]/50 dark:border-[#51a611]/50"
                  >
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInsertDraft}
                    className="bg-[#67d215] text-white shadow-lg shadow-[#67d215]/50 hover:bg-[#51a611]"
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          )}
          <RichTextEditor
            key={editorKey}
            value={answerContent}
            onChange={setAnswerContent}
            enableMention={true}
            placeholder="Please write your answer"
            onSend={handleSubmitAnswer}
            showSendButton={true}
            showAttachButton={true}
            showAiDraftButton={true}
            onGenerateDraft={handleGenerateDraft}
            isGeneratingDraft={isGeneratingDraft}
            onFilesChange={setUploadedFiles}
            isSending={isPosting}
          />
        </div>
      </div>
    </>
  );
}
