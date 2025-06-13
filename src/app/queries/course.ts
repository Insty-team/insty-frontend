import { useQuery } from "@tanstack/react-query";
import { getMyCourses } from "../api/backend";

// queries/course.ts
const useGetMyCoursesQuery = (page: number, pageSize: number) => {
	return useQuery({
		queryKey: ["myCourses", page, pageSize], // 페이지 정보도 키에 포함
		queryFn: () => getMyCourses(page, pageSize),
		staleTime: 5 * 60 * 1000, // 5분
		retry: 1, // 실패시 1번만 재시도
	});
};

export { useGetMyCoursesQuery };
