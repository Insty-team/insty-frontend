'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
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
  Strikethrough,
  Underline as UnderlineIcon,
  X,
} from 'lucide-react';

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
  readonly onFilesChange?: (files: File[]) => void;
};

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
  onFilesChange,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([]);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const previews = uploadedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFilePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [uploadedFiles]);

  useEffect(() => {
    const allFiles = uploadedFiles.length > 0 || uploadedVideoFile 
      ? [...uploadedFiles, ...(uploadedVideoFile ? [uploadedVideoFile] : [])]
      : [];
    onFilesChange?.(allFiles);
  }, [uploadedFiles, uploadedVideoFile, onFilesChange]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadedFiles((prev) => {
      const merged = [...prev, ...Array.from(files)];
      const limited = merged.slice(0, maxImages);
      setUploadErrorMessage(merged.length > maxImages ? `You can attach up to ${maxImages} images.` : '');
      return limited;
    });

    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadErrorMessage('');
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedVideoFile(file);
    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setUploadedVideoFile(null);
  };

  const jsonContent = useMemo(() => (valueFormat === 'json' ? tryParseJson(value) : null), [value, valueFormat]);
  const normalizedHtml = useMemo(() => (valueFormat === 'html' ? normalizeToHtml(value) : ''), [value, valueFormat]);
  const [isEmpty, setIsEmpty] = useState(true);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isDisabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({ placeholder }),
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
      }),
    ],
    content: valueFormat === 'json' ? (jsonContent ?? normalizeToHtml(value)) : normalizedHtml,
    onUpdate: ({ editor }) => {
      onChange(valueFormat === 'json' ? JSON.stringify(editor.getJSON()) : editor.getHTML());
      onTextLengthChange?.(editor.getText().length);
      setIsEmpty(editor.getText().trim().length === 0);
    },
  });

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

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!isDisabled);
  }, [editor, isDisabled]);

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
    <div className={cn('bg-background rounded-xl border', className)}>
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
      <div className="relative px-3 py-3">
        <ScrollArea className="max-h-[320px]">
          <EditorContent
            editor={editor}
            className={cn(
              'prose prose-sm max-w-none',
              'min-h-[60px] overflow-y-auto rounded-md',
              '[&>.ProseMirror]:outline-none',
              '[&>.ProseMirror]:border-none',
              (showSendButton || showAttachButton) && 'pb-10',
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
        {(uploadedFilePreviews.length > 0 || uploadedVideoFile) && (
          <div className="mb-8 space-y-2">
            {uploadedFilePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {uploadedFilePreviews.map((preview, index) => (
                  <div key={index} className="relative h-16 w-16 overflow-hidden rounded border">
                    <Image
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 hover:bg-background"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
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
            
            {uploadErrorMessage && (
              <p className="text-xs text-destructive">{uploadErrorMessage}</p>
            )}
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
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
                    disabled={uploadedFiles.length >= maxImages}
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
    </div>
  );
}
