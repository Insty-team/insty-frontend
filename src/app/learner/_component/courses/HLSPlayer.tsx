import Hls from "hls.js";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface HLSPlayerProps {
	src: string;
	width?: string;
	height?: string;
	onDurationChange?: (duration: number) => void;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({
	src,
	width = "100%",
	height = "auto",
	onDurationChange,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [error, setError] = useState<string | null>(null);
	const hlsRef = useRef<Hls | null>(null);

	// HLS 초기화 함수를 useCallback으로 메모이제이션
	const initializeHLS = useCallback(() => {
		if (!videoRef.current || !Hls.isSupported()) return;

		// 기존 HLS 인스턴스 정리
		if (hlsRef.current) {
			hlsRef.current.destroy();
			hlsRef.current = null;
		}

		const hls = new Hls({
			xhrSetup: (xhr) => {
				xhr.withCredentials = true;
			},
		});

		hls.on(Hls.Events.ERROR, (event, data) => {
			console.error("HLS error:", data);
			setError(`HLS 오류: ${data.type}`);
		});

		hls.on(Hls.Events.MANIFEST_PARSED, () => {
			//console.log("HLS manifest parsed");
			setError(null);
		});

		hls.loadSource(src);
		hls.attachMedia(videoRef.current);
		hlsRef.current = hls;

		// 비디오 메타데이터 로드 이벤트 리스너 추가
		const videoElement = videoRef.current;
		const handleLoadedMetadata = () => {
			if (videoElement && onDurationChange) {
				onDurationChange(videoElement.duration);
			}
		};

		videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

		// 클린업 함수에서 이벤트 리스너 제거
		return () => {
			videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
		};
	}, [src, onDurationChange]);

	// src가 변경될 때만 HLS 초기화
	useEffect(() => {
		//console.log("HLSPlayer src:", src);
		setError(null);
		initializeHLS();

		// 클린업 함수
		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
		};
	}, [src, initializeHLS]);

	// 컴포넌트 언마운트 시 정리
	useEffect(() => {
		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
		};
	}, []);

	if (error) {
		return (
			<div
				style={{ width, height }}
				className="bg-gray-200 rounded-2xl flex items-center justify-center"
			>
				<div className="text-red-500 text-center p-4">
					<p>비디오 로드 오류: {error}</p>
					<p className="text-sm mt-2">URL: {src}</p>
				</div>
			</div>
		);
	}

	return (
		<video
			ref={videoRef}
			controls
			style={{ width, height, background: "#e5e7eb", borderRadius: "16px" }}
		/>
	);
};

export default HLSPlayer;
