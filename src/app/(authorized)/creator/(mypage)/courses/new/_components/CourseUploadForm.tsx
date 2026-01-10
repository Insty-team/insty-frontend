'use client';

import { CourseDraft, CourseFormData, InstallationRequirement, UploadStep } from '../types';
import { CoreContents } from './CoreContents';
import { CoursePreview } from './CoursePreview';
import { CourseTags } from './CourseTags';
import { FileUpload } from './FileUpload';
import { InstallationRequirements } from './InstallationRequirements';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { CheckCircle2, Edit3, FileVideo, Sparkles } from 'lucide-react';

export function CourseUploadForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<UploadStep>('UPLOAD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [, setVideoUuid] = useState<string>('');
  const [installationRequirements, setInstallationRequirements] = useState<InstallationRequirement[]>([]);
  const [coreContents, setCoreContents] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isVideoReadyToProceed, setIsVideoReadyToProceed] = useState(false);

  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      targetAudience: '',
      description: '',
    },
  });

  const description = watch('description');
  const title = watch('title');
  const targetAudience = watch('targetAudience');

  // AI 초안 생성 시뮬레이션
  const generateAIDraft = async (): Promise<CourseDraft> => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 대기

    // AI가 생성한 초안 데이터 시뮬레이션
    return {
      title: `${videoFile?.name.replace('.mp4', '') || '강의'}에 대한 AI 생성 제목`,
      targetAudience: '초보자',
      description: `이 강의는 ${videoFile?.name.replace('.mp4', '') || '주제'}에 대한 포괄적인 가이드를 제공합니다. 
      
주요 학습 내용:
- 기본 개념 이해
- 실전 예제와 함께하는 단계별 설명
- 베스트 프랙티스와 팁

${videoFile?.name.replace('.mp4', '') || '주제'}를 처음 배우시는 분들에게 적합합니다.`,
      installationRequirements: [
        { id: '1', name: 'Node.js', isSupported: true },
        { id: '2', name: 'npm 또는 yarn', isSupported: true },
      ],
      coreContents: ['기본 개념 이해', '실전 프로젝트', '베스트 프랙티스', '문제 해결 방법'],
      tags: ['초보자', '튜토리얼', '실전'],
    };
  };

  // Step 1: 영상 업로드 후 AI 생성으로 이동
  const handleVideoUploadComplete = async () => {
    if (!videoFile) {
      alert('강의 영상을 먼저 업로드해주세요.');
      return;
    }
    if (!isVideoReadyToProceed) {
      alert('영상 업로드/AI 분석/썸네일 생성이 완료될 때까지 기다려주세요.');
      return;
    }
    // 썸네일은 "직접 업로드(thumbnailFile)" 또는 "서버 생성 썸네일(thumbnailUrl)" 중 하나만 있으면 OK
    if (!thumbnailFile && !thumbnailUrl) {
      alert('강의 썸네일을 먼저 업로드해주세요.');
      return;
    }

    // AI 생성 단계로 이동
    setCurrentStep('AI_GENERATING');

    // AI 초안 생성
    try {
      const aiDraft = await generateAIDraft();

      // AI 초안을 폼에 채우기
      setValue('title', aiDraft.title);
      setValue('targetAudience', aiDraft.targetAudience);
      setValue('description', aiDraft.description);
      setInstallationRequirements(aiDraft.installationRequirements);
      setCoreContents(aiDraft.coreContents);
      setTags(aiDraft.tags);

      // TODO: 썸네일 업로드 API 호출
    } catch (error) {
      console.error('AI 초안 생성 실패:', error);
      alert('AI 초안 생성 중 오류가 발생했습니다.');
    } finally {
      setCurrentStep('EDIT');
    }
  };

  // 최종 제출
  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);

    try {
      // 실제 API 호출 로직은 여기에 구현
      const courseData = {
        ...data,
        thumbnail: thumbnailFile,
        video: videoFile,
        installationRequirements,
        coreContents,
        tags,
      };

      console.log('강의 데이터:', courseData);

      // 성공 시 강의 목록으로 이동
      alert('강의가 성공적으로 업로드되었습니다!');
      router.push('/creator/courses');
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/creator/courses');
  };

  // 단계별 네비게이션
  const getStepInfo = (step: UploadStep) => {
    switch (step) {
      case 'UPLOAD':
        return { label: '강의 영상 업로드', icon: FileVideo };
      case 'AI_GENERATING':
        return { label: 'AI 초안 생성', icon: Sparkles };
      case 'EDIT':
        return { label: '내용 수정', icon: Edit3 };
      case 'PREVIEW':
        return { label: '미리보기', icon: CheckCircle2 };
    }
  };

  // 전체 JSX
  return (
    <div className="mx-auto space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">새 강의 업로드</h2>
          <p className="text-muted-foreground mt-1">단계별로 강의를 생성하세요</p>
        </div>
      </div>

      {/* 단계 표시 */}
      <div className="relative my-8">
        {/* 연결선 */}
        <div className="absolute top-6 right-[12%] left-[12%] flex">
          {[0, 1, 2].map((idx) => {
            const stepIndex = ['UPLOAD', 'AI_GENERATING', 'EDIT', 'PREVIEW'].indexOf(currentStep);
            const isCompleted = idx < stepIndex;
            return (
              <div key={idx} className="h-0.5 flex-1" style={{ marginLeft: idx > 0 ? '0' : '0', marginRight: '0' }}>
                <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              </div>
            );
          })}
        </div>
        {/* 단계 아이콘 및 라벨 */}
        <div className="relative z-10 flex">
          {(['UPLOAD', 'AI_GENERATING', 'EDIT', 'PREVIEW'] as UploadStep[]).map((step, index) => {
            const stepInfo = getStepInfo(step);
            const isActive = currentStep === step;
            const stepIndex = ['UPLOAD', 'AI_GENERATING', 'EDIT', 'PREVIEW'].indexOf(currentStep);
            const isCompleted = index < stepIndex;
            const StepIcon = stepInfo.icon;

            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-3">
                {/* 아이콘 영역 */}
                <div className="relative">
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary shadow-primary/40 text-white shadow-md'
                        : isCompleted
                          ? 'border-green-500 bg-green-500 text-green-500'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <StepIcon className={`h-6 w-6 ${isActive ? 'text-black' : ''}`} />
                    )}
                    {isActive && (
                      <div className="border-primary animate-ping-once absolute -inset-0.5 rounded-full border-2 opacity-75" />
                    )}
                  </div>
                </div>
                {/* 라벨 영역 */}
                <div className="flex flex-col items-center gap-1 text-center">
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {stepInfo.label}
                  </span>
                  <span
                    className={`text-xs transition-colors ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {index + 1}단계
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: 강의 영상 업로드 */}
      {currentStep === 'UPLOAD' && (
        <Card>
          <CardHeader>
            <CardTitle>1️⃣ 강의 영상 업로드</CardTitle>
            <CardDescription>강의 영상을 먼저 업로드해주세요 (필수)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              type="video"
              file={videoFile}
              onFileSelect={(f) => {
                setVideoFile(f);
                // 파일을 바꾸면 다시 준비 상태를 false로 (준비되면 FileUpload가 true로 올려줌)
                setIsVideoReadyToProceed(false);
                setVideoUuid('');
                setThumbnailUrl('');
                setVideoUrl(f ? URL.createObjectURL(f) : '');
              }}
              onReadyChange={setIsVideoReadyToProceed}
              onVideoUuidChange={setVideoUuid}
              onThumbnailUrlChange={setThumbnailUrl}
            />
            <FileUpload
              type="thumbnail"
              file={thumbnailFile}
              onFileSelect={setThumbnailFile}
              thumbnailUrl={thumbnailUrl}
              onThumbnailUrlClear={() => setThumbnailUrl('')}
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button type="button" onClick={handleVideoUploadComplete} disabled={!videoFile || !isVideoReadyToProceed}>
                다음 단계로 진행
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI 초안 생성 */}
      {currentStep === 'AI_GENERATING' && (
        <Card>
          <CardHeader>
            <CardTitle>2️⃣ AI 초안 생성 중...</CardTitle>
            <CardDescription>영상을 분석하여 강의 초안을 자동으로 생성하고 있습니다</CardDescription>
          </CardHeader>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Sparkles className="h-16 w-16 animate-pulse text-purple-600" />
              <p className="text-lg font-medium">AI가 강의 초안을 생성 중입니다...</p>
              <p className="text-muted-foreground text-sm">잠시만 기다려주세요</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: 내용 수정 */}
      {currentStep === 'EDIT' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3️⃣ AI 초안 수정</CardTitle>
              <CardDescription>AI가 생성한 초안을 확인하고 필요한 내용을 수정하세요</CardDescription>
            </CardHeader>
          </Card>

          {/* 기본 정보 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>강의의 기본 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">강의 제목 *</Label>
                <Input
                  id="title"
                  {...register('title', {
                    required: '강의 제목을 입력해주세요',
                    minLength: { value: 2, message: '제목은 2자 이상이어야 합니다' },
                    maxLength: { value: 100, message: '제목은 100자 이하여야 합니다' },
                  })}
                  placeholder="강의 제목을 입력하세요"
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">대상자 *</Label>
                <Input
                  id="targetAudience"
                  {...register('targetAudience', {
                    required: '대상자를 입력해주세요',
                    minLength: { value: 2, message: '대상자는 2자 이상이어야 합니다' },
                    maxLength: { value: 100, message: '대상자는 100자 이하여야 합니다' },
                  })}
                  placeholder="예: 초보자, 중급자, 개발자 등"
                />
                {errors.targetAudience && <p className="text-destructive text-sm">{errors.targetAudience.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">강의 설명 *</Label>
                <Textarea
                  id="description"
                  {...register('description', {
                    required: '강의 설명을 입력해주세요',
                    minLength: { value: 10, message: '설명은 10자 이상이어야 합니다' },
                    maxLength: { value: 500, message: '설명은 500자 이하여야 합니다' },
                  })}
                  rows={4}
                  placeholder="강의에 대한 자세한 설명을 입력하세요"
                  maxLength={500}
                  className="h-48"
                />
                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>
                    {errors.description && <span className="text-destructive">{errors.description.message}</span>}
                  </span>
                  <span>{description?.length || 0}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 설치 환경 요구사항 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>설치 환경 요구사항</CardTitle>
              <CardDescription>강의에 필요한 설치 환경을 추가하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <InstallationRequirements
                requirements={installationRequirements}
                onRequirementsChange={setInstallationRequirements}
              />
            </CardContent>
          </Card>

          {/* 핵심 내용 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>핵심 내용</CardTitle>
              <CardDescription>이 강의에서 다루는 핵심 내용을 추가하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <CoreContents contents={coreContents} onContentsChange={setCoreContents} />
            </CardContent>
          </Card>

          {/* 태그 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>태그</CardTitle>
              <CardDescription>강의를 찾기 쉽게 태그를 추가하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseTags tags={tags} onTagsChange={setTags} />
            </CardContent>
          </Card>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button type="button" variant="outline" onClick={() => setCurrentStep('PREVIEW')}>
              미리보기
            </Button>
          </div>
        </form>
      )}

      {/* Step 4: 미리보기 */}
      {currentStep === 'PREVIEW' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4️⃣ 미리보기</CardTitle>
              <CardDescription>강의가 사용자에게 어떻게 보여질지 확인하세요</CardDescription>
            </CardHeader>
          </Card>

          <CoursePreview
            formData={{ title, targetAudience, description, installationRequirements, coreContents, tags }}
            thumbnailUrl={thumbnailUrl}
            videoUrl={videoUrl}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setCurrentStep('EDIT')}>
              다시 수정하기
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  업로드 중...
                </>
              ) : (
                '강의 업로드 완료'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
