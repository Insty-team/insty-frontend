import { usePostAnswerVideoUpload, usePostCourseVideoUpload, usePostQuestionVideoUpload, usePostCommunityPostVideoUpload, usePostCommunityCommentVideoUpload } from '@/shared/services/video/video.hook';

export type PresignedVideoUploadKind = 'QUESTION' | 'ANSWER' | 'COURSE' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';

type Params = {
  kind: PresignedVideoUploadKind;
  file: File;
};

export default function usePresignedVideoUpload() {
  const { mutateAsync: uploadQuestionVideo } = usePostQuestionVideoUpload();
  const { mutateAsync: uploadAnswerVideo } = usePostAnswerVideoUpload();
  const { mutateAsync: uploadCourseVideo } = usePostCourseVideoUpload();
  const { mutateAsync: uploadCommunityPostVideo } = usePostCommunityPostVideoUpload();
  const { mutateAsync: uploadCommunityCommentVideo } = usePostCommunityCommentVideoUpload();

  const uploadVideo = async ({ kind, file }: Params) => {
    const payload = { fileName: file.name, contentType: file.type };
    
    const presignedRes = await (async () => {
      switch (kind) {
        case 'QUESTION':
          return uploadQuestionVideo(payload);
        case 'ANSWER':
          return uploadAnswerVideo(payload);
        case 'COURSE':
          return uploadCourseVideo(payload);
        case 'COMMUNITY_POST':
          return uploadCommunityPostVideo(payload);
        case 'COMMUNITY_COMMENT':
          return uploadCommunityCommentVideo(payload);
        default:
          throw new Error('Unsupported video upload kind');
      }
    })();

    const { uploadUrl, uuid } = presignedRes.data;

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Video upload failed (${putRes.status})`);
    }

    return uuid;
  };

  return { uploadVideo };
}
