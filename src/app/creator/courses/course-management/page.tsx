import { Suspense } from "react";

import Loading from "@/app/_components/common/Loading";

import CourseManagement from "../_component/manage/CourseManagement";
function CourseManagementPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center h-full">
					<Loading />
				</div>
			}
		>
			<CourseManagement />
		</Suspense>
	);
}

export default CourseManagementPage;
