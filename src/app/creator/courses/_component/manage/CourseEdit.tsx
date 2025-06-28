import { useGetCourseDetailQuery } from "@/app/queries/course";
import { UploadformData } from "@/app/types/course";

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

	const handleSubmit = (formData: UploadformData) => {
		console.log(formData);
	};

	return (
		<CourseEditForm
			subject="콘텐츠 수정"
			initialData={courseDetail}
			onSubmit={handleSubmit}
			submitText="수정하기"
			onBack={onBack}
		/>
	);
}

export default CourseEdit;
