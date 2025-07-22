import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { getVideoThumbnail } from "@/app/api/backend";

interface UseThumbnailUploadReturn {
	thumbnailUrl: string;
	setThumbnailUrl: (url: string) => void;
	isThumbnailLoading: boolean;
	startThumbnailRequest: (uuid: string) => void;
	stopThumbnailRequest: () => void;
}

export const useThumbnailUpload = (): UseThumbnailUploadReturn => {
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
	const thumbnailRequestCountRef = useRef(0);
	const thumbnailIntervalRef = useRef<NodeJS.Timeout | null>(null);
	//최신 썸네일 참조
	const thumbnailUrlRef = useRef("");
	//요청 활성화 여부 참조
	const isActiveRef = useRef(false);

	const MAX_THUMBNAIL_REQUESTS = 120; // 10분 (5초 × 120번)

	useEffect(() => {
		thumbnailUrlRef.current = thumbnailUrl;
		if (thumbnailUrl) {
			isActiveRef.current = false;
		}
	}, [thumbnailUrl]);

	const requestThumbnail = async (uuid: string) => {
		if (!isActiveRef.current) {
			return true;
		}

		if (!thumbnailIntervalRef.current) {
			return true;
		}

		if (thumbnailUrlRef.current) {
			isActiveRef.current = false;
			setIsThumbnailLoading(false);
			if (thumbnailIntervalRef.current) {
				clearInterval(thumbnailIntervalRef.current);
				thumbnailIntervalRef.current = null;
			}
			return true;
		}

		thumbnailRequestCountRef.current += 1;
		//console.log(thumbnailRequestCountRef.current, "썸네일 요청 횟수");

		if (thumbnailRequestCountRef.current > MAX_THUMBNAIL_REQUESTS) {
			isActiveRef.current = false;
			setIsThumbnailLoading(false);
			if (thumbnailIntervalRef.current) {
				clearInterval(thumbnailIntervalRef.current);
				thumbnailIntervalRef.current = null;
			}
			Swal.fire({
				title: "썸네일 생성 시간 초과",
				text: "썸네일을 생성하지 못했습니다. 직접 업로드 해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			});
			return false;
		}

		try {
			const thumbnailResponse = await getVideoThumbnail(uuid);
			if (thumbnailResponse && thumbnailResponse.data) {
				//console.log(thumbnailResponse, "썸네일 요청 성공");
				setThumbnailUrl(thumbnailResponse.data.thumbnailUrl);
				isActiveRef.current = false;
				setIsThumbnailLoading(false);
				// 성공하면 인터벌 정리
				if (thumbnailIntervalRef.current) {
					clearInterval(thumbnailIntervalRef.current);
					thumbnailIntervalRef.current = null;
				}
				return true;
			}
		} catch (error) {
			console.error("썸네일 요청 실패:", error);
			if (error && typeof error === "object" && "response" in error) {
				const errorResponse = error as { response?: { status?: number } };
				if (errorResponse.response?.status !== 403) {
					isActiveRef.current = false;
					setIsThumbnailLoading(false);
					if (thumbnailIntervalRef.current) {
						clearInterval(thumbnailIntervalRef.current);
						thumbnailIntervalRef.current = null;
					}
				}
			}
		}
		return false;
	};

	const startThumbnailRequest = (uuid: string) => {
		if (thumbnailUrlRef.current) {
			//console.log("이미 썸네일이 존재하므로 요청을 시작하지 않습니다.");
			return;
		}

		isActiveRef.current = true;
		setIsThumbnailLoading(true);
		thumbnailRequestCountRef.current = 0;
		requestThumbnail(uuid);

		thumbnailIntervalRef.current = setInterval(() => {
			requestThumbnail(uuid);
		}, 5000);
	};

	const stopThumbnailRequest = () => {
		isActiveRef.current = false;
		setIsThumbnailLoading(false);
		thumbnailRequestCountRef.current = 0;
		if (thumbnailIntervalRef.current) {
			clearInterval(thumbnailIntervalRef.current);
			thumbnailIntervalRef.current = null;
		}
	};

	useEffect(() => {
		return () => {
			isActiveRef.current = false;
			if (thumbnailIntervalRef.current) {
				clearInterval(thumbnailIntervalRef.current);
			}
		};
	}, []);

	return {
		thumbnailUrl,
		setThumbnailUrl,
		isThumbnailLoading,
		startThumbnailRequest,
		stopThumbnailRequest,
	};
};
