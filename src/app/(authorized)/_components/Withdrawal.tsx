import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { useDeleteWithdraw } from '@/shared/services/user/user.hook';
import { toast } from 'sonner';

export default function Withdrawal() {
  const { mutateAsync: withdraw } = useDeleteWithdraw();
  const router = useRouter();

  const handleWithdraw = async () => {
    await withdraw().then(() => {
      toast.success('탈퇴가 완료되었습니다.');
      router.push('/login');
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="ml-auto block w-fit cursor-pointer text-sm text-gray-500 underline">회원 탈퇴</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다. <br />
            구매한 강의에 대한 접근 권한도 함께 사라집니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/70" onClick={handleWithdraw}>
            탈퇴하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
