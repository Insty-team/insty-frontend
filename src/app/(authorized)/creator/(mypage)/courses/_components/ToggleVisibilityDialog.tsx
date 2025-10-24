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
          <AlertDialogDescription className="space-y-2">
            <p>
              <strong>"{courseTitle}"</strong> 강의를 {actionText}로 전환하시겠습니까?
            </p>
            <p className="text-muted-foreground text-sm">{actionDescription}</p>
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
