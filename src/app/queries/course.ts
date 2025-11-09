import { useQuery } from "@tanstack/react-query";

import { getCourseProgress } from "../api/backend";
import {
	getCourseDetail,
	getCourseDetailByCreator,
	getMyCourses,
} from "../api/backend";
import { CourseDetail } from "../types/course";

// queries/course.ts
const useGetMyCoursesQuery = (page: number, pageSize: number) => {
	return useQuery({
		queryKey: ["myCourses", page, pageSize], // 페이지 정보도 키에 포함
		queryFn: () => getMyCourses(page, pageSize),
	});
};

const useGetCourseDetailQuery = (courseId: number) => {
	return useQuery<CourseDetail>({
		queryKey: ["courseDetail", courseId],
		queryFn: () => getCourseDetail(courseId),
	});
};

const useGetCourseProgressQuery = (page: number, pageSize: number) => {
	return useQuery({
		queryKey: ["courseProgress", page, pageSize],
		queryFn: () => getCourseProgress(page, pageSize),
  });
};

const useGetCourseDetailByCreatorQuery = (courseId: number) => {
	return useQuery<{ data: CourseDetail }>({
		queryKey: ["courseDetailByCreator", courseId],
		queryFn: () => getCourseDetailByCreator(courseId),
	});
};

export {
	useGetCourseDetailQuery,
	useGetCourseProgressQuery,
	useGetCourseDetailByCreatorQuery,
	useGetCourseDetailQuery,
	useGetMyCoursesQuery,
};
