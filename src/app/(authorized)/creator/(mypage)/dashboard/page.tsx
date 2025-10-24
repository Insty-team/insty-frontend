'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

// 임시 데이터
const stats = {
  thisMonth: {
    revenue: 2450000,
    students: 87,
    sales: 62,
    views: 3420,
  },
  lastMonth: {
    revenue: 1890000,
    students: 71,
    sales: 53,
    views: 2890,
  },
};

const recentSales = [
  { course: 'Next.js 완벽 가이드', student: '김*철', amount: 59000, date: '2025-10-21' },
  { course: 'React 기초부터 실전까지', student: '이*영', amount: 49000, date: '2025-10-21' },
  { course: 'Next.js 완벽 가이드', student: '박*수', amount: 59000, date: '2025-10-20' },
  { course: 'React 기초부터 실전까지', student: '최*미', amount: 49000, date: '2025-10-20' },
  { course: 'Next.js 완벽 가이드', student: '정*호', amount: 59000, date: '2025-10-19' },
];

const topCourses = [
  { name: 'React 기초부터 실전까지', sales: 34, revenue: 1666000, change: 12 },
  { name: 'Next.js 완벽 가이드', sales: 28, revenue: 1652000, change: -5 },
];

function calculateChange(current: number, previous: number) {
  return (((current - previous) / previous) * 100).toFixed(1);
}

export default function CreatorDashboard() {
  const revenueChange = calculateChange(stats.thisMonth.revenue, stats.lastMonth.revenue);
  const studentsChange = calculateChange(stats.thisMonth.students, stats.lastMonth.students);
  const salesChange = calculateChange(stats.thisMonth.sales, stats.lastMonth.sales);
  const viewsChange = calculateChange(stats.thisMonth.views, stats.lastMonth.views);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">판매 대시보드</h2>
        <p className="text-muted-foreground mt-1">강의 판매 현황을 한눈에 확인하세요</p>
      </div>

      {/* 기간 선택 탭 */}
      <Tabs defaultValue="month" className="w-full">
        <TabsList>
          <TabsTrigger value="week">이번 주</TabsTrigger>
          <TabsTrigger value="month">이번 달</TabsTrigger>
          <TabsTrigger value="year">올해</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-6 space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">총 수익</p>
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                </div>
                <p className="mb-1 text-2xl font-bold">{stats.thisMonth.revenue.toLocaleString()}원</p>
                <div className="flex items-center gap-1 text-sm">
                  {Number(revenueChange) > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">+{revenueChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">{revenueChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">vs 지난달</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">신규 학생</p>
                  <Users className="text-muted-foreground h-4 w-4" />
                </div>
                <p className="mb-1 text-2xl font-bold">{stats.thisMonth.students}명</p>
                <div className="flex items-center gap-1 text-sm">
                  {Number(studentsChange) > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">+{studentsChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">{studentsChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">vs 지난달</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">판매 건수</p>
                  <ShoppingCart className="text-muted-foreground h-4 w-4" />
                </div>
                <p className="mb-1 text-2xl font-bold">{stats.thisMonth.sales}건</p>
                <div className="flex items-center gap-1 text-sm">
                  {Number(salesChange) > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">+{salesChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">{salesChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">vs 지난달</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">페이지 조회</p>
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                </div>
                <p className="mb-1 text-2xl font-bold">{stats.thisMonth.views.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  {Number(viewsChange) > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">+{viewsChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">{viewsChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">vs 지난달</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 최근 판매 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 판매</CardTitle>
                <CardDescription>최근 5개의 강의 구매 내역</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale, idx) => (
                    <div key={idx}>
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{sale.course}</p>
                          <p className="text-muted-foreground text-sm">{sale.student}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="font-semibold">{sale.amount.toLocaleString()}원</p>
                          <p className="text-muted-foreground text-xs">{sale.date}</p>
                        </div>
                      </div>
                      {idx < recentSales.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  전체 판매 내역 보기
                </Button>
              </CardContent>
            </Card>

            {/* 인기 강의 */}
            <Card>
              <CardHeader>
                <CardTitle>인기 강의</CardTitle>
                <CardDescription>이번 달 가장 많이 팔린 강의</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course, idx) => (
                    <div key={idx}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Badge variant={idx === 0 ? 'default' : 'secondary'}>#{idx + 1}</Badge>
                            <p className="text-sm font-medium">{course.name}</p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {course.sales}건 · {course.revenue.toLocaleString()}원
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1 text-sm">
                          {course.change > 0 ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">+{course.change}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">{course.change}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      {idx < topCourses.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week">
          <p className="text-muted-foreground py-8 text-center">주간 통계 데이터</p>
        </TabsContent>

        <TabsContent value="year">
          <p className="text-muted-foreground py-8 text-center">연간 통계 데이터</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
