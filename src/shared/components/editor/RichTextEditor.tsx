'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';
import { GET_mention_search } from '@/shared/services/mention/mention.service';
import type { MentionSearchResponse } from '@/shared/services/mention/mention.type';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Film,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  Send,
  Sparkles,
  Strikethrough,
  Underline as UnderlineIcon,
  X,
} from 'lucide-react';
import tippy from 'tippy.js';

const MentionDropdown = forwardRef<
  { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
  { items: MentionSearchResponse[]; command: (item: { id: string; label: string }) => void }
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (!item) return;

    props.command({ id: String(item.id), label: item.nickname });
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (!props.items.length) return false;

      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  if (!props.items.length) return null;

  return (
    <div
      className="max-h-60 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 9999 }}
    >
      {props.items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
            index === selectedIndex && 'bg-gray-100 dark:bg-gray-800',
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            selectItem(index);
          }}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          {item.nickname}
        </button>
      ))}
    </div>
  );
});

MentionDropdown.displayName = 'MentionDropdown';

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
  readonly onTextLengthChange?: (length: number) => void;
  readonly placeholder?: string;
  readonly isDisabled?: boolean;
  readonly className?: string;
  readonly onSend?: () => void;
  readonly valueFormat?: 'html' | 'json';
  readonly showSendButton?: boolean;
  readonly sendButtonLabel?: string;
  readonly isSending?: boolean;
  readonly sendOnEnter?: boolean;
  readonly showAttachButton?: boolean;
  readonly maxImages?: number;
  readonly maxVideos?: number;
  readonly initialFiles?: File[];
  readonly onFilesChange?: (files: File[]) => void;
  readonly existingAttachments?: ExistingAttachment[];
  readonly onRemoveExistingAttachment?: (id: number) => void;
  readonly existingVideo?: ExistingVideo | null;
  readonly onRemoveExistingVideo?: () => void;
  readonly showAiDraftButton?: boolean;
  readonly onGenerateDraft?: () => void;
  readonly isGeneratingDraft?: boolean;
  readonly enableMention?: boolean;
};

// plain text를 안전한 HTML로 정규화(줄바꿈/특수문자 escape 포함)
function normalizeToHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) return value;

  const escaped = value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  return `<p>${escaped.replaceAll('\n', '<br />')}</p>`;
}

