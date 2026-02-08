'use client';

import { CourseFormData, InstallationRequirement, UploadProgress, UploadStep } from '../types';
import { CoreContents } from './CoreContents';
import { CoursePreview } from './CoursePreview';
import { CourseTags } from './CourseTags';
import { FileUpload } from './FileUpload';
import { InstallationRequirements } from './InstallationRequirements';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { usePostVideoMetadataSuggestion } from '@/shared/services/ai-video/ai-video.hook';
import { usePostCourse } from '@/shared/services/course/course.hook';
import { GET_courses, GET_courses_my } from '@/shared/services/course/course.service';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Edit3, FileVideo, Sparkles } from 'lucide-react';

export function CourseUploadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<UploadStep>('UPLOAD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUuid, setVideoUuid] = useState<string>('');
  const [installationRequirements, setInstallationRequirements] = useState<InstallationRequirement[]>([]);
  const [coreContents, setCoreContents] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isVideoReadyToProceed, setIsVideoReadyToProceed] = useState(false);
  const [installationRequirementsError, setInstallationRequirementsError] = useState<string | null>(null);

  const [thumbnailProgress, setThumbnailProgress] = useState<UploadProgress>({
    status: 'IDLE',
    progress: 0,
  });

  const [videoProgress, setVideoProgress] = useState<UploadProgress>({
    status: 'IDLE',
    progress: 0,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');

  const videoMetadataSuggestionMutation = usePostVideoMetadataSuggestion(videoUuid);
  const postCourseMutation = usePostCourse();

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

  // 사용자가 직접 썸네일 파일을 올린 경우, 미리보기에서 보이도록 objectURL 생성
  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  // Base64(data:) → File 변환
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1] || '');
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Step 1: 영상 업로드 후 AI 생성으로 이동
  const handleVideoUploadComplete = async () => {
    if (!videoFile) {
      alert('Please upload the contents video first.');
      return;
    }
    if (!isVideoReadyToProceed) {
      alert('Please wait until the video upload, AI processing, and thumbnail generation are complete.');
      return;
    }
    // 썸네일은 "직접 업로드(thumbnailFile)" 또는 "서버 생성 썸네일(thumbnailUrl)" 중 하나만 있으면 OK
    if (!thumbnailFile && !thumbnailUrl) {
      alert('Please provide a course thumbnail.');
      return;
    }
    if (!videoUuid) {
      alert('Video upload is not finished yet. Please try again in a moment.');
      return;
    }

    // AI 생성 단계로 이동
    setCurrentStep('AI_GENERATING');

    // AI 초안 생성
    try {
      const res = await videoMetadataSuggestionMutation.mutateAsync();
      const aiDraft = res.data;

      // AI 초안을 폼에 채우기
      setValue('title', aiDraft.title);
      setValue('targetAudience', aiDraft.target);
      setValue('description', aiDraft.description);
      setInstallationRequirements(
        (aiDraft.installation_checklist ?? []).map((name, idx) => ({
          id: `${Date.now()}-${idx}`,
          name,
          isSupported: true,
        })),
      );
      setCoreContents(aiDraft.core_contents ?? []);
      setTags(aiDraft.tags ?? []);
    } catch (error) {
      console.error('Failed to generate AI draft:', error);
      alert('An error occurred while generating the AI draft.');
    } finally {
      setCurrentStep('EDIT');
    }
  };

  // 최종 제출
  const onSubmit = async (data: CourseFormData) => {
    if (installationRequirements.length === 0) {
      setInstallationRequirementsError('설치 환경 요구사항을 최소 1개 이상 입력해주세요.');
      setCurrentStep('EDIT');
      return;
    }

    setIsSubmitting(true);

    try {
      // thumbnail:
      // - 사용자가 직접 올렸으면 그 파일 사용
      // - 없고 thumbnailUrl이 data: (Base64)면 File로 변환해서 전송
      // - 그 외(서버 썸네일 https://...)면 전송하지 않음(null)
      let finalThumbnailFile: File | null = thumbnailFile;
      if (!finalThumbnailFile && thumbnailUrl && thumbnailUrl.startsWith('data:')) {
        try {
          finalThumbnailFile = base64ToFile(thumbnailUrl, 'thumbnail.jpg');
        } catch (e) {
          console.error('Base64 썸네일 변환 실패:', e);
        }
      }

      // 스펙:
      // - 코스 JSON + thumbnail(File|null) + practiceFile(null 가능)
      // - 서버 생성 썸네일을 쓰면 thumbnail은 null로 전송
      const courseData = {
        keyPoints: coreContents,
        isShow: true,
        price: 0,
        installEnvChecklist: installationRequirements.map((r) => ({
          content: r.name,
          isSupported: r.isSupported,
        })),
        targetAudience: data.targetAudience,
        videoUuid,
        title: data.title,
        tags,
        description: data.description,
        thumbnail: finalThumbnailFile ?? null,
        practiceFile: null,
      };

      await postCourseMutation.mutateAsync(courseData);

      // 강의 목록 캐시 갱신
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [GET_courses_my.name] }),
        queryClient.invalidateQueries({ queryKey: [GET_courses.name] }),
      ]);

      // 성공 시 강의 목록으로 이동
      alert('Your course has been uploaded successfully.');
      router.push('/creator/courses');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('An error occurred during upload. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (installationRequirements.length > 0 && installationRequirementsError) {
      setInstallationRequirementsError(null);
    }
  }, [installationRequirements, installationRequirementsError]);

  const handleCancel = () => {
    router.push('/creator/courses');
  };

  const handlePreview = () => {
    if (installationRequirements.length === 0) {
      setInstallationRequirementsError('설치 환경 요구사항을 최소 1개 이상 입력해주세요.');
      return;
    }

    setInstallationRequirementsError(null);
    setCurrentStep('PREVIEW');
  };

  // 단계별 네비게이션
  const getStepInfo = (step: UploadStep) => {
    switch (step) {
      case 'UPLOAD':
        return { label: 'Upload Video', icon: FileVideo };
      case 'AI_GENERATING':
        return { label: 'Generate Draft', icon: Sparkles };
      case 'EDIT':
        return { label: 'Edit Details', icon: Edit3 };
      case 'PREVIEW':
        return { label: 'Preview', icon: CheckCircle2 };
    }
  };

  // 전체 JSX
  return (
    <div className="mx-auto space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">New Contents Upload</h2>
          <p className="text-muted-foreground mt-1">Create your contents step by step</p>
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
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 ${isActive
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
                    className={`text-sm font-semibold transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                  >
                    {stepInfo.label}
                  </span>
                  <span
                    className={`text-xs transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                  >
                    Step {index + 1}
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
            <CardTitle>1️⃣ Upload Contents Video</CardTitle>
            <CardDescription>Please upload your contents video first (required).</CardDescription>
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
                Cancel
              </Button>
              <Button type="button" onClick={handleVideoUploadComplete} disabled={!videoFile || !isVideoReadyToProceed}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI 초안 생성 */}
      {currentStep === 'AI_GENERATING' && (
        <Card>
          <CardHeader>
            <CardTitle>2️⃣ Generate AI Draft...</CardTitle>
            <CardDescription>We’re analyzing your video and generating a draft automatically.</CardDescription>
          </CardHeader>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Sparkles className="h-16 w-16 animate-pulse text-purple-600" />
              <p className="text-lg font-medium">Generating your draft…</p>
              <p className="text-muted-foreground text-sm">This may take a moment.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: 내용 수정 */}
      {currentStep === 'EDIT' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3️⃣ Edit Content</CardTitle>
              <CardDescription>Review the AI-generated draft and make any necessary edits.</CardDescription>
            </CardHeader>
          </Card>

          {/* 기본 정보 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Contents Title *</Label>
                <Input
                  id="title"
                  {...register('title', {
                    required: 'Please enter a course title.',
                    minLength: { value: 2, message: 'Title must be at least 2 characters.' },
                    maxLength: { value: 100, message: 'Title must be 100 characters or fewer.' },
                  })}
                  placeholder="Enter a course title"
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  {...register('targetAudience', {
                    required: 'Please specify the target audience.',
                    minLength: { value: 2, message: 'Target audience must be at least 2 characters.' },
                    maxLength: { value: 100, message: 'Target audience must be 100 characters or fewer.' },
                  })}
                  placeholder="e.g., Beginners, Intermediate learners, Developers"
                />
                {errors.targetAudience && <p className="text-destructive text-sm">{errors.targetAudience.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Contents Description *</Label>
                <Textarea
                  id="description"
                  {...register('description', {
                    required: 'Please enter a course description.',
                    minLength: { value: 10, message: 'Description must be at least 10 characters.' },
                    maxLength: { value: 500, message: 'Description must be 500 characters or fewer.' },
                  })}
                  rows={4}
                  placeholder="Write a detailed description of your course"
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
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>Add any environment or installation requirements for this course.</CardDescription>
            </CardHeader>
            <CardContent>
              <InstallationRequirements
                requirements={installationRequirements}
                onRequirementsChange={setInstallationRequirements}
              />
              {installationRequirementsError && (
                <p className="text-destructive mt-3 text-sm">{installationRequirementsError}</p>
              )}
            </CardContent>
          </Card>

          {/* 핵심 내용 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>Key Points</CardTitle>
              <CardDescription>Add the key topics learners will cover in this course.</CardDescription>
            </CardHeader>
            <CardContent>
              <CoreContents contents={coreContents} onContentsChange={setCoreContents} />
            </CardContent>
          </Card>

          {/* 태그 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to help learners discover your course.</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseTags tags={tags} onTagsChange={setTags} />
            </CardContent>
          </Card>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={() => setCurrentStep('PREVIEW')}>
              Preview
            </Button>
          </div>
        </form>
      )}

      {/* Step 4: 미리보기 */}
      {currentStep === 'PREVIEW' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4️⃣ Preview</CardTitle>
              <CardDescription>Preview how your course will appear to learners.</CardDescription>
            </CardHeader>
          </Card>

          <CoursePreview
            formData={{ title, targetAudience, description, installationRequirements, coreContents, tags }}
            thumbnailUrl={thumbnailPreviewUrl || thumbnailUrl}
            videoUrl={videoUrl}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setCurrentStep('EDIT')}>
              Back to Edit
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                'Publish Contents'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
