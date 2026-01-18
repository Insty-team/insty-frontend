'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
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
} from 'lucide-react';

type ExistingAttachment = {
  id: number;
  url: string;
  name?: string;
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
  readonly onFilesChange?: (files: File[]) => void;
  readonly existingAttachments?: ExistingAttachment[];
  readonly onRemoveExistingAttachment?: (id: number) => void;
};

export default function CommunityTextArea({
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
  onFilesChange,
  existingAttachments = [],
  onRemoveExistingAttachment,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

  const isEmpty = !value.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onSend) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={cn('bg-background rounded-xl border', className)}>
      <div className="relative px-3 py-3">
        <ScrollArea className="max-h-[320px]">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-h-[60px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              (showSendButton || showAttachButton) && 'pb-10',
            )}
          />
        </ScrollArea>

        {(uploadedFilePreviews.length > 0 || uploadedVideoFile || existingAttachments.length > 0) && (
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
            
            {uploadErrorMessage && (
              <p className="text-xs text-destructive">{uploadErrorMessage}</p>
            )}
          </div>
        )}

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
