import React, { Suspense } from "react";
import CourseUpload from "../_component/upload/CourseUpload";

function CourseUploadPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CourseUpload />
		</Suspense>
	);
}

export default CourseUploadPage;
