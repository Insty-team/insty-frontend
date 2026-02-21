'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

import Image from 'next/image';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';
import { usePostCommunityThoughtDraft } from '@/shared/services/ai-community/ai-community.hook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import {
  Film,
  ImagePlus,
  Plus,
  Send,
  X,
  Sparkles,
} from 'lucide-react';

type ExistingAttachment = {
  id: number;
  url: string;
  name?: string;
};

type ExistingVideo = {
  name?: string;
  originFileName?: string;
};

type Props = {
  readonly value: string;
  readonly onChange: (nextValue: string) => void;
  readonly placeholder?: string;
  readonly isDisabled?: boolean;
  readonly className?: string;
  readonly onSend?: () => void;
  readonly showSendButton?: boolean;
  readonly isSending?: boolean;
  readonly showAttachButton?: boolean;
  readonly maxImages?: number;
  readonly maxVideos?: number;
  readonly files?: File[];
  readonly onFilesChange?: (files: File[]) => void;
  readonly existingAttachments?: ExistingAttachment[];
  readonly onRemoveExistingAttachment?: (id: number) => void;
  readonly existingVideo?: ExistingVideo | null;
  readonly onRemoveExistingVideo?: () => void;
  readonly showAiAssistant?: boolean;
  readonly aiCourseId?: number;
};

export type CommunityTextAreaRef = {
  addFiles: (files: File[]) => void;
};

