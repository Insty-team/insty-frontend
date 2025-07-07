import { useEffect, useRef, useState } from "react";

import { getTranscriptionStatus } from "@/app/api/ai";

export const useTranscriptionProgress = (videoUuid: string | null) => {
	const [transcriptionStatus, setTranscriptionStatus] = useState<string | null>(
		null,
	);
	const [transcriptionProgress, setTranscriptionProgress] = useState<number>(0);
	const [transcriptionStep, setTranscriptionStep] = useState<string>("");
	const [reason, setReason] = useState<string>("");
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!videoUuid) return;

		// 이미 polling 중이면 중복 방지
		if (pollingRef.current) return;

		const poll = async () => {
			try {
				const statusRes = await getTranscriptionStatus(videoUuid);
				console.log(statusRes);
				if (statusRes?.success && statusRes.data) {
					setTranscriptionStatus(statusRes.data.status);
					setTranscriptionProgress(statusRes.data.progress);
					setTranscriptionStep(statusRes.data.step);
					if (statusRes.data.reason) {
						setReason(statusRes.data.reason);
					}

					if (
						statusRes.data.status === "COMPLETED" ||
						statusRes.data.status === "FAILED"
					) {
						if (pollingRef.current) {
							clearInterval(pollingRef.current);
							pollingRef.current = null;
						}
					}
				} else {
					// 응답 실패 시 polling 중단
					if (pollingRef.current) {
						clearInterval(pollingRef.current);
						pollingRef.current = null;
					}
				}
			} catch (e) {
				console.error("전사 상태 조회 실패", e);
				if (pollingRef.current) {
					clearInterval(pollingRef.current);
					pollingRef.current = null;
				}
			}
		};

		pollingRef.current = setInterval(poll, 2000); // 2초 간격

		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		};
	}, [videoUuid]);

	return {
		transcriptionStatus,
		transcriptionProgress,
		transcriptionStep,
		reason,
	};
};
