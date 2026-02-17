'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useGetCourseCommunityPostById } from '@/shared/services/community/community.hook';
import { Attachment } from '@/shared/services/community/community.type';
import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import { useCommunity } from '@/shared/hooks/community/useCommunity';
import { toast } from 'sonner';

type CommunityUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
  postId: number;
  initialContent: string;
  onUpdated?: () => void;
};

export default function CommunityUpdateDialog({
  open,
  onOpenChange,
  courseId,
  postId,
  initialContent,
  onUpdated,
}: CommunityUpdateDialogProps) {
  const { updatePost, isUpdatingPost: isUpdating } = useCommunity({ courseId });
  const { data: postData } = useGetCourseCommunityPostById(courseId, postId, {
    enabled: open,
  });

  const [content, setContent] = useState(initialContent);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>([]);

  useEffect(() => {
    if (open && postData) {
      setContent(postData.content ?? initialContent);
      setExistingAttachments(postData.attachments ?? []);
      setAttachedFiles([]);
      setDeletedAttachmentIds([]);
    }
  }, [open, postData, initialContent]);

  const handleRemoveExistingAttachment = (attachmentId: number) => {
    setExistingAttachments((prev) => prev.filter((file) => file.id !== attachmentId));
    setDeletedAttachmentIds((prev) => (prev.includes(attachmentId) ? prev : [...prev, attachmentId]));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const derivedTitle = content.trim().split('\n')[0].substring(0, 50) || 'Updated Post';

    try {
      await updatePost(
        postId,
        {
          content: content.trim(),
          attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
          deleteFileIds: deletedAttachmentIds.length > 0 ? deletedAttachmentIds : undefined,
        },
        {
          onSuccess: () => {
            setContent('');
            setAttachedFiles([]);
            setExistingAttachments([]);
            setDeletedAttachmentIds([]);
            onUpdated?.();
            onOpenChange(false);
          },
        },
      );
    } catch (error: any) {
      console.error('커뮤니티 글 수정 실패:', error);
      toast.error('Failed to update post.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isUpdating && onOpenChange(next)}>
      <DialogContent className="max-h-[80vh] w-full max-w-4xl overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Community Post</DialogTitle>
          <DialogDescription>Update the content of your post.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Content</label>
            <CommunityTextArea
              value={content}
              onChange={setContent}
              onSend={handleSubmit}
              placeholder="Write your post content..."
              showSendButton={true}
              showAttachButton={true}
              isSending={isUpdating}
              onFilesChange={setAttachedFiles}
              existingAttachments={existingAttachments}
              onRemoveExistingAttachment={handleRemoveExistingAttachment}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
