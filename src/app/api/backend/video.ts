import axios from "axios";
import axiosInstance from "../interceptor";
import { VideoUploadResponse } from "@/app/types/video";
import { ApiResponse } from "@/app/types/api";

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

export { postCourseVideo };
