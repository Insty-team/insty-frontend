"use client";

import { useState } from "react";

import { useVideoUploadStore } from "@/app/stores/videoUpload";
import { UploadformData } from "@/app/types";

import CourseForm from "../common/CourseForm";
import PreviewInfomation from "./PreviewInfomation";

function CourseUpload() {
	const [step, setStep] = useState<"upload" | "preview" | "edit">("upload");
	const { data, setData } = useVideoUploadStore();

	const handleUpload = (formData: UploadformData) => {
		setData(formData);
		console.log(data);
		setStep("preview");
	};

	const handleEdit = () => {
		setStep("edit");
	};

	return (
		<>
			{step === "upload" && (
				<CourseForm
					subject="영상 업로드"
					onSubmit={handleUpload}
					onBack={() => {}}
				/>
			)}
			{step === "preview" && data && (
				<PreviewInfomation
					data={data}
					onEdit={() => handleEdit()}
					mode="creator"
				/>
			)}
			{step === "edit" && data && (
				<CourseForm
					subject="영상 수정"
					initialData={data}
					onSubmit={handleUpload}
					onBack={() => setStep("preview")}
				/>
			)}
		</>
	);
}

export default CourseUpload;
