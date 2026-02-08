'use client';

import Image from 'next/image';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Separator } from '@/shared/components/ui/separator';
import { cn, formatViewCount } from '@/shared/lib/utils';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import dayjs from 'dayjs';
import { BarChart3, Calendar, Edit, Eye, EyeOff, MessageCircle, MoreVertical, Play, Trash2 } from 'lucide-react';

interface CourseCardProps {
  course: CourseMyResponse;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onViewStats?: (courseId: string) => void;
  onToggleVisibility?: (courseId: string) => void;
}

export function CourseCard({ course, onEdit, onDelete, onViewStats, onToggleVisibility }: CourseCardProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardContent>
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* Thumbnail */}
          <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-48">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-contain transition-transform duration-200"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Play className="text-muted-foreground h-8 w-8" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge
                variant="default"
                className={cn(
                  'text-xs',
                  course.isShow ? 'bg-primary-green-100 text-primary-green-800' : 'bg-orange-100 text-orange-800',
                )}
              >
                {course.isShow ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>

          {/* Course Information */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors">{course.title}</h3>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {course.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary-green-100 text-primary-green-800 border-primary-green-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Statistics */}
                <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatViewCount(course.viewCount)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {course.commentCount} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {dayjs(course.createdAt).format('YYYY.MM.DD')}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Price:</span>
                  <span className="text-lg font-semibold">₩{Intl.NumberFormat('ko-KR').format(course.price)}</span>
                </div>
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(course.courseId)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewStats?.(course.courseId)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Stats
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewStats?.(course.courseId)}>
                    <Play className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleVisibility?.(course.courseId)}>
                    {course.isShow ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    Toggle Visibility
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(course.courseId)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="text-destructive mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
