'use client';

import { FormEvent, useCallback, useRef, useState } from 'react';

import RichTextEditor from '@/shared/components/editor/RichTextEditor';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';
import usePresignedVideoUpload from '@/shared/hooks/video/usePresignedVideoUpload';
import { cn } from '@/shared/lib/utils';
import { usePostCommunityQuestionDraft } from '@/shared/services/ai-community/ai-community.hook';
import { usePostCourseQuestion } from '@/shared/services/course/course.hook';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

type Props = {
  readonly courseId: string;
  readonly onBack: () => void;
};

export default function WriteQuestionSheet({ courseId, onBack }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [contentTextLength, setContentTextLength] = useState(0);
  const [isDraftPreviewExpanded, setIsDraftPreviewExpanded] = useState(false);
  const [draftQuery, setDraftQuery] = useState('');
  // Step2(수정 폼)는 "Apply this draft"를 눌렀을 때만 열림
  // 초안을 다시 생성해도 Step2를 자동으로 열지 않고, Apply 카드가 먼저 보이도록 유지
  const [isQuestionRefinementFormVisible, setIsQuestionRefinementFormVisible] = useState(false);
  const [isStep1Collapsed, setIsStep1Collapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  // Step2를 열 때 에디터를 remount 해서, Step1에서 첨부한 파일이 Step2 에디터 UI 안에서 보이도록 합니다.
  const [refineEditorKey, setRefineEditorKey] = useState(0);
  const { mutate: generateQuestionDraft, isPending: isGeneratingDraft } = usePostCommunityQuestionDraft();
  const { mutate: submitQuestion, isPending: isSubmittingQuestion } = usePostCourseQuestion();
  const { uploadVideo } = usePresignedVideoUpload();

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDraftQuery(' ');
    setIsQuestionRefinementFormVisible(false);
    setIsDraftPreviewExpanded(false);
    setUploadedFiles([]);
    setUploadedVideoFile(null);
  };

  const handleApplyDraft = () => {
    setIsQuestionRefinementFormVisible(true);
    setRefineEditorKey((prev) => prev + 1);
  };

  const handleRegenerateDraft = () => {
    setTitle('');
    setContent('');
    setIsQuestionRefinementFormVisible(false);
    setIsDraftPreviewExpanded(false);
  };

  const handleDraftFilesChange = useCallback((files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    const videos = files.filter((f) => f.type.startsWith('video/'));
    setUploadedFiles(images);
    setUploadedVideoFile(videos[0] || null);
  }, []);

  const handleContentFilesChange = useCallback((files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    const videos = files.filter((f) => f.type.startsWith('video/'));
    setUploadedFiles(images);
    setUploadedVideoFile(videos[0] || null);
  }, []);

  const handleGenerateDraft = () => {
    if (!draftQuery.trim() || !courseId) return;
    // 초안 생성 전 Step2를 닫아두어, 사용자가 반드시 Apply를 눌러서 적용하도록 합니다.
    setIsQuestionRefinementFormVisible(false);
    const attachments =
      uploadedFiles.length > 0 || uploadedVideoFile
        ? [...uploadedFiles, ...(uploadedVideoFile ? [uploadedVideoFile] : [])]
        : [];
    generateQuestionDraft(
      {
        course_id: Number(courseId),
        query: draftQuery,
        has_attachment: attachments.length > 0,
        files: attachments,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setTitle(response.data.question_title);
            setContent(response.data.question_content);
            setIsDraftPreviewExpanded(false);
            // 초안 생성 후에도 Step2는 닫아두고, Apply 카드가 먼저 보이도록 합니다.
            setIsQuestionRefinementFormVisible(false);
          }
        },
        onError: (error) => {
          console.error('질문 초안 생성 실패:', error);
        },
      },
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseId || !title.trim() || !content.trim()) return;

    try {
      let videoUuid: string | undefined;

      if (uploadedVideoFile) {
        videoUuid = await uploadVideo({ kind: 'QUESTION', file: uploadedVideoFile });
      }

      // 질문 작성 요청은 attachments(이미지) + videoUuid(영상 uuid) 분리해서 전송합니다.
      submitQuestion(
        {
          courseId: Number(courseId),
          data: {
            title: title,
            content: content,
            videoUuid,
            attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
          },
        },
        {
          onSuccess: () => {
            resetForm();
            onBack();
          },
          onError: (error: any) => {
            console.error('질문 등록 실패:', error);
            if (error?.response?.status === 413) {
              alert('Content too large. Please reduce the file size or number of attachments.');
            } else {
              alert('Failed to submit question. Please try again.');
            }
          },
        },
      );
    } catch (error) {
      console.error('질문 비디오 업로드/등록 실패:', error);
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-shrink-0 items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8" aria-label="Go back">
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Write a Question</h2>
          <p className="text-muted-foreground text-sm">AI will generate a draft, then you can refine and submit it</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="h-full flex-1">
          <div className="space-y-6 pr-4 pb-4">
            <div className="bg-background rounded-xl border p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Sparkles className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Step 1. Generate AI Draft</h3>
                    <p className="text-muted-foreground text-xs">
                      Simply enter what you're curious about and AI will create a complete question for you
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStep1Collapsed(!isStep1Collapsed)}
                  className="size-8 shrink-0"
                >
                  {isStep1Collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                </Button>
              </div>
              {!isStep1Collapsed && (
                <div className="space-y-3">
                  <RichTextEditor
                    placeholder="e.g., I'm curious about the difference between staleTime and cacheTime in React Query"
                    value={draftQuery}
                    onChange={setDraftQuery}
                    valueFormat="json"
                    isDisabled={isGeneratingDraft}
                    showAttachButton={true}
                    maxImages={2}
                    onFilesChange={handleDraftFilesChange}
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateDraft}
                    disabled={!draftQuery.trim() || isGeneratingDraft}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isGeneratingDraft ? (
                      <>
                        <Spinner className="size-5" />
                        AI is writing your question...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        Generate Draft with AI
                      </>
                    )}
                  </Button>
                  {title && content && !isQuestionRefinementFormVisible && (
                    <div className="bg-background mt-4 space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="size-4 text-green-600" />
                          <span className="text-sm font-semibold">Draft generated successfully</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRegenerateDraft}
                          className="gap-1 text-xs"
                        >
                          <ArrowLeft className="size-3" />
                          Regenerate
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Title</p>
                          <p className="line-clamp-2 text-sm font-medium">{title}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Content</p>
                          <p className={cn('text-muted-foreground text-sm', !isDraftPreviewExpanded && 'line-clamp-3')}>
                            {content}
                          </p>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setIsDraftPreviewExpanded((prev) => !prev)}
                            >
                              {isDraftPreviewExpanded ? 'Show less' : 'Show more'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button type="button" onClick={handleApplyDraft} className="w-full gap-2" variant="default">
                        <Check className="size-4" />
                        Apply this draft
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isQuestionRefinementFormVisible && (
              <div className="space-y-4">
                <div className="bg-background rounded-xl border p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-green-500/10 p-2">
                      <Check className="size-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Step 2. Refine Your Question</h3>
                      <p className="text-muted-foreground text-xs">
                        Review the AI-generated question and make any necessary edits
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="question-title" className="text-sm font-semibold">
                        Title
                      </label>
                      <Input
                        id="question-title"
                        placeholder="Enter a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="question-content" className="text-sm font-semibold">
                        Content
                      </label>
                      <RichTextEditor
                        key={refineEditorKey}
                        value={content}
                        onChange={setContent}
                        onTextLengthChange={setContentTextLength}
                        placeholder="Enter your question content"
                        valueFormat="json"
                        showAttachButton={true}
                        maxImages={2}
                        maxVideos={1}
                        initialFiles={
                          uploadedFiles.length > 0 || uploadedVideoFile
                            ? [...uploadedFiles, ...(uploadedVideoFile ? [uploadedVideoFile] : [])]
                            : []
                        }
                        onFilesChange={handleContentFilesChange}
                      />
                      {contentTextLength > 0 && (
                        <p className="text-muted-foreground text-xs">{contentTextLength} characters</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-shrink-0 flex-row gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  resetForm();
                  onBack();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={!title.trim() || !content.trim() || isSubmittingQuestion || !isQuestionRefinementFormVisible}
              >
                {isSubmittingQuestion ? (
                  <>
                    <Spinner className="size-4" />
                    Submitting...
                  </>
                ) : (
                  'Submit Question'
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </form>
    </div>
  );
}
