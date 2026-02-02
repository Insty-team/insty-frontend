'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
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
  DollarSign,
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
  {
    title: '판매 대시보드',
    description: '수익과 판매 현황을 확인하세요',
    href: '/creator/dashboard',
    icon: BarChart3,
    accent: 'default',
  },
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
  {
    title: '프로필 관리',
    description: '프로필 정보를 수정하세요',
    href: '/creator/profile',
    icon: User,
    accent: 'default',
  },
  {
    title: '계좌 정보',
    description: '정산 계좌를 설정하세요',
    href: '/creator/account',
    icon: CreditCard,
    accent: 'default',
  },
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
    <div className="space-y-8">
      {/* 환영 섹션 */}
      <section>
        {profileLoading ? (
          <Skeleton className="h-16 w-64" />
        ) : (
          <h2 className="text-2xl font-bold">안녕하세요, {profile?.nickname ?? '크리에이터'}님 👋</h2>
        )}
        <p className="text-muted-foreground mt-1">오늘도 수강생들과 소통하며 성장하는 강의를 만들어보세요</p>
      </section>

      {/* 요약 통계 카드 - 대시보드 스타일 */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-muted-foreground text-sm font-medium">등록 강의</p>
              <div className="bg-primary-green-200/80 rounded-lg p-2">
                <Video className="text-primary-green-800 h-4 w-4" />
              </div>
            </div>
            {coursesLoading ? (
              <Skeleton className="mb-2 h-8 w-20" />
            ) : (
              <p className="text-primary-green-900 text-2xl font-bold tracking-tight">{totalCourses}</p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">전체 등록된 강의 수</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-muted-foreground text-sm font-medium">총 수익</p>
              <div className="bg-primary-green-200/80 rounded-lg p-2">
                <DollarSign className="text-primary-green-800 h-4 w-4" />
              </div>
            </div>
            <p className="text-primary-green-900 text-2xl font-bold tracking-tight">
              {summary.totalRevenue.toLocaleString()}원
            </p>
            {revenueChange && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                {Number(revenueChange) >= 0 ? (
                  <>
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                    <span className="font-medium text-green-600">+{revenueChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
                    <span className="font-medium text-red-600">{revenueChange}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs 지난달</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-muted-foreground text-sm font-medium">답변 대기</p>
              <div className="rounded-lg bg-amber-100 p-2">
                <FileQuestion className="h-4 w-4 text-amber-700" />
              </div>
            </div>
            <p className="text-primary-green-900 text-2xl font-bold tracking-tight">{summary.pendingQuestions}</p>
            <p className="text-muted-foreground mt-1 text-xs">Q&A 답변 필요</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-muted-foreground text-sm font-medium">강의 요청</p>
              <div className="rounded-lg bg-blue-100 p-2">
                <MessageSquare className="h-4 w-4 text-blue-700" />
              </div>
            </div>
            <p className="text-primary-green-900 text-2xl font-bold tracking-tight">{summary.requestedCourses}</p>
            <p className="text-muted-foreground mt-1 text-xs">검토 대기 중</p>
          </CardContent>
        </Card>
      </section>

      {/* 퀵 액션 그리드 */}
      <section>
        <h3 className="text-lg font-semibold">바로가기</h3>
        <p className="text-muted-foreground mb-4 text-sm">자주 사용하는 메뉴로 빠르게 이동하세요</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card
                  className="hover:border-primary-green-300 hover:bg-primary-green-50/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                  role="button"
                  tabIndex={0}
                >
                  <CardHeader className="pb-2">
                    <div className="bg-primary-green-100 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon className="text-primary-green-700 h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-xs">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="text-primary-green-700 inline-flex items-center text-sm font-medium">
                      이동하기
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 최근 강의 & 판매 현황 */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>최근 등록 강의</CardTitle>
              <CardDescription>가장 최근에 등록한 강의 목록</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>판매 요약</CardTitle>
            <CardDescription>이번 달 판매 현황</CardDescription>
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
      </section>
    </div>
  );
}
