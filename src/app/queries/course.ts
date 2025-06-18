import { useQuery } from "@tanstack/react-query";
import { getCourseDetail, getMyCourses } from "../api/backend";

// queries/course.ts
const useGetMyCoursesQuery = (page: number, pageSize: number) => {
	return useQuery({
		queryKey: ["myCourses", page, pageSize], // 페이지 정보도 키에 포함
		queryFn: () => getMyCourses(page, pageSize),
	});
};

const useGetCourseDetailQuery = (courseId: number) => {
	return useQuery({
		queryKey: ["courseDetail", courseId],
		queryFn: () => getCourseDetail(courseId),
	});
};
export { useGetMyCoursesQuery, useGetCourseDetailQuery };