// 커뮤니티 글/댓글 입력용 텍스트 영역 컴포넌트(이미지/비디오 첨부, AI 초안 작성 기능 포함)
const CommunityTextArea = forwardRef<CommunityTextAreaRef, Props>(({
  value,
  onChange,
  placeholder = 'Write something...',
  isDisabled,
  className,
  onSend,
  showSendButton = false,
  isSending = false,
  showAttachButton = false,
  maxImages = 2,
  maxVideos = 1,
  files,
  onFilesChange,
  existingAttachments = [],
  onRemoveExistingAttachment,
  existingVideo,
  onRemoveExistingVideo,
  showAiAssistant = false,
  aiCourseId,
}, ref) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([]);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  
  // AI 초안 작성 관련 state
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  
  const { mutate: generateThoughtDraft, isPending: isGeneratingDraft } = usePostCommunityThoughtDraft();

  const remainingImageSlots = Math.max(0, maxImages - existingAttachments.length);

  // 부모 컴포넌트에서 ref로 파일을 주입(addFiles)할 수 있도록 imperative API를 제공
  useImperativeHandle(ref, () => ({
    // 외부에서 전달된 파일들을 현재 업로드 목록에 병합(이미지/비디오 분리 및 제한 적용)
    addFiles: (newFiles: File[]) => {
      const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
      const videoFiles = newFiles.filter(f => f.type.startsWith('video/'));
      
      if (imageFiles.length > 0) {
        setUploadedFiles((prev) => {
          const merged = [...prev, ...imageFiles];
          const limited = merged.slice(0, remainingImageSlots);
          setUploadErrorMessage(merged.length > remainingImageSlots ? `You can attach up to ${maxImages} images.` : '');
          return limited;
        });
      }
      if (videoFiles.length > 0 && !uploadedVideoFile) {
        setUploadedVideoFile(videoFiles[0]);
      }
    },
  }));

  // 업로드된 이미지 파일에 대한 미리보기 URL을 생성/정리
  useEffect(() => {
    const previews = uploadedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFilePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [uploadedFiles]);

  // 업로드 파일 상태(이미지/비디오)를 합쳐 부모로 전달
  useEffect(() => {
    const allFiles = uploadedFiles.length > 0 || uploadedVideoFile 
      ? [...uploadedFiles, ...(uploadedVideoFile ? [uploadedVideoFile] : [])]
      : [];
    onFilesChange?.(allFiles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles, uploadedVideoFile]);

  // 이미지 파일 업로드 처리(기존 첨부 포함 최대 개수 제한 적용)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadedFiles((prev) => {
      const merged = [...prev, ...Array.from(files)];
      const limited = merged.slice(0, remainingImageSlots);
      setUploadErrorMessage(merged.length > remainingImageSlots ? `You can attach up to ${maxImages} images.` : '');
      return limited;
    });

    e.target.value = '';
  };

  // 선택한 이미지 파일을 업로드 목록에서 제거
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadErrorMessage('');
  };

  // 비디오 파일 업로드 처리(1개만 허용)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedVideoFile(file);
    e.target.value = '';
  };

  // 업로드된 비디오 파일 제거
  const handleRemoveVideo = () => {
    setUploadedVideoFile(null);
  };

  // AI 초안 작성 패널 열기/닫기 및 관련 입력/결과 상태 초기화
  const handleToggleAiPanel = () => {
    setIsAiPanelExpanded(!isAiPanelExpanded);
    if (!isAiPanelExpanded) {
      setAiInput('');
      setAiFiles([]);
      setAiResult('');
      setAiError('');
    }
  };

  // AI 초안 생성 요청(텍스트 + 첨부 파일 전달)
  const handleGenerateAiContent = () => {
    if (!aiInput.trim() || !aiCourseId) return;
    
    setAiError('');
    setAiResult('');
    
    generateThoughtDraft(
      {
        course_id: aiCourseId,
        query: aiInput,
        has_attachment: aiFiles.length > 0,
        files: aiFiles.length > 0 ? aiFiles : undefined,
      },
      {
        onSuccess: (response) => {
          const { post_content } = response.data;
          setAiResult(post_content);
        },
        onError: () => {
          setAiError('Failed to generate content. Please try again.');
        },
      },
    );
  };

  // AI 생성 결과를 에디터에 적용(가능하면 첨부 이미지도 병합)
  const handleApplyAiResult = () => {
    if (!aiResult) return;
    
    onChange(aiResult);
    if (aiFiles.length > 0) {
      setUploadedFiles((prev) => {
        const imageFiles = aiFiles.filter((f) => f.type.startsWith('image/'));
        const merged = [...prev, ...imageFiles];
        const limited = merged.slice(0, remainingImageSlots);
        setUploadErrorMessage(merged.length > remainingImageSlots ? `You can attach up to ${maxImages} images.` : '');
        return limited;
      });
    }
    setIsAiPanelExpanded(false);
    setAiInput('');
    setAiFiles([]);
    setAiResult('');
  };

  const isEmpty = !value.trim();

  // Ctrl/Cmd + Enter로 전송(onSend) 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onSend) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={cn('bg-background rounded-lg border', className)}>
      <div className="relative">
        <div className="p-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
            style={{ height: 'auto', minHeight: '60px', maxHeight: '200px' }}
            className={cn(
              'w-full resize-none border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none p-0 shadow-none overflow-y-auto'
            )}
          />

          {(uploadedFilePreviews.length > 0 || uploadedVideoFile || existingAttachments.length > 0 || existingVideo) && (
            <div className="mt-3 space-y-2">
            {(existingAttachments.length > 0 || uploadedFiles.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {existingAttachments.map((attachment) => (
                  <div key={`existing-${attachment.id}`} className="relative inline-block">
                    <Image
                      src={attachment.url}
                      alt={attachment.name ?? 'Attachment'}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-20 w-auto rounded border object-contain"
                    />
                    {onRemoveExistingAttachment && (
                      <button
                        type="button"
                        onClick={() => onRemoveExistingAttachment(attachment.id)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 hover:bg-white shadow-sm transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-700" />
                      </button>
                    )}
                  </div>
                ))}
                {uploadedFiles.map((file, index) => {
                  const previewUrl = uploadedFilePreviews[index];
                  if (!previewUrl) return null;
                  
                  return (
                    <div key={`new-${index}`} className="relative inline-block">
                      <Image
                        src={previewUrl}
                        alt={`Uploaded ${index + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-20 w-auto rounded border object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 hover:bg-white shadow-sm transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-700" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {uploadedVideoFile && (
              <div className="relative rounded border p-2">
                <div className="flex items-center gap-2">
                  <Film className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {uploadedVideoFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="ml-auto rounded-full bg-background/80 p-0.5 hover:bg-background"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </div>
              </div>
            )}

            {existingVideo && !uploadedVideoFile && (
              <div className="relative rounded border p-2">
                <div className="flex items-center gap-2">
                  <Film className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate max-w-60">
                    {existingVideo.originFileName ?? existingVideo.name ?? 'Video'}
                  </span>
                  {onRemoveExistingVideo && (
                    <button
                      type="button"
                      onClick={onRemoveExistingVideo}
                      className="ml-auto rounded-full bg-background/80 p-0.5 hover:bg-background"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {uploadErrorMessage && (
              <p className="text-xs text-destructive">{uploadErrorMessage}</p>
            )}
          </div>
        )}
        </div>

        <div className={cn(
          "flex items-center justify-between bg-white dark:bg-background px-3 py-2",
          !showAiAssistant && "rounded-b-lg"
        )}>
          {showAttachButton && (
            <div className="flex items-center gap-1">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    disabled={isDisabled}
                  >
                    <Plus className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem
                    onClick={() => imageInputRef.current?.click()}
                    disabled={existingAttachments.length + uploadedFiles.length >= maxImages}
                    className="gap-2 text-xs"
                  >
                    <ImagePlus className="size-3" />
                    Add Image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => videoInputRef.current?.click()}
                    disabled={Boolean(uploadedVideoFile)}
                    className="gap-2 text-xs"
                  >
                    <Film className="size-3" />
                    Add Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {showSendButton && (
            <Button
              type="button"
              size="icon"
              className="size-6"
              onClick={onSend}
              disabled={!onSend || isDisabled || isSending || isEmpty}
            >
              <Send className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* AI 초안 작성 패널 */}
      {showAiAssistant && (
        <div className="bg-gradient-to-br from-[#e8fbd9] via-[#f6fdf1] to-[#e8fbd9] dark:from-[#244a08]/20 dark:via-[#244a08]/10 dark:to-[#244a08]/20 rounded-b-lg">
          {!isAiPanelExpanded ? (
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAiPanel}
                className="w-full gap-2 group hover:bg-[#d1f8b4]/30 dark:hover:bg-[#3b780c]/30 transition-all duration-300 rounded-lg"
              >
                <div className="relative">
                  <Sparkles className="h-4 w-4 text-[#67d215] dark:text-[#9bef5b] group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 blur-sm bg-[#67d215] opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <span className="text-[#51a611] dark:text-[#9bef5b] font-medium">
                  Help me organize my thoughts
                </span>
                <span className="ml-auto text-xs text-muted-foreground">(optional)</span>
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Sparkles className="h-5 w-5 text-[#67d215] dark:text-[#9bef5b] animate-pulse" />
                    <div className="absolute inset-0 blur-md bg-[#67d215] opacity-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#51a611] dark:text-[#9bef5b]">
                      AI Writing Assistant
                    </h3>
                    <p className="text-xs text-muted-foreground">Powered by AI</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-[#d1f8b4]/30 dark:hover:bg-[#3b780c]/30"
                  onClick={handleToggleAiPanel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* AI Input */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-[#67d215] rounded-xl opacity-20 blur" />
                <div className="relative">
                  <CommunityTextArea
                    value={aiInput}
                    onChange={setAiInput}
                    placeholder="What would you like to write about? (e.g., summarize today's lesson, questions, etc.)"
                    showSendButton={false}
                    showAttachButton={true}
                    onFilesChange={setAiFiles}
                    className="min-h-[80px] bg-white dark:bg-gray-950"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateAiContent}
                disabled={!aiInput.trim() || isGeneratingDraft}
                className="w-full gap-2 bg-[#67d215] hover:bg-[#51a611] text-white shadow-lg shadow-[#67d215]/50 dark:shadow-[#67d215]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#67d215]/60"
              >
                {isGeneratingDraft ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span className="font-medium">Generating magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Generate Draft</span>
                  </>
                )}
              </Button>

              {/* AI Result */}
              {aiResult && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-[#67d215] rounded-xl opacity-30 blur group-hover:opacity-40 transition-opacity" />
                    <div className="relative p-4 bg-white dark:bg-gray-950 rounded-lg border border-[#b2f381]/50 dark:border-[#51a611]/50">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-[#67d215] dark:text-[#9bef5b] mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-medium text-[#51a611] dark:text-[#9bef5b]">AI Generated Content</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleApplyAiResult}
                    variant="default"
                    className="w-full gap-2 bg-[#67d215] hover:bg-[#51a611] text-white shadow-lg shadow-[#67d215]/50 dark:shadow-[#67d215]/30 transition-all duration-300 hover:shadow-xl"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Apply to Editor</span>
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {aiError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{aiError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CommunityTextArea.displayName = 'CommunityTextArea';

export default CommunityTextArea;
