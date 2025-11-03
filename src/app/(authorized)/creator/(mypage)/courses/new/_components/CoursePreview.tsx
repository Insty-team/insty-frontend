'use client';

import { CourseFormData } from '../types';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface CoursePreviewProps {
  formData: CourseFormData;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function CoursePreview({ formData, thumbnailUrl, videoUrl }: CoursePreviewProps) {
  return (
    <div className="space-y-6">
      {/* 썸네일 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle>강의 썸네일</CardTitle>
        </CardHeader>
        <CardContent>
          {thumbnailUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed">
              <img
                src={thumbnailUrl}
                alt="강의 썸네일"
                className="h-auto w-full object-cover"
                style={{ aspectRatio: '16/9', maxHeight: '400px' }}
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">썸네일 미리보기</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">강의 제목</p>
            <p className="text-lg font-semibold">{formData.title || '제목 없음'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">대상자</p>
            <Badge variant="outline" className="mt-1">
              {formData.targetAudience || '미설정'}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">강의 설명</p>
            <p className="mt-1 whitespace-pre-wrap">{formData.description || '설명 없음'}</p>
          </div>
        </CardContent>
      </Card>

      {/* 설치 환경 요구사항 */}
      {formData.installationRequirements && formData.installationRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>설치 환경 요구사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.installationRequirements.map((req) => (
                <Badge
                  key={req.id}
                  variant={req.isSupported ? 'default' : 'secondary'}
                  className="flex items-center gap-1"
                >
                  {req.name}
                  {req.isSupported ? ' ✓' : ' ✗'}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 핵심 내용 */}
      {formData.coreContents && formData.coreContents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>핵심 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {formData.coreContents.map((content, index) => (
                <li key={index} className="text-primary-green-600 flex items-center gap-2">
                  <span className="bg-primary-green-100 rounded-full p-1">✓</span>
                  <span className="font-medium">{content}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 태그 */}
      {formData.tags && formData.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>태그</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary-green-100 text-primary-green-800 border-primary-green-300"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 비디오 미리보기 */}
      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>강의 영상</CardTitle>
            <CardDescription>업로드된 강의 영상입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed">
              <video
                src={videoUrl}
                controls
                className="h-auto w-full"
                style={{ aspectRatio: '16/9', maxHeight: '500px' }}
              >
                비디오를 재생할 수 없습니다.
              </video>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
