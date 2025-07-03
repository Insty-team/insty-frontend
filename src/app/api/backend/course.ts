import axios from "axios";

import { CourseUpdateReq, UploadformData } from "@/app/types/course";

import axiosInstance from "../interceptor";

// 강의 관련 API
const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

const getMyCourses = async (page: number, pageSize: number) => {
	const res = await axiosInstance.get(`${BASE_URL}/courses/my`, {
		params: {
			page,
			pageSize,
		},
	});

	return res.data.data;
};

const getCourseDetail = async (courseId: number) => {
	try {
		const res = await axiosInstance.get(`${BASE_URL}/courses/${courseId}`);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}

	throw new Error("서버와 통신 불가");
};

const putCourse = async (
	courseId: number,
	courseData: CourseUpdateReq,
	thumbnailFile: File | null,
	practiceFile: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append("courseUpdateReq", JSON.stringify(courseData));

		if (thumbnailFile) {
			formData.append("thumbnail", thumbnailFile);
		}

		if (practiceFile) {
			practiceFile.forEach((file) => {
				formData.append("practiceFile", file);
			});
		}

		const res = await axiosInstance.put(
			`${BASE_URL}/courses/${courseId}`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			},
		);

		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
		throw error;
	}
};

const postCourse = async (
	courseData: UploadformData,
	thumbnailFile: File | null,
	practiceFile: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append("coursePostReq", JSON.stringify(courseData));

		if (thumbnailFile) {
			formData.append("thumbnail", thumbnailFile);
		}

		if (practiceFile) {
			practiceFile.forEach((file) => {
				formData.append("practiceFile", file);
			});
		}
		const res = await axiosInstance.post(`${BASE_URL}/courses`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}

	throw new Error("서버와 통신 불가");
};

export { getCourseDetail, getMyCourses, postCourse, putCourse };
