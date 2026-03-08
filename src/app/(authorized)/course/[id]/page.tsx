'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import QuestionDetailSheet from '@/app/(authorized)/course/[id]/_components/question/QuestionDetailSheet';
import CommunityDetailSheet from '@/app/(authorized)/course/[id]/_components/community/CommunityDetailSheet';
import QuestionListSheet from '@/app/(authorized)/course/[id]/_components/question/QuestionListSheet';
import CommunityListSheet from '@/app/(authorized)/course/[id]/_components/community/CommunityListSheet';
import WriteQuestionSheet from '@/app/(authorized)/course/[id]/_components/question/WriteQuestionSheet';

import { useParams } from 'next/navigation';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  useGetCourseById,
  useGetCourseProgressExistsById,
  usePostCourseProgressById,
} from '@/shared/services/course/course.hook';
import { usePostVideoPlaylist } from '@/shared/services/video/video.hook';
import { GET_video_playlist_by_signed_url } from '@/shared/services/video/video.service';
import { MessageCircle,Check, Download, FileText, GraduationCap, Hash, PlayCircle, Users, X } from 'lucide-react';

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

  const [activeSheetTab, setActiveSheetTab] = useState<'qa' | 'community'>('qa');
  const [sheetView, setSheetView] = useState<'list' | 'write' | 'detail'>('list');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleBackToList = useCallback(() => {
    setSheetView('list');
    setSelectedQuestionId(null);
  }, []);

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      setIsSheetOpen(open);
      if (!open) {
        handleBackToList();
      }
    },
    [handleBackToList],
  );

  const handleSelectQuestion = useCallback(
    (questionId: number) => {
      setActiveSheetTab('qa');
      setSelectedQuestionId(questionId);
      setSheetView('detail');
    },
    [],
  );

  const handleSelectCommunityPost = useCallback((postId: number) => {
    setActiveSheetTab('community');
    setSelectedQuestionId(postId);
    setSheetView('detail');
  }, []);

  const handleClickWriteQuestion = useCallback(() => {
    setActiveSheetTab('qa');
    setSheetView('write');
  }, []);

  const handleEnroll = () => {
    if (!course) return;
    enrollCourse();
  };

  const installEnvChecklist = useMemo(() => {
    if (!course?.installEnvChecklist) return [];
    return Array.isArray(course.installEnvChecklist) ? course.installEnvChecklist : [course.installEnvChecklist];
  }, [course?.installEnvChecklist]);

  const practiceFiles = useMemo(() => {
    if (!course?.practiceFile) return [];
    return Array.isArray(course.practiceFile) ? course.practiceFile : [course.practiceFile];
  }, [course?.practiceFile]);

  const keyPoints = useMemo(() => course?.keyPoints?.filter(Boolean) ?? [], [course?.keyPoints]);

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
          <p>Loading course information...</p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Course information not found.</p>
          <p className="text-muted-foreground mt-2 text-sm">Please check the address or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-16">
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
            {isCourseProgressExists ? 'Currently enrolled' : 'Start Learning Now'}
          </Button>
        </div>
        {isCourseProgressExistsError && (
          <div className="bg-destructive/10 text-destructive mt-4 rounded-lg px-4 py-3 text-sm">
            Enrollment failed. Please try again later.
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
              <CardTitle className="text-xl">Practice Files</CardTitle>
              <CardDescription>Check the reference materials provided with the course.</CardDescription>
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
                        Download
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">No practice files provided.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 우측: 강의 정보들 */}
        <div className="flex flex-col gap-6">
          {/* 2. 설치 환경 요구사항 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Course Preparation</CardTitle>
              <CardDescription>Check the required environment before taking the course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <Users className="text-primary size-4" />
                  Recommended Audience
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{course.targetAudience}</p>
              </div>

              <Separator />
              <div>
                <h3 className="text-foreground text-sm font-semibold">Installation Environment Checklist</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {installEnvChecklist.length ? (
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
                    <div className="text-muted-foreground text-sm">No special preparation required.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 핵심내용 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What You&apos;ll Learn</CardTitle>
              <CardDescription>Preview the course results through key points.</CardDescription>
            </CardHeader>
            <CardContent>
              {keyPoints.length ? (
                <ul className="space-y-4">
                  {keyPoints.map((content, index) => (
                    <li key={index} className="text-primary-green-800 flex items-center gap-2">
                      <span className="bg-primary-green-800 rounded-full p-1"></span>
                      <span className="text-sm font-medium">{content}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground text-sm">No key points registered.</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/70 border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">Q&A · Community</CardTitle>
              <CardDescription>Questions and comments to the slide window and leave your opinion right away.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Ask questions while listening to the lecture and check community comments together.
              </p>

              <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    Open Q&A & Community
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full px-6 py-6 sm:max-w-[800px]">
                  <SheetHeader>
                    <SheetTitle>Q&A · Community</SheetTitle>
                    <SheetDescription>Check questions and community posts and share your opinions.</SheetDescription>
                  </SheetHeader>
                  {/* Sheet List */}
                  {sheetView === 'list' ? (
                    <Tabs
                      value={activeSheetTab}
                      onValueChange={(value) => setActiveSheetTab(value as 'qa' | 'community')}
                      className="w-full h-[calc(100vh-180px)] flex flex-col"
                    >
                      <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                        <TabsTrigger value="qa" className="flex-1">
                          <div className="flex items-center justify-center gap-2">
                            <MessageCircle className="size-4" />
                            <span>Q&A</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="community" className="flex-1">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="size-4" />
                            <span>Community</span>
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="qa" className="flex-1 mt-4 overflow-hidden">
                        <QuestionListSheet
                          courseId={courseId}
                          onSelectQuestion={handleSelectQuestion}
                          onClickWrite={handleClickWriteQuestion}
                          sheetIsOpen={isSheetOpen}
                          isActive={activeSheetTab === 'qa'}
                        />
                      </TabsContent>

                      <TabsContent value="community" className="flex-1 mt-4 overflow-hidden">
                        <CommunityListSheet
                          courseId={courseId}
                          onSelectPost={handleSelectCommunityPost}
                          sheetIsOpen={isSheetOpen}
                          isActive={activeSheetTab === 'community'}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : sheetView === 'write' ? (
                    activeSheetTab === 'qa' && (
                      <div className="h-[calc(100vh-180px)] overflow-hidden">
                        <WriteQuestionSheet courseId={courseId} onBack={handleBackToList} />
                      </div>
                    )
                  ) : selectedQuestionId ? (
                    activeSheetTab === 'qa' ? (
                      <QuestionDetailSheet
                        courseId={Number(courseId)}
                        questionId={selectedQuestionId}
                        onBack={handleBackToList}
                      />
                    ) : (
                      <CommunityDetailSheet
                        courseId={Number(courseId)}
                        postId={selectedQuestionId}
                        onBack={handleBackToList}
                      />
                    )
                  ) : (
                    <div className="text-muted-foreground py-8 text-center text-sm">Please select a question.</div>
                  )}
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
