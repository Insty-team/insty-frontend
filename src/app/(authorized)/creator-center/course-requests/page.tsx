'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

// 임시 데이터 (실제 API 연동 시 useGetCommunityCourseRequests 등으로 교체)
const requestedCourses = [
  {
    id: 1,
    title: 'React 19 실전 프로젝트',
    description: 'React 19의 새로운 기능을 활용한 실전 프로젝트 강의를 만들어 주세요.',
    status: 'PENDING',
    requestedAt: '2025-11-22',
    requestCount: 12,
  },
  {
    id: 2,
    title: 'Next.js App Router 마스터',
    description: 'App Router 기반의 풀스택 앱 개발 강의 요청드립니다.',
    status: 'ACCEPTED',
    requestedAt: '2025-11-20',
    requestCount: 8,
  },
  {
    id: 3,
    title: 'TypeScript 고급 패턴',
    description: '제네릭, 유틸리티 타입 등 실무 활용 패턴 강의 요청합니다.',
    status: 'PENDING',
    requestedAt: '2025-11-18',
    requestCount: 5,
  },
];

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'ACCEPTED':
    case 'COMPLETED':
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          수락됨
        </Badge>
      );
    case 'DECLINED':
    case 'IGNORED':
      return (
        <Badge variant="secondary" className="gap-1">
          <XCircle className="h-3 w-3" />
          거절/무시
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          검토 대기
        </Badge>
      );
  }
};

export default function CreatorCourseRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">요청된 강의 확인</h2>
        <p className="text-muted-foreground mt-1">
          학습자가 요청한 강의 주제를 확인하고, 제작할 강의를 선택하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            강의 요청 목록
          </CardTitle>
          <CardDescription>
            커뮤니티에서 수강생들이 요청한 강의 주제입니다. 관심 있는 주제에 수락하고 강의를 제작해 보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-2">아직 요청된 강의가 없습니다</p>
              <p className="text-muted-foreground text-sm">수강생들이 강의를 요청하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requestedCourses.map((request) => (
                <article
                  key={request.id}
                  className="border-border rounded-xl border bg-card/60 p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{request.title}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm">{request.description}</p>
                      <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                        <span>요청일: {request.requestedAt}</span>
                        <span>요청 수: {request.requestCount}명</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {request.status === 'PENDING' && (
                        <>
                          <Button size="sm">수락하기</Button>
                          <Button size="sm" variant="outline">
                            거절
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/creator-center/course-requests/${request.id}`}>상세 보기</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
