'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import { Calendar, DollarSign, Eye, MessageCircle, Star, TrendingUp, Users } from 'lucide-react';

interface CourseStatsProps {
  courses: CourseMyResponse[];
}

export function CourseStats({ courses }: CourseStatsProps) {
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.isShow).length,
    draftCourses: courses.filter((course) => !course.isShow).length,
    totalViews: courses.reduce((sum, course) => sum + course.viewCount, 0),
    totalComments: courses.reduce((sum, course) => sum + course.commentCount, 0),
    totalRevenue: courses.reduce((sum, course) => sum + course.price, 0),
    averageViews:
      courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + course.viewCount, 0) / courses.length) : 0,
    averageComments:
      courses.length > 0
        ? Math.round(courses.reduce((sum, course) => sum + course.commentCount, 0) / courses.length)
        : 0,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    }
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* 전체 강의 수 */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">전체 강의</p>
              <p className="mt-1 text-2xl font-bold">{stats.totalCourses}개</p>
              <p className="text-muted-foreground mt-1 text-xs">
                공개 {stats.publishedCourses}개 • 비공개 {stats.draftCourses}개
              </p>
            </div>
            <TrendingUp className="text-muted-foreground size-8" />
          </div>
        </CardContent>
      </Card>

      {/* 총 조회수 */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">총 조회수</p>
              <p className="mt-1 text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
              <p className="text-muted-foreground mt-1 text-xs">평균 {formatNumber(stats.averageViews)}회</p>
            </div>
            <Eye className="text-muted-foreground size-8" />
          </div>
        </CardContent>
      </Card>

      {/* 총 댓글 수 */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">총 댓글</p>
              <p className="mt-1 text-2xl font-bold">{formatNumber(stats.totalComments)}개</p>
              <p className="text-muted-foreground mt-1 text-xs">평균 {formatNumber(stats.averageComments)}개</p>
            </div>
            <MessageCircle className="text-muted-foreground size-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
