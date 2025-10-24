'use client';

import { CourseFormData, InstallationRequirement, UploadProgress } from '../types';
import { CoreContents } from './CoreContents';
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
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';

export function CourseUploadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [installationRequirements, setInstallationRequirements] = useState<InstallationRequirement[]>([]);
  const [coreContents, setCoreContents] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [thumbnailProgress, setThumbnailProgress] = useState<UploadProgress>({
    status: 'IDLE',
    progress: 0,
  });

  const [videoProgress, setVideoProgress] = useState<UploadProgress>({
    status: 'IDLE',
    progress: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      targetAudience: '',
      description: '',
    },
  });

  const description = watch('description');

  // 파일 업로드 시뮬레이션 (실제로는 API 호출)
  const simulateUpload = async (
    file: File,
    type: 'thumbnail' | 'video',
    setProgress: (progress: UploadProgress) => void,
  ) => {
    setProgress({ status: 'PROCESSING', progress: 0 });

    // 업로드 진행률 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress({ status: 'PROCESSING', progress: i });
    }

    setProgress({ status: 'COMPLETED', progress: 100 });
  };

  const onSubmit = async (data: CourseFormData) => {
    if (!thumbnailFile) {
      alert('썸네일을 업로드해주세요.');
      return;
    }

    if (!videoFile) {
      alert('강의 영상을 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 파일 업로드 시뮬레이션
      await Promise.all([
        simulateUpload(thumbnailFile, 'thumbnail', setThumbnailProgress),
        simulateUpload(videoFile, 'video', setVideoProgress),
      ]);

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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">새 강의 업로드</h2>
          <p className="text-muted-foreground mt-1">강의 정보를 입력하고 업로드하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 파일 업로드 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>파일 업로드</CardTitle>
            <CardDescription>강의 썸네일과 영상을 업로드하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              type="thumbnail"
              file={thumbnailFile}
              onFileSelect={setThumbnailFile}
              uploadProgress={thumbnailProgress.progress}
              uploadStatus={thumbnailProgress.status}
              error={thumbnailProgress.message}
            />

            <FileUpload
              type="video"
              file={videoFile}
              onFileSelect={setVideoFile}
              uploadProgress={videoProgress.progress}
              uploadStatus={videoProgress.status}
              error={videoProgress.message}
            />
          </CardContent>
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

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting || !thumbnailFile || !videoFile}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                업로드 중...
              </>
            ) : (
              '강의 업로드'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
