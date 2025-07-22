import Loading from "@/app/_components/common/Loading";
import { useGetCourseDetailQuery } from "@/app/queries/course";

import CourseEditForm from "../common/CourseEditForm";

function CourseEdit({
	courseId,
	onBack,
}: {
	courseId: number;
	onBack: () => void;
}) {
	const {
		data: courseDetail,
		isLoading,
		//error,
	} = useGetCourseDetailQuery(courseId);

	//console.log("CourseDetail Response:", courseDetail);
	//console.log("CourseDetail Error:", error);

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p> 강의 정보를 불러오고 있습니다...</p>
				<Loading />
			</div>
		);
	}

	return (
		<CourseEditForm
			subject="콘텐츠 수정"
			initialData={courseDetail?.data}
			courseId={courseId}
			onBack={onBack}
		/>
	);
}

export default CourseEdit;
