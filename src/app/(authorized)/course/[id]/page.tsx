'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

import { useParams } from 'next/navigation';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Spinner } from '@/shared/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import {
  useGetCourseById,
  useGetCourseProgressExistsById,
  usePostCourseProgressById,
} from '@/shared/services/course/course.hook';
import { usePostVideoPlaylist } from '@/shared/services/video/video.hook';
import { GET_video_playlist_by_signed_url } from '@/shared/services/video/video.service';
import { Check, Download, FileText, GraduationCap, Hash, PlayCircle, Users, X } from 'lucide-react';

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

const qaHistory = [
  {
    id: 'qa-1',
    courseTitle: 'React 서버 컴포넌트 심화',
    question: 'use server에서 클라이언트 상태를 어떻게 관리하나요?',
    answerSnippet:
      'React 19에서는 서버 데이터를 선물아도, 클라이언트 상태는 use client 컴포넌트에서 useState/유효한 store로 분리하면 됩니다.',
    status: '답변 완료',
    answeredAt: '2025년 11월 22일',
  },
  {
    id: 'qa-2',
    courseTitle: 'Next.js 성능 최적화',
    question: 'prefetch와 use client 경계 처리는 어떻게 정하는 게 좋을까요?',
    answerSnippet:
      '기본은 서버 컴포넌트로 두고, prefetch가 필요한 interactive 내는 use client로 따로 묶어서 필요한 시점에만 상태를 관리하세요.',
    status: '답변 중',
    answeredAt: '2025년 11월 24일',
  },
  {
    id: 'qa-3',
    courseTitle: '테스트 자동화',
    question: 'React Query의 isFetching과 isLoading을 같이 쓰는 팁이 있을까요?',
    answerSnippet: '전자는 백그라운드 갱신, 후자는 첫 로딩이므로 버튼 disable 등 UI 영향 구분해서 쓰면 됩니다.',
    status: '일시 보류',
    answeredAt: '2025년 11월 20일',
  },
];

