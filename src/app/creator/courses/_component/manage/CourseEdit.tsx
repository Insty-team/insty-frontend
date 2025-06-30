import { useGetCourseDetailQuery } from "@/app/queries/course";

import CourseEditForm from "../common/CourseEditForm";

function CourseEdit({
	courseId,
	onBack,
}: {
	courseId: number;
	onBack: () => void;
}) {
	const { data: courseDetail } = useGetCourseDetailQuery(courseId);

	console.log(courseDetail);

	return (
		<CourseEditForm
			subject="콘텐츠 수정"
			initialData={courseDetail?.data}
			onBack={onBack}
		/>
	);
}

export default CourseEdit;
