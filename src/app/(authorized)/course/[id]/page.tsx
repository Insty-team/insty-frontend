'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';
import { useGetCourseById, usePostCourseProgressById } from '@/shared/services/course/course.hook';
import dayjs from 'dayjs';
import {
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Hash,
  PlayCircle,
  Sparkles,
  Users,
  X,
  XCircle,
} from 'lucide-react';

function formatFileSize(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size % 1 === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[unitIndex]}`;
}

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const { data: course, isLoading, isError } = useGetCourseById(courseId);
  const { mutate: enrollCourse, isPending: isEnrolling } = usePostCourseProgressById(courseId);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const installEnvChecklist = useMemo(() => {
    if (!course?.installEnvChecklist) return [];
    return Array.isArray(course.installEnvChecklist) ? course.installEnvChecklist : [course.installEnvChecklist];
  }, [course?.installEnvChecklist]);

  const practiceFiles = useMemo(() => {
    if (!course?.practiceFile) return [];
    return Array.isArray(course.practiceFile) ? course.practiceFile : [course.practiceFile];
  }, [course?.practiceFile]);

  const keyPoints = useMemo(() => course?.keyPoints?.filter(Boolean) ?? [], [course?.keyPoints]);

  const handleEnroll = () => {
    if (!course) return;
    setEnrollError(null);
    enrollCourse(undefined, {
      onSuccess: () => {
        setIsEnrolled(true);
      },
      onError: () => {
        setEnrollError('수강 신청에 실패했습니다. 잠시 후 다시 시도해주세요.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-3">
          <Spinner className="size-6" />
          <p>강의 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">강의 정보를 찾을 수 없습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">주소를 다시 확인하거나 잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  const creatorInitial = course.creatorInfo.nickname?.[0] ?? 'I';

  return (
    <div className="container mx-auto flex flex-col gap-8 py-8">
      <div className="grid gap-12 lg:grid-cols-[7fr_3fr]">
        {/* 좌측: 썸네일 */}
        <div className="bg-muted relative h-full min-h-[500px] w-full overflow-hidden rounded-lg border">
          {course.thumbnailUrl ? (
            <Image src={course.thumbnailUrl} alt={course.title} fill priority className="object-contain" />
          ) : (
            <div className="text-muted-foreground flex h-full min-h-[500px] items-center justify-center">
              <PlayCircle className="size-16" />
            </div>
          )}
        </div>

        {/* 우측: 강의 정보들 */}
        <div className="flex flex-col gap-6">
          {/* 1. 강의 정보 */}
          <Card>
            <CardContent>
              <div className="mb-6">
                <h1 className="text-3xl leading-tight font-bold">{course.title}</h1>
                {course.description && (
                  <p className="text-muted-foreground mt-4 leading-relaxed">{course.description}</p>
                )}
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">등록일</p>
                  <p className="text-base font-semibold">{dayjs(course.createdAt).format('YYYY.MM.DD')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">가격</p>
                  <p className="text-primary text-base font-semibold">
                    {Intl.NumberFormat('ko-KR').format(course.price)}원
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={handleEnroll} disabled={isEnrolled || isEnrolling} className="gap-2">
                  {isEnrolling ? <Spinner className="size-5" /> : <PlayCircle className="size-5" />}
                  {isEnrolled ? '수강 중인 강의입니다' : '지금 수강 시작하기'}
                </Button>
                {practiceFiles.length > 0 && (
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <a href="#practice-files">실습 자료 보기</a>
                  </Button>
                )}
              </div>

              {enrollError && (
                <div className="bg-destructive/10 text-destructive mt-4 rounded-lg px-4 py-3 text-sm">
                  {enrollError}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. 설치 환경 요구사항 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">수강 준비</CardTitle>
              <CardDescription>수강 전 필요한 환경을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <Users className="text-primary size-4" />
                  추천 대상
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{course.targetAudience}</p>
              </div>

              <div>
                <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <Hash className="text-primary size-4" />
                  관련 태그
                </h3>
                {course.tags && course.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
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
              </div>

              <Separator />
              <div>
                <h3 className="text-foreground text-sm font-semibold">설치 환경 체크리스트</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {installEnvChecklist.length > 0 ? (
                    installEnvChecklist.map((req) => (
                      <Badge
                        key={req.content}
                        variant={req.isSupported ? 'default' : 'secondary'}
                        className={cn(
                          'flex items-center gap-1',
                          req.isSupported ? 'bg-primary-green-100 text-primary-green-800' : '',
                        )}
                      >
                        {req.content}
                        {req.isSupported ? <Check /> : <X />}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-sm">별도의 준비물이 필요하지 않습니다.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 핵심내용 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">이 강의에서 배울 내용</CardTitle>
              <CardDescription>핵심 포인트를 통해 강의 결과물을 미리 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {keyPoints.length > 0 ? (
                  keyPoints.map((content, index) => (
                    <li key={index} className="text-primary-green-800 flex items-center gap-2">
                      <span className="bg-primary-green-800 rounded-full p-1"></span>
                      <span className="font-medium">{content}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">등록된 핵심 포인트가 없습니다.</div>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* 4. 강사정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">강사 정보</CardTitle>
              <CardDescription>강의를 만든 크리에이터를 소개합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4">
                <Avatar className="size-16">
                  <AvatarImage alt={course.creatorInfo.nickname} />
                  <AvatarFallback className="text-lg font-semibold">{creatorInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">크리에이터</p>
                  <p className="text-lg font-semibold">{course.creatorInfo.nickname}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 실습 자료 */}
          <Card id="practice-files">
            <CardHeader>
              <CardTitle className="text-xl">실습 자료</CardTitle>
              <CardDescription>강의와 함께 제공되는 참고 자료를 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {practiceFiles.length > 0 ? (
                practiceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-muted-foreground size-5" />
                      <div>
                        <p className="leading-tight font-medium">{file.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {file.contentType} · {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="size-4" />
                        다운로드
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">제공된 실습 자료가 없습니다.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
