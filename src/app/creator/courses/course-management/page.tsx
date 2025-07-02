import { Suspense } from "react";

import CourseManagement from "../_component/manage/CourseManagement";
function CourseManagementPage() {
	return (
		<Suspense fallback={""}>
			<CourseManagement />
		</Suspense>
	);
}

export default CourseManagementPage;
