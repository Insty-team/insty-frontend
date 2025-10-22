'use client';

import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Eye, MoreVertical, Plus, Star, Users } from 'lucide-react';

// 임시 데이터
const mockCourses = {
  published: [
    {
      id: 1,
      title: 'Next.js 완벽 가이드',
      status: 'published',
      students: 234,
      rating: 4.8,
      reviews: 89,
      price: 59000,
      revenue: 13806000,
    },
    {
      id: 2,
      title: 'React 기초부터 실전까지',
      status: 'published',
      students: 456,
      rating: 4.9,
      reviews: 167,
      price: 49000,
      revenue: 22344000,
    },
  ],
  draft: [
    {
      id: 3,
      title: 'TypeScript 마스터하기',
      status: 'draft',
      completionRate: 65,
    },
  ],
};

export default function CreatorCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">내 강의 관리</h2>
          <p className="text-muted-foreground mt-1">강의를 생성하고 관리하세요</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 강의 만들기
        </Button>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">전체 학생 수</p>
                <p className="mt-1 text-2xl font-bold">690명</p>
              </div>
              <Users className="text-muted-foreground h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">평균 평점</p>
                <p className="mt-1 text-2xl font-bold">4.85</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">총 수익</p>
                <p className="mt-1 text-2xl font-bold">3,615만원</p>
              </div>
              <Eye className="text-muted-foreground h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 강의 목록 */}
      <Tabs defaultValue="published" className="w-full">
        <TabsList>
          <TabsTrigger value="published">공개 강의 ({mockCourses.published.length})</TabsTrigger>
          <TabsTrigger value="draft">작성 중 ({mockCourses.draft.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6 space-y-4">
          {mockCourses.published.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-muted h-24 w-40 flex-shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge variant="secondary">공개중</Badge>
                        </div>
                        <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students}명
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {course.rating} ({course.reviews}개 리뷰)
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm">
                            판매가: <span className="font-semibold">{course.price.toLocaleString()}원</span>
                          </p>
                          <Separator orientation="vertical" className="h-4" />
                          <p className="text-sm">
                            총 수익:{' '}
                            <span className="font-semibold text-green-600">{course.revenue.toLocaleString()}원</span>
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>수정하기</DropdownMenuItem>
                          <DropdownMenuItem>통계 보기</DropdownMenuItem>
                          <DropdownMenuItem>미리보기</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">비공개 전환</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        수정하기
                      </Button>
                      <Button size="sm" variant="outline">
                        통계 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="mt-6 space-y-4">
          {mockCourses.draft.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-muted h-24 w-40 flex-shrink-0 rounded-lg" />
                  <div className="flex-1">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge variant="outline">작성 중</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">완성도: {course.completionRate}%</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>수정하기</DropdownMenuItem>
                          <DropdownMenuItem>미리보기</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">삭제</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm">이어서 작성</Button>
                      <Button size="sm" variant="outline">
                        미리보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
