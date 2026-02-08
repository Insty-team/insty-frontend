'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { useDeleteCourseById } from '@/shared/services/course/course.hook';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteCourseDialogProps {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteCourseDialog({ courseId, courseTitle, isOpen, onClose, onSuccess }: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCourseMutation = useDeleteCourseById(courseId);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCourseMutation.mutateAsync();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('강의 삭제 실패:', error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="text-destructive h-5 w-5" />
            강의 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              <strong>"{courseTitle}"</strong> 강의를 삭제하시겠습니까?
            </p>
            <p className="text-muted-foreground text-sm">
              이 작업은 되돌릴 수 없습니다. 강의와 관련된 모든 데이터가 영구적으로 삭제됩니다.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                삭제 중...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
