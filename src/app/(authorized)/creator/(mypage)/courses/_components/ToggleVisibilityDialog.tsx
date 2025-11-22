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
import { usePutCourseVisibleById } from '@/shared/services/course/course.hook';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface ToggleVisibilityDialogProps {
  courseId: string;
  courseTitle: string;
  currentVisibility: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ToggleVisibilityDialog({
  courseId,
  courseTitle,
  currentVisibility,
  isOpen,
  onClose,
  onSuccess,
}: ToggleVisibilityDialogProps) {
  const [isToggling, setIsToggling] = useState(false);

  const { mutateAsync: putCourseVisible } = usePutCourseVisibleById(courseId);

  const handleToggle = async () => {
    try {
      setIsToggling(true);

      await putCourseVisible(!currentVisibility);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('공개 상태 변경 실패:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const newVisibility = !currentVisibility;
  const actionText = newVisibility ? '공개' : '비공개';
  const actionDescription = newVisibility
    ? '강의가 공개되어 모든 사용자가 볼 수 있게 됩니다.'
    : '강의가 비공개되어 사용자들이 볼 수 없게 됩니다.';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {newVisibility ? (
              <Eye className="h-5 w-5 text-green-600" />
            ) : (
              <EyeOff className="h-5 w-5 text-orange-600" />
            )}
            강의 {actionText} 전환
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            <span>
              <strong>"{courseTitle}"</strong> 강의를 {actionText}로 전환하시겠습니까?
            </span>
            <span className="text-muted-foreground text-sm">{actionDescription}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isToggling}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            disabled={isToggling}
            className={
              newVisibility
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }
          >
            {isToggling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                {newVisibility ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {actionText}로 전환
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
