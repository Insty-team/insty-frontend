import CourseManagement from "../_component/manage/CourseManagement";
import { Suspense } from "react";
function CourseManagementPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CourseManagement />
		</Suspense>
	);
}

export default CourseManagementPage;
