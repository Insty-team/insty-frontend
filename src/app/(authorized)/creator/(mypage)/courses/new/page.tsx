import { CourseUploadForm } from './_components/CourseUploadForm';

import { CourseRequestRecommendationItem } from '@/shared/services/ai-community/ai-community.type';

type Props = {
  searchParams: Promise<{ rec?: string }>;
};

export default async function NewCoursePage({ searchParams }: Props) {
  const params = await searchParams;
  let recommendation: CourseRequestRecommendationItem | undefined;
  try {
    if (params.rec) recommendation = JSON.parse(decodeURIComponent(params.rec)) as CourseRequestRecommendationItem;
  } catch {
    // invalid rec param — ignore
  }
  return <CourseUploadForm recommendation={recommendation} />;
}
