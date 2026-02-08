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
  const actionText = newVisibility ? 'Public' : 'Private';
  const actionDescription = newVisibility
    ? 'The contents will be visible to all users.'
    : 'The contents will be hidden from users.';

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
            Change Contents Visibility to {actionText}
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
