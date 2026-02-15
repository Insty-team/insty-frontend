'use client';

import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { useGetCommunityCourseRequests } from '@/shared/services/ai-community/ai-community.hook';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

const getStatusBadgeVariant = (status: string | null) => {
  if (!status) return 'outline';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return 'default';
    case 'COMPLETED':
      return 'default';
    case 'DECLINED':
      return 'destructive';
    case 'IGNORED':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string | null) => {
  if (!status) return '대기중';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return '수락됨';
    case 'COMPLETED':
      return '완료됨';
    case 'DECLINED':
      return '거절됨';
    case 'IGNORED':
      return '무시됨';
    default:
      return status;
  }
};

export default function LearnerCourseRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params.id);
  const { data: courseRequests, isLoading } = useGetCommunityCourseRequests();

  const courseRequest = courseRequests?.find((req) => req.request_id === requestId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">강의 요청 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!courseRequest) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="mb-2 text-lg font-semibold">강의 요청을 찾을 수 없습니다</p>
          <p className="text-muted-foreground mb-4">요청하신 강의 요청이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <Button variant="outline" onClick={() => router.push('/learner/course-request')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">강의 요청 상세</h2>
        <p className="text-muted-foreground mt-1">요청한 강의의 상세 정보를 확인하세요</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2">{courseRequest.title}</CardTitle>
              <CardDescription className="text-base">{courseRequest.description}</CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(courseRequest.action_status)} className="ml-4">
              {getStatusLabel(courseRequest.action_status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold">요청 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">요청 ID:</span>
                  <span className="font-medium">#{courseRequest.request_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">요청일:</span>
                  <span className="font-medium">
                    {dayjs(courseRequest.created_at).format('YYYY년 MM월 DD일 HH:mm')}
                  </span>
                </div>
                {courseRequest.action_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">처리일:</span>
                    <span className="font-medium">
                      {dayjs(courseRequest.action_at).format('YYYY년 MM월 DD일 HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">요청 상태:</span>
                  <span className="font-medium">{courseRequest.requests_status}</span>
                </div>
                {courseRequest.action_status && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">처리 상태:</span>
                    <Badge variant={getStatusBadgeVariant(courseRequest.action_status)} className="text-xs">
                      {getStatusLabel(courseRequest.action_status)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold">요청 내용</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">제목</p>
                  <p className="text-base">{courseRequest.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">상세 설명</p>
                  <p className="text-base whitespace-pre-wrap">{courseRequest.description}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          뒤로가기
        </Button>
      </div>
    </div>
  );
}
