import { Suspense } from "react";

import Loading from "@/app/_components/common/Loading";

import CourseUpload from "../_component/upload/CourseUpload";

function CourseUploadPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center h-[90vh]">
					<p className="text-xl font-semibold">강의 업로드 페이지 준비중...</p>
					<Loading width={40} height={40} />
				</div>
			}
		>
			<CourseUpload />
		</Suspense>
	);
}

export default CourseUploadPage;
