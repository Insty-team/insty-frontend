'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { useGetVideoTranscriptionStatus } from '@/shared/services/ai-video/ai-video.hook';
import { TranscriptionStatusResponse } from '@/shared/services/ai-video/ai-video.type';
import { useGetVideoThumbnail, usePostCourseVideoUpload } from '@/shared/services/video/video.hook';
import axios from 'axios';
import { FileImage, Upload, Video, X } from 'lucide-react';

interface FileUploadProps {
  type: 'thumbnail' | 'video';
  file: File | null;
  onFileSelect: (file: File | null) => void;
  /** type="video"일 때만 사용: 업로드 + AI 전사 + 썸네일까지 모두 완료되면 true */
  onReadyChange?: (ready: boolean) => void;
  /** type="video"일 때만 사용: 서버에서 받은 video uuid */
  onVideoUuidChange?: (videoUuid: string) => void;
  /** type="video"일 때만 사용: 서버에서 받은 썸네일 url */
  onThumbnailUrlChange?: (thumbnailUrl: string) => void;
  /** type="thumbnail"일 때 사용: 서버에서 생성된 썸네일 URL (영상 업로드 시 자동 생성) */
  thumbnailUrl?: string;
  /** type="thumbnail"일 때 사용: 서버 썸네일 URL 제거 콜백 */
  onThumbnailUrlClear?: () => void;
}

