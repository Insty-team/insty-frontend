export interface CourseFormData {
  title: string;
  targetAudience: string;
  description: string;
  thumbnail?: File;
  video?: File;
  installationRequirements: InstallationRequirement[];
  coreContents: string[];
  tags: string[];
}

export interface InstallationRequirement {
  id: string;
  name: string;
  isSupported: boolean;
}

export interface UploadProgress {
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  progress: number;
  message?: string;
}

// 강의 업로드 단계 관리
export type UploadStep = 'UPLOAD' | 'AI_GENERATING' | 'EDIT' | 'PREVIEW';

export interface CourseDraft {
  title: string;
  targetAudience: string;
  description: string;
  installationRequirements: InstallationRequirement[];
  coreContents: string[];
  tags: string[];
}
