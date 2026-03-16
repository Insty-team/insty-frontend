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
  if (!status) return 'Pending';
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return 'Accepted';
    case 'COMPLETED':
      return 'Completed';
    case 'DECLINED':
      return 'Declined';
    case 'IGNORED':
      return 'Ignored';
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
          <p className="text-muted-foreground">Loading content request...</p>
        </div>
      </div>
    );
  }

  if (!courseRequest) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="mb-2 text-lg font-semibold">Content request not found</p>
          <p className="text-muted-foreground mb-4">The requested content request does not exist or has been deleted.</p>
          <Button variant="outline" onClick={() => router.push('/learner/course-request')}>
            Back to list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Content Request Detail</h2>
        <p className="text-muted-foreground mt-1">View the details of your content request</p>
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
              <h3 className="mb-2 text-sm font-semibold">Request Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Request ID:</span>
                  <span className="font-medium">#{courseRequest.request_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Requested:</span>
                  <span className="font-medium">
                    {dayjs(courseRequest.created_at).format('YYYY.MM.DD HH:mm')}
                  </span>
                </div>
                {courseRequest.action_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">Processed:</span>
                    <span className="font-medium">
                      {dayjs(courseRequest.action_at).format('YYYY.MM.DD HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{courseRequest.requests_status}</span>
                </div>
                {courseRequest.action_status && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Action:</span>
                    <Badge variant={getStatusBadgeVariant(courseRequest.action_status)} className="text-xs">
                      {getStatusLabel(courseRequest.action_status)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold">Request Content</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Title</p>
                  <p className="text-base">{courseRequest.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Description</p>
                  <p className="text-base whitespace-pre-wrap">{courseRequest.description}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push('/learner/course-request')}>
              Back to list
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
