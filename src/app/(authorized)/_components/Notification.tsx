'use client';

import Link from 'next/link';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

export default function Notification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>알림</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96">
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <p className="font-medium">새로운 강의가 업데이트되었습니다</p>
            <p className="text-muted-foreground text-xs">React 완전정복 강의에 새로운 섹션이 추가되었습니다</p>
            <span className="text-muted-foreground text-xs">2시간 전</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
            <p className="font-medium">질문에 답변이 달렸습니다</p>
            <p className="text-muted-foreground text-xs">&quot;useState 사용법&quot; 질문에 강사님이 답변하셨습니다</p>
            <span className="text-muted-foreground text-xs">5시간 전</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="text-primary w-full text-center">
            모든 알림 보기
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
