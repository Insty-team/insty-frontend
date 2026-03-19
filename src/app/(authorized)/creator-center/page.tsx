'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { useGetCoursesMy } from '@/shared/services/course/course.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  FileQuestion,
  MessageSquare,
  PlusCircle,
  Settings,
  TrendingUp,
  User,
  Video,
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    title: '강의 등록하기',
    description: '새로운 강의를 만들고 업로드하세요',
    href: '/creator/courses/new',
    icon: PlusCircle,
    accent: 'primary',
  },
  {
    title: '내 강의 관리',
    description: '등록한 강의를 편집하고 관리하세요',
    href: '/creator/courses',
    icon: Video,
    accent: 'default',
  },
  // {
  //   title: '판매 대시보드',
  //   description: '수익과 판매 현황을 확인하세요',
  //   href: '/creator/dashboard',
  //   icon: BarChart3,
  //   accent: 'default',
  // },
  {
    title: 'Q&A · 답변하기',
    description: '수강생 질문에 답변하세요',
    href: '/creator-center/qa',
    icon: FileQuestion,
    accent: 'default',
  },
  {
    title: '요청된 강의 확인',
    description: '학습자가 요청한 강의를 검토하세요',
    href: '/creator-center/course-requests',
    icon: MessageSquare,
    accent: 'default',
  },
  // {
  //   title: '계좌 정보',
  //   description: '정산 계좌를 설정하세요',
  //   href: '/creator/account',
  //   icon: CreditCard,
  //   accent: 'default',
  // },
  {
    title: '알림 설정',
    description: '알림 수신 설정을 관리하세요',
    href: '/creator/settings',
    icon: Bell,
    accent: 'default',
  },
] as const;

export default function CreatorCenterPage() {
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesMy({
    page: 1,
    pageSize: 5,
  });

  const courses = coursesData?.items ?? [];
  const totalCourses = coursesData?.pagination?.totalItems ?? 0;

  // 임시 요약 수치 (실제 API 연동 시 교체)
  const summary = {
    totalRevenue: 2450000,
    lastMonthRevenue: 1890000,
    monthlySales: 62,
    lastMonthSales: 53,
    pendingQuestions: 3,
    lastPendingQuestions: 2,
    requestedCourses: 2,
    lastRequestedCourses: 1,
  };

  const revenueChange = summary.lastMonthRevenue
    ? (((summary.totalRevenue - summary.lastMonthRevenue) / summary.lastMonthRevenue) * 100).toFixed(1)
    : null;
  const salesChange = summary.lastMonthSales
    ? (((summary.monthlySales - summary.lastMonthSales) / summary.lastMonthSales) * 100).toFixed(1)
    : null;

  return (
    <>
      {/* 환영 섹션 */}
      <section className="my-8">
        {profileLoading ? (
          <Skeleton className="h-16 w-64" />
        ) : (
          <h2 className="text-2xl font-bold">안녕하세요, {profile?.nickname ?? '크리에이터'}님 👋</h2>
        )}
        <p className="text-muted-foreground mt-1">오늘도 수강생들과 소통하며 성장하는 강의를 만들어보세요</p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 좌측 영역 (8) */}
        <div className="space-y-8 lg:col-span-8">
          {/* 요약 통계 카드 - 대시보드 스타일 */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm font-medium">등록 강의</p>
                {coursesLoading ? (
                  <Skeleton className="mb-2 h-8 w-20" />
                ) : (
                  <p className="text-primary-green-900 text-xl font-bold tracking-tight">{totalCourses}</p>
                )}
                <p className="text-muted-foreground mt-1 text-xs">전체 등록된 강의 수</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm font-medium">답변 대기</p>
                <p className="text-primary-green-900 text-xl font-bold tracking-tight">{summary.pendingQuestions}</p>
                <p className="text-muted-foreground mt-1 text-xs">Q&A 답변 필요</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm font-medium">강의 요청</p>
                <p className="text-primary-green-900 text-xl font-bold tracking-tight">{summary.requestedCourses}</p>
                <p className="text-muted-foreground mt-1 text-xs">검토 대기 중</p>
              </CardContent>
            </Card>
          </section>

          {/* 퀵 액션 */}
          <section>
            <h3 className="text-lg font-semibold">전체 메뉴</h3>
            <p className="text-muted-foreground mb-4 text-sm">자주 사용하는 메뉴로 빠르게 이동하세요</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isPrimary = action.accent === 'primary';
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={cn(
                      'group flex items-center gap-3.5 rounded-2xl border p-4 transition-all duration-150',
                      isPrimary
                        ? 'border-primary-green-200 bg-primary-green-50/80 hover:border-primary-green-300 hover:bg-primary-green-100/60'
                        : 'bg-card hover:bg-muted/50 hover:shadow-sm',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors',
                        isPrimary
                          ? 'bg-primary-green-600 shadow-primary-green-600/30 shadow-sm'
                          : 'bg-muted group-hover:bg-primary-green-100',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isPrimary ? 'text-white' : 'text-muted-foreground group-hover:text-primary-green-700',
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isPrimary ? 'text-primary-green-800' : 'text-foreground',
                        )}
                      >
                        {action.title}
                      </p>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">{action.description}</p>
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* 우측 영역 (4) — 최근 등록 강의 & 판매 요약 */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>최근 등록 강의</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/creator/courses">
                  전체 보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="text-muted-foreground mb-3 h-12 w-12" />
                  <p className="text-muted-foreground mb-2 text-sm">등록된 강의가 없습니다</p>
                  <Button asChild size="sm">
                    <Link href="/creator/courses/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      강의 등록하기
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {courses.slice(0, 4).map((course) => (
                    <li key={course.courseId}>
                      <Link
                        href={`/course/${course.courseId}`}
                        className="hover:bg-muted flex items-center justify-between rounded-lg p-3 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{course.title}</p>
                          <p className="text-muted-foreground text-xs">
                            조회 {course.viewCount.toLocaleString()} · {course.isShow ? '공개' : '비공개'}
                          </p>
                        </div>
                        <ArrowRight className="text-muted-foreground ml-2 h-4 w-4 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>판매 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-green-100 rounded-full p-2">
                      <TrendingUp className="text-primary-green-700 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">이번 달 판매</p>
                      <p className="text-lg font-semibold">{summary.monthlySales}건</p>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-green-50 flex items-center justify-between rounded-lg px-4 py-3">
                  <span className="text-muted-foreground text-sm">이번 달 수익</span>
                  <span className="text-primary-green-800 font-bold">{summary.totalRevenue.toLocaleString()}원</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/creator/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    상세 대시보드 보기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