export function FileUpload({
  type,
  file,
  onFileSelect,
  onReadyChange,
  onVideoUuidChange,
  onThumbnailUrlChange,
  thumbnailUrl,
  onThumbnailUrlClear,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | undefined>(undefined);

  const [videoUuid, setVideoUuid] = useState<string>('');
  const [isTranscriptionReady, setIsTranscriptionReady] = useState(false);
  const [shouldPollThumbnail, setShouldPollThumbnail] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const debugStartedAtRef = useRef<number | null>(null);
  const thumbnailPollCountRef = useRef(0);

  const videoUploadMutation = usePostCourseVideoUpload();
  const transcriptionStatus = useGetVideoTranscriptionStatus(videoUuid);

  const isThumbnail = type === 'thumbnail';
  const accept = isThumbnail ? 'image/jpeg,image/png' : 'video/mp4';
  const maxSize = isThumbnail ? 5 * 1024 * 1024 : 500 * 1024 * 1024; // 5MB for images, 500MB for videos
  const maxSizeText = isThumbnail ? '5MB' : '500MB';

  // type="thumbnail"에서 파일을 직접 올린 경우 즉시 미리보기 제공
  useEffect(() => {
    if (!isThumbnail) return;
    if (!file) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setThumbnailPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isThumbnail]);

  const resetVideoPipeline = () => {
    setUploadProgress(0);
    setUploadStatus('IDLE');
    setError(undefined);
    setVideoUuid('');
    setIsTranscriptionReady(false);
    setShouldPollThumbnail(false);
    setIsFileUploaded(false);
    onReadyChange?.(false);
    debugStartedAtRef.current = null;
    thumbnailPollCountRef.current = 0;
  };

  const uploadFileToUrl = async (uploadUrl: string, uploadFile: File) => {
    await axios.put(uploadUrl, uploadFile, {
      // presigned URL이 content-type까지 서명에 포함했을 수 있어서 동일하게 맞춰주는 게 안전
      headers: {
        'Content-Type': uploadFile.type || 'application/octet-stream',
      },
      // NOTE: 이 진행률은 "파일 업로드" 진행률이고,
      // 사용자가 보는 퍼센트는 아래에서 전사(progress) 기반으로 덮어씁니다.
      onUploadProgress: (event) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      },
    });
  };

  const handleFileSelect = (selectedFile: File) => {
    // 파일 크기 체크
    if (selectedFile.size > maxSize) {
      alert(`파일 크기는 ${maxSizeText} 이하여야 합니다.`);
      return;
    }

    // 파일 타입 체크
    const isValidType = isThumbnail ? selectedFile.type.startsWith('image/') : selectedFile.type === 'video/mp4';

    if (!isValidType) {
      alert(isThumbnail ? 'JPEG, PNG 파일만 업로드 가능합니다.' : 'MP4 파일만 업로드 가능합니다.');
      return;
    }

    // 썸네일 파일을 새로 선택하면 서버 썸네일 URL 초기화
    if (isThumbnail && thumbnailUrl) {
      onThumbnailUrlClear?.();
    }

    onFileSelect(selectedFile);

    // type="video"인 경우: 선택 즉시 업로드/처리 파이프라인 시작
    if (!isThumbnail) {
      resetVideoPipeline();
      setUploadStatus('PROCESSING');
      setUploadProgress(0);

      (async () => {
        try {
          const res = await videoUploadMutation.mutateAsync({
            fileName: selectedFile.name,
            contentType: selectedFile.type,
          });

          const { uuid, uploadUrl } = res.data;
          onVideoUuidChange?.(uuid);
          setVideoUuid(uuid);

          // presigned uploadUrl로 실제 파일 업로드
          await uploadFileToUrl(uploadUrl, selectedFile);
          setIsFileUploaded(true);
          // 여기서부터는 transcription-status의 progress를 사용자에게 보여줌
          setUploadProgress(0);
          // 여기서부터는 AI 전사 완료/썸네일 완료까지 기다려야 "완료" 처리
        } catch (e) {
          console.error(e);
          setUploadStatus('ERROR');
          setError('영상 업로드 중 오류가 발생했습니다.');
          onReadyChange?.(false);
        }
      })();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (isThumbnail && thumbnailUrl) {
      onThumbnailUrlClear?.();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!isThumbnail) {
      resetVideoPipeline();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusText = () => {
    if (!isThumbnail) {
      const stt = transcriptionStatus.data as TranscriptionStatusResponse | undefined;
      const isReady = uploadStatus === 'COMPLETED' && !!thumbnailQuery.data?.thumbnailUrl;
      if (isReady) return 'Ready';
      if (uploadStatus === 'ERROR') return 'Upload failed';
      if (shouldPollThumbnail) return 'Generating thumbnail...';
      if (stt?.status === 'NOT_STARTED') return 'AI processing queued...';
      if (stt?.status === 'IN_PROGRESS' || stt?.status === 'PENDING') return `AI processing... (${stt.progress ?? 0}%)`;
      if (stt?.status === 'FAILED') return 'AI processing failed';
      if (isTranscriptionReady) return 'AI processing complete';
    }
    switch (uploadStatus) {
      case 'PROCESSING':
        return 'Uploading...';
      case 'COMPLETED':
        return 'Upload complete';
      case 'ERROR':
        return 'Upload failed';
      default:
        return 'Idle';
    }
  };

  // 전사 상태가 완료되면 썸네일 폴링 시작
  useEffect(() => {
    if (isThumbnail) return;
    const stt = transcriptionStatus.data as TranscriptionStatusResponse | undefined;
    if (!stt) return;

    // 파일 업로드가 끝난 뒤부터는 "전사 진행률(progress)"를 퍼센트로 보여줌
    if (isFileUploaded && (stt.status === 'NOT_STARTED' || stt.status === 'PENDING' || stt.status === 'IN_PROGRESS')) {
      const p = typeof stt.progress === 'number' ? stt.progress : 0;
      setUploadProgress(Math.max(0, Math.min(99, Math.round(p))));
    }

    if (stt.status === 'COMPLETED') {
      setIsTranscriptionReady(true);
      if (isFileUploaded) setUploadProgress(100);
      setShouldPollThumbnail(true);
    } else if (stt.status === 'FAILED') {
      setUploadStatus('ERROR');
      setError(stt.reason || 'AI 변환에 실패했습니다.');
      onReadyChange?.(false);
    }
  }, [isFileUploaded, isThumbnail, onReadyChange, transcriptionStatus.data, videoUuid]);

  const thumbnailQuery = useGetVideoThumbnail(videoUuid, {
    enabled: !isThumbnail && shouldPollThumbnail && !!videoUuid,
    refetchInterval: (query) => {
      // refetchInterval의 query.state.data는 select 전 원본 데이터 (ApiResponse<VideoThumbnailResponse>)
      const response = query.state.data as { data?: { thumbnailUrl?: string } } | undefined;
      const hasThumbnail = !!response?.data?.thumbnailUrl;
      thumbnailPollCountRef.current += 1;
      return hasThumbnail ? false : 5000;
    },
    retry: false,
  });

  // 썸네일이 준비되면 최종 READY
  useEffect(() => {
    if (isThumbnail) return;
    const thumbnailUrl = thumbnailQuery.data?.thumbnailUrl;
    if (!thumbnailUrl) return;

    onThumbnailUrlChange?.(thumbnailUrl);
    setUploadStatus('COMPLETED');
    setError(undefined);
    onReadyChange?.(true);
    setShouldPollThumbnail(false);
  }, [isThumbnail, onReadyChange, onThumbnailUrlChange, thumbnailQuery.data, videoUuid]);

  return (
    <div className="space-y-2">
      <Label>{isThumbnail ? 'Thumbnail' : 'Lecture Video'}</Label>

      <Card
        className={`cursor-pointer rounded-md border-2 py-6 shadow-none transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="pr-2 pl-5">
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />

          {/* type="thumbnail"이고 thumbnailUrl이 있을 때 서버에서 생성된 썸네일 이미지 표시 */}
          {isThumbnail && thumbnailUrl && !file ? (
            <div className="space-y-4">
              <div
                className="relative w-full overflow-hidden rounded-lg border"
                style={{ aspectRatio: '16/9', maxHeight: '250px' }}
              >
                <Image src={thumbnailUrl} alt="강의 썸네일" fill className="object-cover" sizes="100vw" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background/80 hover:bg-background absolute top-2 right-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onThumbnailUrlClear?.();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : isThumbnail && thumbnailPreviewUrl ? (
            <div className="space-y-4">
              <div
                className="relative w-full overflow-hidden rounded-lg border"
                style={{ aspectRatio: '16/9', maxHeight: '250px' }}
              >
                <Image src={thumbnailPreviewUrl} alt="업로드한 썸네일" fill className="object-cover" sizes="100vw" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background/80 hover:bg-background absolute top-2 right-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-muted-foreground text-xs">{file?.name}</div>
            </div>
          ) : file ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isThumbnail ? (
                  <FileImage className="text-primary-green-600 h-8 w-8" />
                ) : (
                  <Video className="text-primary-green-600 h-8 w-8" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-sm">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* type="thumbnail"이고 file과 thumbnailUrl 둘 다 있을 때 썸네일 이미지 표시 */}
              {isThumbnail && thumbnailUrl && (
                <div className="relative w-full overflow-hidden rounded-lg border">
                  <Image src={thumbnailUrl} alt="강의 썸네일" fill className="object-cover" sizes="100vw" />
                </div>
              )}

              {uploadStatus !== 'IDLE' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={uploadStatus === 'ERROR' ? 'destructive' : 'default'}>{getStatusText()}</Badge>
                    <span className="text-muted-foreground text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <Upload className="text-muted-foreground mx-auto h-10 w-10" />
              <div>
                <p className="font-medium">{isThumbnail ? 'Upload a thumbnail' : 'Upload a video'}</p>
                <p className="text-muted-foreground text-sm">
                  {isThumbnail ? 'JPEG or PNG' : 'MP4'} (max {maxSizeText})
                </p>
                <p className="text-muted-foreground mt-1 text-xs">Click to select a file or drag and drop</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
