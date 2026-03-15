import { useState } from 'react';

import ConfirmModal from '@/shared/components/ConfirmModal';
import RichTextEditor from '@/shared/components/editor/RichTextEditor';
import { QuestionAnswers, QuestionDetail, QuestionLabel } from '@/shared/components/question';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
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
  useGetCourseQuestionAnswersInfinite,
  usePatchCourseQuestion,
  usePatchCourseQuestionAnswerById,
  usePostCourseQuestionAnswer,
  usePostCourseQuestionAnswerAccept,
} from '@/shared/services/course/course.hook';
import type { Attachment } from '@/shared/services/course/course.type';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { MoreHorizontal } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type QuestionDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
  questionId: number;
};

export default function QuestionDetailDialog({ open, onOpenChange, courseId, questionId }: QuestionDetailDialogProps) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;

  const [answerContent, setAnswerContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftPreview, setDraftPreview] = useState<string | null>(null);

  const [deletingAnswerId, setDeletingAnswerId] = useState<number | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false);
  const [cancelAcceptConfirmOpen, setCancelAcceptConfirmOpen] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

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

  const { data: question } = useGetCourseQuestion(courseId, questionId, {
    enabled: open,
  });

  const pageSize = 10;

  const {
    data: answersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseQuestionAnswersInfinite(courseId, questionId, pageSize);

  const { data: acceptedAnswerData } = useGetCourseQuestionAnswerAccepted(courseId, questionId);
  const { mutate: acceptAnswer, isPending: isAccepting } = usePostCourseQuestionAnswerAccept(courseId, questionId);

  const { mutate: deleteAnswer, isPending: isDeleting } = useDeleteCourseQuestionAnswer(courseId, questionId);
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useDeleteCourseQuestion();
  const { mutate: patchAnswer, isPending: isPatching } = usePatchCourseQuestionAnswerById(courseId, questionId);
  const { mutate: patchQuestion, isPending: isPatchingQuestion } = usePatchCourseQuestion();
  const { mutate: postAnswer, isPending: isPosting } = usePostCourseQuestionAnswer(courseId, questionId);
  const { uploadVideo } = usePresignedVideoUpload();
  const { mutateAsync: generateAnswerDraft } = usePostCommunityAnswerDraft();

  const allAnswers = answersData?.pages.flatMap((page) => page.items) ?? [];
  const firstPagePagination = answersData?.pages[0]?.pagination;
  const acceptedAnswerItem = Array.isArray(acceptedAnswerData) ? acceptedAnswerData[0] : acceptedAnswerData;
  const questionAuthorId = question?.user?.id;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
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

  const handleDeleteAnswer = (answerId: number) => {
    setDeletingAnswerId(answerId);
    setAlertOpen(true);
  };

  const handleAcceptAnswer = (answerId: number) => {
    setSelectedAnswerId(answerId);
    if (acceptedAnswerItem) {
      setCancelAcceptConfirmOpen(true);
      return;
    }
    setAcceptConfirmOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedAnswerId) return;

    acceptAnswer(selectedAnswerId, {
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

    acceptAnswer(selectedAnswerId, {
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

  const confirmDelete = () => {
    if (!deletingAnswerId) return;
    deleteAnswer(deletingAnswerId, {
      onSuccess: () => {
        setAlertOpen(false);
        setDeletingAnswerId(null);
      },
    });
  };

  const handleConfirmDeleteQuestion = () => {
    deleteQuestion(
      { courseId, questionId },
      {
        onSuccess: () => {
          toast.success('Question deleted.');
          setIsQuestionDeleteOpen(false);
          onOpenChange(false);
        },
        onError: (error: any) => {
          console.error('질문 삭제 실패:', error);
          toast.error('Failed to delete question.');
        },
      },
    );
  };

  const startQuestionEdit = () => {
    if (!question) return;
    setQuestionTitle(question.title ?? '');
    setQuestionContent(getDisplayContent(question.content ?? ''));
    setQuestionExistingAttachments(question.attachments ?? []);
    setQuestionExistingVideo(question.videoInfo ? { originFileName: question.videoInfo.originFileName } : null);
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

  const saveQuestionEdit = async () => {
    const nextTitle = questionTitle.trim();
    const nextContent = questionContent.trim();
    if (!nextTitle || !nextContent) return;

    try {
      let videoUuid: string | null;
      if (questionVideoFile) {
        // 새 비디오 업로드
        videoUuid = await uploadVideo({ kind: 'QUESTION', file: questionVideoFile });
      } else if (question?.videoInfo && !questionExistingVideo) {
        // 기존 비디오 삭제
        videoUuid = null;
      } else if (question?.videoInfo) {
        // 기존 비디오 유지
        videoUuid = question.videoInfo.videoUuid;
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
  };

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
            setEditorKey((prev) => prev + 1);
          },
        },
      );
    } catch (e) {
      console.error('답변 비디오 업로드/등록 실패:', e);
      toast.error('Failed to upload video.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden p-0 sm:max-w-4xl">
        <div className="px-12 pt-6 pb-3">
          <DialogHeader className="mb-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-left text-xl">Question Details</DialogTitle>
              <div className="flex items-center gap-2">
                {question?.courseId && question?.courseName && (
                  <a
                    href={`/course/${question.courseId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Badge variant="secondary">Content</Badge>
                    <span className="text-muted-foreground text-sm underline-offset-2 hover:underline">
                      {question.courseName}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto px-12" style={{ maxHeight: 'calc(80vh - 300px)' }}>
          <div className="space-y-4 pr-4">
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
                {(question?.status || (question?.user?.id && currentUserId === question.user.id)) && (
                  <div className="flex items-center justify-between">
                    <div>{question?.status && <QuestionLabel status={question.status} />}</div>
                    <div>
                      {question?.user?.id && currentUserId === question.user.id ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8" aria-label="Manage question">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={startQuestionEdit}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setIsQuestionDeleteOpen(true)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  </div>
                )}

                <QuestionDetail questionData={question} showStatus={false} variant="plain" />
              </div>
            )}

            <QuestionAnswers
              answers={allAnswers}
              acceptedAnswer={acceptedAnswerItem}
              totalCount={firstPagePagination?.totalItems}
              currentUserId={currentUserId}
              questionAuthorId={questionAuthorId}
              onAccept={handleAcceptAnswer}
              onUpdate={handleUpdateAnswer}
              onDelete={handleDeleteAnswer}
              isAccepting={isAccepting}
              acceptingAnswerId={selectedAnswerId}
              isUpdating={isPatching}
              hasMore={hasNextPage}
              onLoadMore={handleLoadMore}
              isLoadingMore={isFetchingNextPage}
            />
          </div>
        </ScrollArea>

        <div className="bg-background px-12 pt-3 pb-6">
          {draftPreview && (
            <div className="relative mb-3 rounded-lg border border-[#b2f381]/50 bg-white p-4 dark:border-[#51a611]/50 dark:bg-gray-950">
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
      </DialogContent>

      {/* 답변 삭제 모달 */}
      <ConfirmModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete Answer?"
        description="This action cannot be undone. Are you sure you want to delete this answer?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
      />

      {/* 답변 채택 확인 모달 */}
      <ConfirmModal
        open={acceptConfirmOpen}
        onOpenChange={setAcceptConfirmOpen}
        title="Accept Answer"
        description="Are you sure you want to accept this answer?"
        confirmText="Confirm"
        cancelText="Cancel"
        isConfirming={isAccepting}
        onConfirm={handleConfirmAccept}
      />

      {/* 답변 채택 취소 확인 모달 */}
      <ConfirmModal
        open={cancelAcceptConfirmOpen}
        onOpenChange={setCancelAcceptConfirmOpen}
        title="Cancel Acceptance"
        description="Are you sure you want to cancel the acceptance?"
        confirmText="Confirm"
        cancelText="Cancel"
        isConfirming={isAccepting}
        onConfirm={handleConfirmCancelAccept}
      />

      {/* 질문 삭제 모달 */}
      <ConfirmModal
        open={isQuestionDeleteOpen}
        onOpenChange={setIsQuestionDeleteOpen}
        title="Delete Question?"
        description="This action cannot be undone. Are you sure you want to delete this question?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isConfirming={isDeletingQuestion}
        onConfirm={handleConfirmDeleteQuestion}
      />
    </Dialog>
  );
}
