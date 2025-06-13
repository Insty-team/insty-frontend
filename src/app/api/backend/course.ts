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

export { getMyCourses };
