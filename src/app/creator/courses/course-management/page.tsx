import { Suspense } from "react";

import Loading from "@/app/_components/common/Loading";

import CourseManagement from "../_component/manage/CourseManagement";
function CourseManagementPage() {
	return (
		<Suspense fallback={<Loading />}>
			<CourseManagement />
		</Suspense>
	);
}

export default CourseManagementPage;
