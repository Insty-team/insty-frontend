"use client";

import React from "react";

import CourseUploadForm from "@/app/creator/courses/_component/common/CourseUploadForm";

function LearnerRequestUpload() {
	return (
		<>
			<CourseUploadForm
				subject={"학습자 요청 업로드"}
				onSubmit={() => {}}
				onBack={() => {}}
				mode="requestUpload"
			/>
		</>
	);
}

export default LearnerRequestUpload;
