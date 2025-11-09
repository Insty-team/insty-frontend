import axios from "axios";

import { ApiResponse } from "@/app/types/api";
import { VideoUploadResponse } from "@/app/types/video";

import axiosInstance from "../interceptor";

// 영상 관련 API
const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

interface VideoType {
	fileName: string;
	contentType: string;
}

const postCourseVideo = async (videoInfo: VideoType) => {
	try {
		const res = await axiosInstance.post<ApiResponse<VideoUploadResponse>>(
			`${BASE_URL}/videos/upload/course`,
			videoInfo,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

const putCourseVideoUpload = async (videoUrl: string, file: File) => {
	const s3AxiosInstance = axios.create({
		withCredentials: false,
	});

	const res = await s3AxiosInstance.put(videoUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
	console.log(res.data);
	return res.data;
};

const getCourseVideoPreview = async (signedUrl: string) => {
	const s3AxiosInstance = axios.create({
		withCredentials: true,
	});
	const res = await s3AxiosInstance.get(signedUrl);
	return res.data;
};

const postPreviewVideo = async (type: string, id: number) => {
	try {
		const res = await axiosInstance.post(`${BASE_URL}/videos/preview`, {
			type,
			id,
		});

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}

	throw new Error("서버와 통신 불가");
};

const postPlayListVideo = async (type: string, id: number) => {
	try {
		const res = await axiosInstance.post(`${BASE_URL}/videos/playlist`, {
			type,
			id,
		});

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}

	throw new Error("서버와 통신 불가");
};

const getPlaylistVideo = async (signedUrl: string) => {
	const s3AxiosInstance = axios.create({
		withCredentials: true,
	});
	const res = await s3AxiosInstance.get(signedUrl);
	return res.data;
};

// 질문 영상 등록
const postQuestionVideo = async (videoInfo: VideoType) => {
	try {
		const res = await axiosInstance.post(
			`${BASE_URL}/videos/upload/question`,
			videoInfo,
		);
		console.log("질문 영상", res.data);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}
};

const putQuestionVideoUpload = async (videoUrl: string, file: File) => {
	const s3AxiosInstance = axios.create({
		withCredentials: false,
	});

	const res = await s3AxiosInstance.put(videoUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
	console.log(res.data);
	return res.data;
};

// 댓글 영상 등록
const postAnswerVideo = async (videoInfo: VideoType) => {
	try {
		const res = await axiosInstance.post(
			`${BASE_URL}/videos/upload/answer`,
			videoInfo,
		);
		console.log("댓글 영상", res.data);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}
};

const putAnswerVideoUpload = async (videoUrl: string, file: File) => {
	const s3AxiosInstance = axios.create({
		withCredentials: false,
	});

	const res = await s3AxiosInstance.put(videoUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
	console.log(res.data);
	return res.data;
};

export {
	getCourseVideoPreview,
	getPlaylistVideo,
	postAnswerVideo,
	postCourseVideo,
	postPlayListVideo,
	postPreviewVideo,
	postQuestionVideo,
	putAnswerVideoUpload,
	putCourseVideoUpload,
	putQuestionVideoUpload,
};
