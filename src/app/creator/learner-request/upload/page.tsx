"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//import { patchRecommendationStatus } from "@/app/api";
import CourseUploadForm from "@/app/creator/courses/_component/common/CourseUploadForm";
import PreviewUploadInfomation from "@/app/creator/courses/_component/upload/PreviewUploadInfomation";
import { useVideoUploadStore } from "@/app/stores/videoUpload";
import type { UploadformData } from "@/app/types/course";

type Step = "upload" | "preview" | "edit";

interface LearnerRequest {
	request_id: number;
	title: string;
	description: string;
	// 필요한 필드만 추가
}

function LearnerRequestUpload() {
	const router = useRouter();
	const { data, setData, reset } = useVideoUploadStore();
	const [step, setStep] = useState<Step>("upload");
	const [request, setRequest] = useState<LearnerRequest | null>(null);

	// 1) localStorage 에서 선택된 러너 요청 가져오기
	useEffect(() => {
		const stored = localStorage.getItem("selectedLearnerRequest");
		if (!stored) {
			router.replace("/creator/learner-request");
			return;
		}

		try {
			const parsed = JSON.parse(stored) as {
				request: LearnerRequest;
				timestamp: number;
			};

			setRequest(parsed.request);
		} catch {
			router.replace("/creator/learner-request");
		}
	}, [router]);

	// useEffect(() => {
	// 	return () => {
	// 		handleDeclineRequest();
	// 	};
	// }, []);

	// const handleDeclineRequest = async () => {
	// 	const stored = localStorage.getItem("selectedLearnerRequest");
	// 	if (!stored) return; // 없으면 그냥 종료

	// 	try {
	// 		const parsed = JSON.parse(stored);
	// 		const requestId = parsed?.request?.request_id;
	// 		if (!requestId) return;

	// 		await patchRecommendationStatus(requestId, "DECLINED");
	// 		console.log("상태 업데이트 완료!!", requestId, "DECLINED");
	// 		localStorage.removeItem("selectedLearnerRequest");
	// 	} catch (e) {
	// 		console.error("handleDeclineRequest error", e);
	// 	}
	// };

	// 2) 언마운트 시 업로드 스토어 초기화
	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	const handleStepChange = (next: Step) => {
		setStep(next);
	};

	const handleUpload = (formData: UploadformData) => {
		setData(formData);
		handleStepChange("preview");
	};

	const handleEdit = () => {
		handleStepChange("edit");
	};

	const handleBack = () => {
		if (step === "preview") handleStepChange("upload");
		else if (step === "edit") handleStepChange("preview");
	};

	if (!request) return null; // or 로딩 UI

	return (
		<>
			{step === "upload" && (
				<CourseUploadForm
					subject="학습자 요청 업로드"
					onSubmit={handleUpload}
					onBack={() => router.back()}
					mode="requestUpload"
					// 필요하면 learnerRequest 관련 prop 추가해서 내부에서 사용
				/>
			)}

			{step === "preview" && data && (
				<PreviewUploadInfomation
					data={data}
					onEdit={handleEdit}
					mode="learnerRequest"
					requestId={request.request_id}
					// 여기에도 요청정보 보여주고 싶으면 prop 추가
				/>
			)}

			{step === "edit" && data && (
				<CourseUploadForm
					subject="업로드 전 강의 수정"
					initialData={data}
					onSubmit={handleUpload}
					onBack={handleBack}
					mode="requestUpload"
				/>
			)}
		</>
	);
}

export default LearnerRequestUpload;
