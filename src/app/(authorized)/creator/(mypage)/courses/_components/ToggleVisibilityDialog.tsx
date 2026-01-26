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

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      // TODO: API 호출로 공개/비공개 상태 변경
      // await toggleCourseVisibility(courseId, !currentVisibility);

      // 임시로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('공개 상태 변경 실패:', error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsToggling(false);
    }
  };

  const newVisibility = !currentVisibility;
  const actionText = newVisibility ? 'Public' : 'Private';
  const actionDescription = newVisibility
    ? 'The lecture will be visible to all users.'
    : 'The lecture will be hidden from users.';

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
            Change Lecture Visibility to {actionText}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to change <strong>&quot;{courseTitle}&quot;</strong> to {actionText}?
            </p>
            <p className="text-muted-foreground text-sm">{actionDescription}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isToggling}>Cancel</AlertDialogCancel>
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
                Processing...
              </>
            ) : (
              <>
                {newVisibility ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                Change to {actionText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
