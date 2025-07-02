import { Suspense } from "react";

import Loading from "@/app/_components/common/Loading";

import CourseUpload from "../_component/upload/CourseUpload";

function CourseUploadPage() {
	return (
		<Suspense
			fallback={
				<>
					강의 업로드 페이지 준비중... <Loading />
				</>
			}
		>
			<CourseUpload />
		</Suspense>
	);
}

export default CourseUploadPage;