const communityComments = [
  {
    id: 'community-1',
    courseTitle: 'TypeScript 완전정복',
    content: '함께 복습할 모각코 파트너 구합니다! 마음 맞으신 분 DM 주세요.',
    author: '수강생 김하나',
    postedAt: '2시간 전',
    likes: 8,
    replies: 3,
  },
  {
    id: 'community-2',
    courseTitle: 'AI 기반 콘텐츠 제작',
    content: '이번 챕터에서 추천해준 생성형 프롬프트 템플릿 잘 써먹고 있어요.',
    author: '수강생 정민우',
    postedAt: '어제',
    likes: 12,
    replies: 5,
  },
  {
    id: 'community-3',
    courseTitle: 'Next.js 마스터',
    content: '코드 리뷰 파트에서 사용한 디렉토리 구조로 시작해도 될까요?',
    author: '수강생 박유진',
    postedAt: '2025년 11월 24일',
    likes: 4,
    replies: 1,
  },
];

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const [videoPlaylistUrl, setVideoPlaylistUrl] = useState<string | null>(null);
  const [isFetchingVideoUrl, setIsFetchingVideoUrl] = useState(false);
  const { data: course, isLoading, isError } = useGetCourseById(courseId);
  const { mutate: enrollCourse, isPending: isEnrolling } = usePostCourseProgressById(courseId);
  const { data: isCourseProgressExists, isError: isCourseProgressExistsError } =
    useGetCourseProgressExistsById(courseId);
  const {
    mutate: postVideoPlaylist,
    data: videoPlaylistResponse,
    isPending: isVideoPlaylistLoading,
  } = usePostVideoPlaylist();

  const installEnvChecklist = useMemo(() => {
    if (!course?.installEnvChecklist) return [];
    return Array.isArray(course.installEnvChecklist) ? course.installEnvChecklist : [course.installEnvChecklist];
  }, [course?.installEnvChecklist]);

  const practiceFiles = useMemo(() => {
    if (!course?.practiceFile) return [];
    return Array.isArray(course.practiceFile) ? course.practiceFile : [course.practiceFile];
  }, [course?.practiceFile]);

  const keyPoints = useMemo(() => course?.keyPoints?.filter(Boolean) ?? [], [course?.keyPoints]);

  const [activeSheetTab, setActiveSheetTab] = useState<'qa' | 'community'>('qa');

  const handleSheetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const sheetInputId = activeSheetTab === 'qa' ? 'course-sheet-question' : 'course-sheet-comment';
  const sheetLabel = activeSheetTab === 'qa' ? '새 질문 등록' : '새 댓글 작성';
  const sheetPlaceholder =
    activeSheetTab === 'qa' ? '궁금한 내용을 간단히 정리해 주세요.' : '커뮤니티 의견을 간단히 작성해 주세요.';
  const sheetButtonLabel = activeSheetTab === 'qa' ? '질문 등록' : '댓글 등록';

  const handleEnroll = () => {
    if (!course) return;
    enrollCourse();
  };

  const getVideoPlaylistUrl = useCallback(async () => {
    if (!videoPlaylistResponse?.data?.signedUrl) return;
    try {
      setIsFetchingVideoUrl(true);
      const signedUrl = videoPlaylistResponse.data.signedUrl;
      const m3u8Url = await GET_video_playlist_by_signed_url(signedUrl);
      setVideoPlaylistUrl(m3u8Url);
    } catch (error) {
      console.error('비디오 플레이리스트 URL을 가져오는 중 오류가 발생했습니다:', error);
      setVideoPlaylistUrl(null);
    } finally {
      setIsFetchingVideoUrl(false);
    }
  }, [videoPlaylistResponse]);

  // 비디오 플레이리스트 요청
  useEffect(() => {
    if (!course?.videoInfo?.videoType || !courseId) return;
    postVideoPlaylist({
      type: course.videoInfo.videoType,
      id: courseId,
    });
  }, [course?.videoInfo?.videoType, courseId, postVideoPlaylist]);

  // 비디오 플레이리스트 URL 가져오기
  useEffect(() => {
    getVideoPlaylistUrl();
  }, [getVideoPlaylistUrl]);

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

  return (
    <div className="container mx-auto flex flex-col gap-12 px-4 py-16">
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="mb-6">
            <h1 className="text-2xl leading-tight font-bold">{course.title}</h1>
            {course.description && (
              <p className="text-muted-foreground mt-2 text-base leading-relaxed">{course.description}</p>
            )}
          </div>
          {/* 강사 정보 */}
          <div className="flex items-center gap-2">
            <GraduationCap className="text-muted-foreground size-6" />
            <span className="text-base font-medium">{course.creatorInfo.nickname}</span>
          </div>

          {/* 관련 태그 */}
          {course.tags && course.tags.length > 0 && (
            <div className="mt-3 flex gap-2">
              <Hash className="text-muted-foreground size-6 stroke-[2.5]" />
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

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={handleEnroll} disabled={isCourseProgressExists || isEnrolling} className="gap-2">
            {isEnrolling ? <Spinner className="size-5" /> : <PlayCircle className="size-5" />}
            {isCourseProgressExists ? '수강 중인 강의입니다' : '지금 수강 시작하기'}
          </Button>
        </div>

        {isCourseProgressExistsError && (
          <div className="bg-destructive/10 text-destructive mt-4 rounded-lg px-4 py-3 text-sm">
            수강 신청에 실패했습니다. 잠시 후 다시 시도해주세요.
          </div>
        )}
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[7fr_3fr]">
        {/* 좌측: 썸네일 */}
        <div className="flex flex-col gap-6">
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
            {isVideoPlaylistLoading || isFetchingVideoUrl || !videoPlaylistUrl ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ReactPlayer
                src={videoPlaylistUrl}
                controls
                width="100%"
                height="100%"
                config={{
                  hls: {
                    enableWorker: true,
                    lowLatencyMode: true,
                  },
                }}
              />
            )}
          </div>

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

        {/* 우측: 강의 정보들 */}
        <div className="flex flex-col gap-6">
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
                      <span className="text-sm font-medium">{content}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">등록된 핵심 포인트가 없습니다.</div>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/70 border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">Q&A · 커뮤니티</CardTitle>
              <CardDescription>질문과 댓글을 슬라이드 창으로 확인하고 바로 의견을 남겨보세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                강의를 들으며 생긴 궁금한 점을 질문하고, 커뮤니티 의견도 함께 살펴보세요.
              </p>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    질문 · 댓글 창 열기
                  </Button>
                </SheetTrigger>
                <SheetContent className="px-6 py-6">
                  <SheetHeader>
                    <SheetTitle>Q&A · 커뮤니티</SheetTitle>
                    <SheetDescription className="text-sm">
                      최신 질문과 댓글을 확인하고 바로 의견을 남기세요.
                    </SheetDescription>
                  </SheetHeader>

                  <Tabs
                    value={activeSheetTab}
                    onValueChange={(value) => setActiveSheetTab(value as 'qa' | 'community')}
                    className="space-y-4"
                  >
                    <TabsList>
                      <TabsTrigger value="qa">Q&A</TabsTrigger>
                      <TabsTrigger value="community">커뮤니티</TabsTrigger>
                    </TabsList>

                    <TabsContent value="qa" className="space-y-4 overflow-y-auto pt-1 pb-4">
                      <div className="space-y-3">
                        {qaHistory.slice(0, 3).map((item) => (
                          <article key={item.id} className="border-border/80 bg-background/80 rounded-2xl border p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-muted-foreground text-[11px] tracking-[0.4em] uppercase">
                                  {item.courseTitle}
                                </p>
                                <h4 className="text-foreground text-sm font-semibold">{item.question}</h4>
                              </div>
                              <span className="border-border/80 text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] tracking-widest uppercase">
                                {item.status}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">{item.answerSnippet}</p>
                          </article>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="community" className="space-y-4 overflow-y-auto pt-1 pb-4">
                      <div className="space-y-3">
                        {communityComments.slice(0, 3).map((comment) => (
                          <article
                            key={comment.id}
                            className="border-border/80 bg-background/70 rounded-2xl border p-3"
                          >
                            <div className="text-muted-foreground flex items-center justify-between text-[11px] tracking-[0.3em] uppercase">
                              <span>{comment.courseTitle}</span>
                              <span>{comment.postedAt}</span>
                            </div>
                            <p className="text-foreground mt-2 text-sm font-semibold">{comment.content}</p>
                            <div className="text-muted-foreground mt-2 flex items-center gap-3 text-[11px]">
                              <span>좋아요 {comment.likes}</span>
                              <span>댓글 {comment.replies}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <SheetFooter className="space-y-3">
                    <form onSubmit={handleSheetSubmit} className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <Label htmlFor={sheetInputId}>{sheetLabel}</Label>
                        <Textarea id={sheetInputId} placeholder={sheetPlaceholder} rows={3} />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" type="submit">
                          {sheetButtonLabel}
                        </Button>
                        <SheetClose asChild>
                          <Button variant="outline" type="button">
                            닫기
                          </Button>
                        </SheetClose>
                      </div>
                    </form>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
