'use client';

import { useRef, useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { FileImage, Upload, Video, X } from 'lucide-react';

interface FileUploadProps {
  type: 'thumbnail' | 'video';
  file: File | null;
  onFileSelect: (file: File | null) => void;
  uploadProgress?: number;
  uploadStatus?: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  error?: string;
}

export function FileUpload({
  type,
  file,
  onFileSelect,
  uploadProgress = 0,
  uploadStatus = 'IDLE',
  error,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const isThumbnail = type === 'thumbnail';
  const accept = isThumbnail ? 'image/jpeg,image/png' : 'video/mp4';
  const maxSize = isThumbnail ? 5 * 1024 * 1024 : 500 * 1024 * 1024; // 5MB for images, 500MB for videos
  const maxSizeText = isThumbnail ? '5MB' : '500MB';

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

    onFileSelect(selectedFile);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'PROCESSING':
        return 'bg-blue-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'ERROR':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'PROCESSING':
        return '업로드 중...';
      case 'COMPLETED':
        return '업로드 완료';
      case 'ERROR':
        return '업로드 실패';
      default:
        return '대기 중';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{isThumbnail ? '강의 썸네일' : '강의 영상'}</Label>

      <Card
        className={`cursor-pointer py-4 transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="pr-2 pl-5">
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />

          {file ? (
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
              <Upload className="text-muted-foreground mx-auto h-12 w-12" />
              <div>
                <p className="font-medium">{isThumbnail ? '썸네일을 업로드하세요' : '영상을 업로드하세요'}</p>
                <p className="text-muted-foreground text-sm">
                  {isThumbnail ? 'JPEG, PNG 파일' : 'MP4 파일'} (최대 {maxSizeText})
                </p>
                <p className="text-muted-foreground mt-1 text-xs">클릭하거나 파일을 드래그하여 업로드</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
