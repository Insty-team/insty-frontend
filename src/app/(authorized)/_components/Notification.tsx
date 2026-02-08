'use client';

import { Fragment } from 'react';

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
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 w-80">
        <DropdownMenuLabel>알림 ({unreadCount})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications && notifications.length > 0 ? (
          notifications?.map((notification) => {
            return (
              <Fragment key={notification.id}>
                <div className="max-h-96">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <p className="flex items-center gap-2 font-medium">
                      {!notification.isRead && <span className="bg-primary-green-600 size-2 rounded-full" />}
                      {notification.title}
                    </p>

                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <span className="text-muted-foreground text-xs">
                      {dayjs(notification.createdAt).format('YYYY.MM.DD HH:mm:ss')}
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
