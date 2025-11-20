'use client';

import { Fragment } from 'react';

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
import { useGetNotificationsMe } from '@/shared/services/notification/notification.hook';
import dayjs from 'dayjs';
import { Bell } from 'lucide-react';

export default function Notification() {
  const { data: notifications } = useGetNotificationsMe();
  const unreadCount = notifications?.filter((notification) => !notification.isRead).length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>알림</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications && notifications.length > 0 ? (
          notifications?.map((Notification) => {
            return (
              <Fragment key={Notification.id}>
                <div className="max-h-96">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="font-medium">{Notification.title}</p>
                    <p className="text-muted-foreground text-xs">{Notification.message}</p>
                    <span className="text-muted-foreground text-xs">
                      {dayjs(Notification.createdAt).format('YYYY.MM.DD HH:mm:ss')}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
              </Fragment>
            );
          })
        ) : (
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-3" disabled>
            <p className="text-sm">알림이 없습니다.</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
