import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Spinner } from '@/shared/components/ui/spinner';
import useVideoPlaylist from '@/shared/hooks/video/useVideoPlaylist';
import { Attachment, VideoType } from '@/shared/services/community/community.type';
import dayjs from 'dayjs';
import { Calendar, Heart, MessageCircle } from 'lucide-react';

const CommunityPostVideoPlayer = ({ postId, videoType }: { postId: number; videoType: VideoType }) => {
  const { m3u8Url, isLoading: isLoadingVideo } = useVideoPlaylist({
    type: videoType,
    id: postId.toString(),
    enabled: !!postId,
  });

  return (
    <div className="mb-6 overflow-hidden rounded-lg border">
      {isLoadingVideo || !m3u8Url ? (
        <div className="bg-muted flex items-center justify-center py-20">
          <Spinner className="size-6" />
        </div>
      ) : (
        <div className="aspect-video">
          <ReactPlayer src={m3u8Url} controls width="100%" height="100%" />
        </div>
      )}
    </div>
  );
};

type CommunityPostDetailProps = {
  postData:
    | {
        postId?: number;
        user?: {
          id?: number;
          nickname?: string;
        };
        content: string;
        createdAt?: string;
        attachments?: Attachment[];
        videoInfo?: {
          videoType: VideoType;
          videoUuid: string;
          originFileName: string;
        } | null;
        likeCount?: number;
        commentCount?: number;
        likedByMe?: boolean;
      }
    | null
    | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onToggleLike?: () => void;
  onToggleComment?: () => void;
  isLiking?: boolean;
  isUnliking?: boolean;
};

export default function CommunityPostDetail({
  postData,
  isLoading = false,
  isError = false,
  onToggleLike,
  onToggleComment,
  isLiking = false,
  isUnliking = false,
}: CommunityPostDetailProps) {
  const renderAttachments = (attachments: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {attachments
          .filter((file) => file?.url)
          .map((file) => (
            <div key={file.id} className="relative inline-block">
              <Image
                src={file.url}
                alt={file.name}
                width={0}
                height={0}
                sizes="100vw"
                className="h-60 w-auto rounded border object-contain"
              />
            </div>
          ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
        <Spinner className="size-4" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return <div className="text-muted-foreground py-8 text-center text-sm">Failed to load post details.</div>;
  }

  if (!postData) {
    return <div className="text-muted-foreground py-8 text-center text-sm">Post information not found.</div>;
  }

  return (
    <div className="border-b p-6">
      {/* 포스트 헤더 */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {postData.user?.nickname?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-medium">{postData.user?.nickname}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {postData.createdAt ? dayjs(postData.createdAt).format('MMM D, YYYY h:mm A') : ''}
            </div>
          </div>
        </div>
      </div>

      {/* 포스트 내용 */}
      <div className="text-foreground mb-6 leading-relaxed whitespace-pre-wrap">{postData.content}</div>

      {/* 비디오 */}
      {postData.videoInfo?.videoUuid && postData.postId && (
        <CommunityPostVideoPlayer postId={postData.postId} videoType={postData.videoInfo.videoType} />
      )}

      {/* 이미지 */}
      {postData.attachments && renderAttachments(postData.attachments)}

      {/* 포스트 푸터 */}
      <div className="mt-6 flex items-center gap-3 pt-4">
        {onToggleLike && (
          <button
            className={`flex items-center gap-2 transition-all duration-300 ${
              postData.likedByMe ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={onToggleLike}
            disabled={isLiking || isUnliking}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                postData.likedByMe ? 'scale-110 fill-current' : 'scale-100'
              }`}
            />
            <span className="text-sm">{postData.likeCount ?? 0}</span>
          </button>
        )}
        {onToggleComment ? (
          <button
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            onClick={onToggleComment}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{postData.commentCount ?? 0}</span>
          </button>
        ) : (
          <div className="text-muted-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{postData.commentCount ?? 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}