// valueFormat=json 일 때 editor content로 사용할 수 있는 JSON을 안전하게 파싱
function tryParseJson(value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export default function RichTextEditor({
  value,
  onChange,
  onTextLengthChange,
  placeholder,
  isDisabled,
  className,
  onSend,
  valueFormat = 'html',
  showSendButton = false,
  sendButtonLabel,
  isSending = false,
  sendOnEnter = false,
  showAttachButton = false,
  maxImages = 2,
  maxVideos = 1,
  initialFiles = [],
  onFilesChange,
  existingAttachments = [],
  onRemoveExistingAttachment,
  existingVideo = null,
  onRemoveExistingVideo,
  showAiDraftButton = false,
  onGenerateDraft,
  isGeneratingDraft = false,
  enableMention = false,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(() =>
    initialFiles.filter((f) => f.type.startsWith('image/')).slice(0, maxImages),
  );
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([]);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(() => {
    if (maxVideos <= 0) return null;
    return initialFiles.find((f) => f.type.startsWith('video/')) ?? null;
  });

  const remainingImageSlots = Math.max(0, maxImages - existingAttachments.length);

  // 업로드된 이미지 파일에 대한 미리보기 URL을 생성/정리
  useEffect(() => {
    const previews = uploadedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFilePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [uploadedFiles]);

  // 업로드 파일 상태(이미지/비디오)를 합쳐 부모로 전달
  useEffect(() => {
    const allFiles =
      uploadedFiles.length > 0 || uploadedVideoFile
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

  const jsonContent = useMemo(() => (valueFormat === 'json' ? tryParseJson(value) : null), [value, valueFormat]);
  const normalizedHtml = useMemo(() => (valueFormat === 'html' ? normalizeToHtml(value) : ''), [value, valueFormat]);
  const [isEmpty, setIsEmpty] = useState(true);

  // Tiptap 에디터 인스턴스 생성 및 업데이트 핸들링(onChange/onTextLengthChange)
  const editor = useEditor({
    immediatelyRender: false,
    editable: !isDisabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({ placeholder }),
      ...(enableMention
        ? [
          Mention.extend({
            addAttributes() {
              return {
                id: {
                  default: null,
                  parseHTML: (element) => element.getAttribute('data-id'),
                  renderHTML: (attributes) => {
                    if (!attributes.id) return {};
                    return { 'data-id': attributes.id };
                  },
                },
                label: {
                  default: null,
                  parseHTML: (element) => element.getAttribute('data-label'),
                  renderHTML: (attributes) => {
                    if (!attributes.label) return {};
                    return { 'data-label': attributes.label };
                  },
                },
              };
            },
          }).configure({
            HTMLAttributes: {
              class: 'mention',
              'data-type': 'mention',
            },
            renderLabel({ node }) {
              return `@${node.attrs.label}`;
            },
            suggestion: {
              char: '@',
              items: async ({ query }: { query: string }) => {
                if (!query || query.length < 1) return [];

                try {
                  const response = await GET_mention_search(query, 10);
                  return response.data || [];
                } catch (error) {
                  console.error('Failed to fetch mention users:', error);
                  return [];
                }
              },
              allowSpaces: false,
              render: () => {
                let component: ReactRenderer;
                let popup: any;

                return {
                  onStart: (props: any) => {
                    component = new ReactRenderer(MentionDropdown, {
                      props,
                      editor: props.editor,
                    });

                    popup = tippy('body', {
                      getReferenceClientRect: props.clientRect,
                      appendTo: () => document.body,
                      content: component.element,
                      showOnCreate: true,
                      interactive: true,
                      trigger: 'manual',
                      placement: 'bottom-start',
                      zIndex: 9999,
                      interactiveBorder: 30,
                      moveTransition: 'transform 0.2s ease-out',
                    });
                  },
                  onUpdate(props: any) {
                    component.updateProps(props);
                    popup[0].setProps({ getReferenceClientRect: props.clientRect });
                  },
                  onKeyDown(props: any) {
                    if (props.event.key === 'Escape') {
                      popup[0].hide();
                      return true;
                    }
                    return (
                      (
                        component.ref as { onKeyDown?: (keyProps: { event: KeyboardEvent }) => boolean } | null
                      )?.onKeyDown?.(props) ?? false
                    );
                  },
                  onExit() {
                    popup[0].destroy();
                    component.destroy();
                  },
                };
              },
            },
          }),
        ]
        : []),
    ],
    content: valueFormat === 'json' ? (jsonContent ?? normalizeToHtml(value)) : normalizedHtml,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();

      if (enableMention) {
        html = html.replace(/<span[^>]*class="mention"[^>]*>@([^<]*)<\/span>/g, (match) => {
          const idMatch = match.match(/data-id="([^"]*)"/);
          const labelMatch = match.match(/data-label="([^"]*)"/);
          if (idMatch && labelMatch) return `@[${labelMatch[1]}](${idMatch[1]})`;
          return match;
        });
      }

      onChange(valueFormat === 'json' ? JSON.stringify(editor.getJSON()) : html);
      onTextLengthChange?.(editor.getText().length);
      setIsEmpty(editor.getText().trim().length === 0);
    },
  });

  // 외부 value 변경을 에디터에 반영(valueFormat에 따라 HTML/JSON 처리)
  useEffect(() => {
    if (!editor) return;
    setIsEmpty(editor.getText().trim().length === 0);

    if (valueFormat === 'json') {
      if (jsonContent) editor.commands.setContent(jsonContent);
      else editor.commands.setContent(normalizeToHtml(value));
      return;
    }

    const next = normalizedHtml || '';
    if (editor.getHTML() !== next) editor.commands.setContent(next);
  }, [editor, normalizedHtml, value, valueFormat, jsonContent]);

  // disabled 변경 시 에디터 편집 가능 여부 동기화
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!isDisabled);
  }, [editor, isDisabled]);

  // 링크 삽입/수정 UI 처리(prompt로 URL 입력 후 link mark 적용)
  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL을 입력해주세요', previousUrl ?? '');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className={cn('bg-background rounded-lg border', className)}>
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-1 border-b px-1">
        <div className="flex flex-1 flex-wrap items-center gap-0">
          <Button
            type="button"
            variant={editor?.isActive('bold') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor || isDisabled}
          >
            <Bold className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('italic') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor || isDisabled}
          >
            <Italic className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('underline') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={!editor || isDisabled}
          >
            <UnderlineIcon className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('strike') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor || isDisabled}
          >
            <Strikethrough className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('code') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editor || isDisabled}
          >
            <Code className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('bulletList') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor || isDisabled}
          >
            <List className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('orderedList') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor || isDisabled}
          >
            <ListOrdered className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive('link') ? 'default' : 'ghost'}
            size="icon"
            className="size-7"
            onClick={setLink}
            disabled={!editor || isDisabled}
          >
            <Link2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 에디터 */}
      <div className="relative px-3 py-2">
        <ScrollArea className="max-h-[320px]">
          <EditorContent
            editor={editor}
            className={cn(
              'max-h-[300px] min-h-[60px] overflow-y-auto',
              'prose prose-sm max-w-none',
              '[&>.ProseMirror]:outline-none',
              '[&>.ProseMirror]:border-none',
              '[&_p]:my-1',
              '[&_ol]:my-1 [&_ul]:my-1',
              '[&_li]:my-0.5',
              (showSendButton || showAttachButton) && 'pb-12',
            )}
            onKeyDown={(e) => {
              if (!onSend || !sendOnEnter) return;
              if (e.key !== 'Enter' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
              e.preventDefault();
              onSend();
            }}
          />
        </ScrollArea>

        {/* 첨부 파일 미리보기*/}
        {(uploadedFilePreviews.length > 0 || uploadedVideoFile || existingAttachments.length > 0 || existingVideo) && (
          <div className="mb-8 space-y-2">
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
                        className="absolute top-1 right-1 rounded-full bg-white/90 p-1 shadow-sm transition-colors hover:bg-white"
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
                        className="absolute top-1 right-1 rounded-full bg-white/90 p-1 shadow-sm transition-colors hover:bg-white"
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
                  <Film className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground max-w-32 truncate text-xs">{uploadedVideoFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="bg-background/80 hover:bg-background ml-auto rounded-full p-0.5"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </div>
              </div>
            )}

            {existingVideo && !uploadedVideoFile && (
              <div className="relative rounded border p-2">
                <div className="flex items-center gap-2">
                  <Film className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground max-w-60 truncate text-xs">
                    {existingVideo.originFileName ?? existingVideo.name ?? 'Video'}
                  </span>
                  {onRemoveExistingVideo && (
                    <button
                      type="button"
                      onClick={onRemoveExistingVideo}
                      className="bg-background/80 hover:bg-background ml-auto rounded-full p-0.5"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {uploadErrorMessage && <p className="text-destructive text-xs">{uploadErrorMessage}</p>}
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className="bg-background absolute right-0 bottom-0 left-0 flex items-center justify-between rounded-b-lg px-3 py-2">
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
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="size-6" disabled={isDisabled}>
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
                    disabled={Boolean(uploadedVideoFile || existingVideo)}
                    className="gap-2 text-xs"
                  >
                    <Film className="size-3" />
                    Add Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {showAiDraftButton && onGenerateDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateDraft}
                disabled={isDisabled || isGeneratingDraft || isEmpty}
                className="h-6 gap-1.5 px-2 text-xs"
              >
                {isGeneratingDraft ? (
                  <>
                    <Spinner className="size-3" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3" />
                    Generate AI Draft
                  </>
                )}
              </Button>
            )}

            {showSendButton && (
              <Button
                type="button"
                size="icon"
                className="size-6"
                onClick={onSend}
                disabled={!onSend || isDisabled || isSending || isEmpty}
              >
                {isSending ? <Spinner className="size-3" /> : <Send className="size-3" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
