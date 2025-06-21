"use client";

import React, { memo, useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { RiRewindStartMiniFill, RiForwardEndMiniFill } from "react-icons/ri";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { formatTime } from "@/app/utils/date";

interface VideoPlayerProps {
	url: string;
	width?: string;
	height?: string;
	onDurationChange?: (duration: number) => void;
}

const VideoPlayer = memo(
	({
		url,
		width = "100%",
		height = "100%",
		onDurationChange,
	}: VideoPlayerProps) => {
		const [isPlaying, setIsPlaying] = useState(false);
		const [isMuted, setIsMuted] = useState(false);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const [volume, setVolume] = useState(0.5);
		const [currentTime, setCurrentTime] = useState(0);
		const [videoDuration, setVideoDuration] = useState(0);
		const playerRef = useRef<ReactPlayer>(null);

		const togglePlay = useCallback(() => {
			setIsPlaying(!isPlaying);
		}, [isPlaying]);

		const jumpTenSeconds = useCallback(() => {
			if (playerRef.current) {
				const currentTime = playerRef.current.getCurrentTime();
				const newTime = Math.min(videoDuration, currentTime + 10);
				playerRef.current.seekTo(newTime, "seconds");
			}
		}, [videoDuration]);

		const backTenSeconds = useCallback(() => {
			if (playerRef.current) {
				const currentTime = playerRef.current.getCurrentTime();
				const newTime = Math.max(0, currentTime - 10);
				playerRef.current.seekTo(newTime, "seconds");
			}
		}, []);

		const toggleMute = useCallback(() => {
			setIsMuted(!isMuted);
		}, [isMuted]);

		const handleVolumeChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newVolume = parseFloat(e.target.value);
				setVolume(newVolume);
				setIsMuted(newVolume === 0);
			},
			[],
		);

		const toggleFullscreen = useCallback(() => {
			if (playerRef.current) {
				const wrapper = playerRef.current.getInternalPlayer()?.parentElement;
				if (wrapper) {
					if (!isFullscreen) {
						if (wrapper.requestFullscreen) {
							wrapper.requestFullscreen();
						}
					} else {
						if (document.exitFullscreen) {
							document.exitFullscreen();
						}
					}
					setIsFullscreen(!isFullscreen);
				}
			}
		}, [isFullscreen]);

		const handleProgress = useCallback((state: { playedSeconds: number }) => {
			setCurrentTime(state.playedSeconds);
		}, []);

		const handleDuration = useCallback(
			(duration: number) => {
				setVideoDuration(duration);
				onDurationChange?.(duration);
			},
			[onDurationChange],
		);

		const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newTime = parseFloat(e.target.value);
			setCurrentTime(newTime);
			if (playerRef.current) {
				playerRef.current.seekTo(newTime, "seconds");
			}
		};

		return (
			<div className="flex flex-col bg-gray-scale-100 rounded-2xl p-4 shadow-lg">
				<div
					className={`${width} h-auto bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg`}
				>
					<ReactPlayer
						url={url}
						playing={isPlaying}
						controls={false}
						width="100%"
						height="100%"
						onDuration={handleDuration}
						onProgress={handleProgress}
						progressInterval={1000}
						ref={playerRef}
						volume={isMuted ? 0 : volume}
					/>
				</div>

				<div className="w-full mt-3">
					<input
						type="range"
						min={0}
						max={videoDuration || 0}
						value={currentTime}
						onChange={handleSeek}
						className="w-full h-2 rounded-lg appearance-none cursor-pointer"
						style={{
							background: `linear-gradient(to right, #479b5d ${
								(currentTime / videoDuration) * 100
							}%, #d1d5db ${(currentTime / videoDuration) * 100}%)`,
						}}
					/>
				</div>

				<div className="flex items-center justify-between bg-gradient-to-r from-primary-green-600 to-primary-green-700 p-4 rounded-lg mt-2 shadow-inner">
					<div className="flex items-center gap-3">
						<button
							title={isPlaying ? "일시정지" : "재생"}
							className="flex items-center justify-center w-10 h-10 transition-all duration-200 text-white hover:bg-primary-green-800 hover:rounded-full"
							onClick={togglePlay}
						>
							{isPlaying ? (
								<FaPause className="w-6 h-6" />
							) : (
								<VscDebugStart className="w-6 h-6" />
							)}
						</button>

						<button
							title="10초 뒤로"
							onClick={backTenSeconds}
							className="flex items-center justify-center w-10 h-10 bg-opacity-20 transition-all duration-200 text-white hover:bg-primary-green-800 hover:rounded-full"
						>
							<RiRewindStartMiniFill className="w-6 h-6" />
						</button>

						<button
							title="10초 앞으로"
							onClick={jumpTenSeconds}
							className="flex items-center justify-center w-10 h-10 transition-all duration-200 text-white hover:bg-primary-green-800 hover:rounded-full"
						>
							<RiForwardEndMiniFill className="w-6 h-6" />
						</button>
					</div>

					<div className="text-white text-md font-medium">
						{formatTime(currentTime)} / {formatTime(videoDuration)}
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<button
								title={isMuted ? "음소거 해제" : "음소거"}
								onClick={toggleMute}
								className="flex items-center justify-center w-10 h-10 transition-all duration-200 text-white hover:bg-primary-green-800 hover:rounded-full"
							>
								{isMuted ? (
									<FaVolumeMute className="w-6 h-6" />
								) : (
									<FaVolumeUp className="w-6 h-6" />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={isMuted ? 0 : volume}
								onChange={handleVolumeChange}
								className="w-16 h-1 bg-primary-blue-600 rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<button
							title="전체 화면"
							onClick={toggleFullscreen}
							className="flex items-center justify-center w-8 h-8 transition-all duration-200 text-white hover:bg-primary-green-800 hover:rounded-full"
						>
							{isFullscreen ? (
								<BiExitFullscreen className="w-6 h-6" />
							) : (
								<BiFullscreen className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</div>
		);
	},
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
