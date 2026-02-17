import { usePostAnswerVideoUpload, usePostCourseVideoUpload, usePostQuestionVideoUpload } from '@/shared/services/video/video.hook';

export type PresignedVideoUploadKind = 'QUESTION' | 'ANSWER' | 'COURSE' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT';

type Params = {
  kind: PresignedVideoUploadKind;
  file: File;
};

export default function usePresignedVideoUpload() {
  const { mutateAsync: uploadQuestionVideo } = usePostQuestionVideoUpload();
  const { mutateAsync: uploadAnswerVideo } = usePostAnswerVideoUpload();
  const { mutateAsync: uploadCourseVideo } = usePostCourseVideoUpload();

  const uploadVideo = async ({ kind, file }: Params) => {
    const payload = { fileName: file.name, contentType: file.type };
    
    const presignedRes = await (async () => {
      switch (kind) {
        case 'QUESTION':
        case 'COMMUNITY_POST':
          return uploadQuestionVideo(payload);
        case 'ANSWER':
        case 'COMMUNITY_COMMENT':
          return uploadAnswerVideo(payload);
        case 'COURSE':
          return uploadCourseVideo(payload);
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
