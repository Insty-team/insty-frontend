"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useVideoUploadStore } from "@/app/stores/videoUpload";
import { UploadformData } from "@/app/types/course";

import CourseUploadForm from "../common/CourseUploadForm";
import PreviewUploadInfomation from "./PreviewUploadInfomation";

type Step = "upload" | "preview" | "edit";

function CourseUpload() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data, setData, reset } = useVideoUploadStore();

	const getStepFromQuery = (): Step => {
		const mode = searchParams.get("uploadmode");
		if (mode === "preview" || mode === "edit") return mode;
		return "upload";
	};

	const [step, setStepState] = useState<Step>(getStepFromQuery());

	useEffect(() => {
		setStepState(getStepFromQuery());
	}, [searchParams]);

	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	const setStep = (newStep: Step) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set("uploadmode", newStep);
		router.replace(`?${params.toString()}`);
		setStepState(newStep);
	};

	const handleUpload = (formData: UploadformData) => {
		setData(formData);
		setStep("preview");
	};

	const handleEdit = () => {
		//console.log("편집 시 store 데이터:", data);
		//console.log("thumbnailUrl:", data?.thumbnailUrl);
		setStep("edit");
	};

	const handleBack = () => {
		if (step === "preview") {
			setStep("upload");
		} else if (step === "edit") {
			setStep("preview");
		}
	};

	return (
		<>
			{step === "upload" && (
				<CourseUploadForm
					subject="강의 업로드"
					onSubmit={handleUpload}
					onBack={() => {}}
				/>
			)}
			{step === "preview" && data && (
				<PreviewUploadInfomation data={data} onEdit={handleEdit} />
			)}
			{step === "edit" && data && (
				<CourseUploadForm
					subject="업로드 전 강의 수정"
					initialData={data}
					onSubmit={handleUpload}
					onBack={handleBack}
				/>
			)}
		</>
	);
}

export default CourseUpload;
