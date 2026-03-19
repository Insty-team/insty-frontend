import { useEffect, useState } from 'react';
import { usePostVideoPlaylist } from '@/shared/services/video/video.hook';
import { GET_video_playlist_by_signed_url } from '@/shared/services/video/video.service';
import { VideoType } from '@/shared/services/course/course.type';

type Params = {
  type: VideoType;
  id: string;
  enabled?: boolean;
};

export default function useVideoPlaylist({ type, id, enabled = true }: Params) {
  const { mutateAsync: requestPlaylist } = usePostVideoPlaylist();
  const [m3u8Url, setM3u8Url] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !id) return;

    let canceled = false;
    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const playlistRes = await requestPlaylist({
          type,
          id,
        });

        const signedUrl = playlistRes.data?.signedUrl;
        if (!signedUrl) throw new Error('No signedUrl');

        const url = await GET_video_playlist_by_signed_url(signedUrl);

        if (!canceled) setM3u8Url(url);
      } catch (e) {
        console.error('비디오 재생 URL 로딩 실패:', e);
        if (!canceled) {
          setM3u8Url(null);
          setError(e instanceof Error ? e : new Error('Unknown error'));
        }
      } finally {
        if (!canceled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type, enabled]);

  return { m3u8Url, isLoading, error };
}
