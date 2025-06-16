import { UploadformData } from "@/app/types";

import CourseForm from "../common/CourseForm";
import { useGetCourseDetailQuery } from "@/app/queries/course";

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
		<CourseForm
			subject="콘텐츠 수정"
			initialData={courseDetail}
			onSubmit={handleSubmit}
			submitText="수정하기"
			onBack={onBack}
		/>
	);
}

export default CourseEdit;
