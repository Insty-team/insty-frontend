'use client';

import { CourseFormData } from '../types';

import Image from 'next/image';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Check, X } from 'lucide-react';

interface CoursePreviewProps {
  formData: CourseFormData;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function CoursePreview({ formData, thumbnailUrl, videoUrl }: CoursePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Thumbnail Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Contents Thumbnail</CardTitle>
        </CardHeader>
        <CardContent>
          {thumbnailUrl ? (
            <div
              className="relative w-full overflow-hidden rounded-lg border-2 border-dashed"
              style={{ aspectRatio: '16/9', maxHeight: '400px' }}
            >
              <Image src={thumbnailUrl} alt="Contents thumbnail" fill className="object-cover" sizes="100vw" />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">Thumbnail preview</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Contents Title</p>
            <p className="text-lg font-semibold">{formData.title || 'Untitled'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Target Audience</p>
            <Badge variant="outline" className="mt-1">
              {formData.targetAudience || 'Not set'}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Contents Description</p>
            <p className="mt-1 whitespace-pre-wrap">{formData.description || 'No description'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {formData.installationRequirements && formData.installationRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.installationRequirements.map((req) => (
                <Badge
                  key={req.id}
                  variant={req.isSupported ? 'default' : 'secondary'}
                  className={cn(
                    'flex items-center gap-1',
                    req.isSupported ? 'bg-primary-green-100 text-primary-green-800' : '',
                  )}
                >
                  {req.name}
                  {req.isSupported ? <Check /> : <X />}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Points */}
      {formData.coreContents && formData.coreContents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {formData.coreContents.map((content, index) => (
                <li key={index} className="text-primary-green-800 flex items-center gap-2">
                  <span className="bg-primary-green-800 rounded-full p-1"></span>
                  <span className="font-medium">{content}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {formData.tags && formData.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
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

      {/* Video Preview */}
      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Contents Video</CardTitle>
            <CardDescription>This is the uploaded contents video.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed">
              <video
                src={videoUrl}
                controls
                className="h-auto w-full"
                style={{ aspectRatio: '16/9', maxHeight: '500px' }}
              >
                Your browser does not support video playback.
              </video>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
