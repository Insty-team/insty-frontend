import {
  DELETE_course_by_id,
  GET_course_by_id,
  GET_course_by_id_for_creator,
  GET_courses,
  GET_courses_my,
  GET_courses_Progress_by_me,
  POST_course,
  POST_course_progress_by_id,
  PUT_course_by_id,
} from './course.service';
import { CourseRequest } from './course.type';

import { useMutation, useQuery } from '@tanstack/react-query';

/** 강의 상세조회 */
export const useGetCourseById = (courseId: string) => {
  return useQuery({
    queryKey: [GET_course_by_id.name, courseId],
    queryFn: () => GET_course_by_id(courseId),
    enabled: !!courseId,
    select: ({ data }) => data,
  });
};

/** 강의 수정 */
export const usePutCourseById = (courseId: string) => {
  return useMutation({
    mutationKey: [PUT_course_by_id.name, courseId],
    mutationFn: (data: CourseRequest) => PUT_course_by_id(courseId, data),
  });
};

/** 강의 삭제 */
export const useDeleteCourseById = (courseId: string) => {
  return useMutation({
    mutationKey: [DELETE_course_by_id.name, courseId],
    mutationFn: () => DELETE_course_by_id(courseId),
  });
};

/** 강의 목록조회 */
export const useGetCourses = () => {
  return useQuery({
    queryKey: [GET_courses.name],
    queryFn: () => GET_courses(),
    select: ({ data }) => data,
  });
};

/** 강의 게시 */
export const usePostCourse = () => {
  return useMutation({
    mutationKey: [POST_course.name],
    mutationFn: (data: CourseRequest) => POST_course(data),
  });
};

/** 강좌 수강하기 */
export const usePostCourseProgressById = (courseId: string) => {
  return useMutation({
    mutationKey: [POST_course_progress_by_id.name, courseId],
    mutationFn: () => POST_course_progress_by_id(courseId),
  });
};

/** 내가 업로드한 강의 목록조회 */
export const useGetCoursesMy = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [GET_courses_my.name, page, pageSize],
    queryFn: () => GET_courses_my(page, pageSize),
    select: ({ data }) => data,
  });
};

/** 강의 상세조회(크리에이터용) */
export const useGetCourseByIdForCreator = (courseId: string) => {
  return useQuery({
    queryKey: [GET_course_by_id_for_creator.name, courseId],
    queryFn: () => GET_course_by_id_for_creator(courseId),
    enabled: !!courseId,
    select: ({ data }) => data,
  });
};

/** 내가 수강중인 강의 목록조회 */
export const useGetCoursesProgressByMe = () => {
  return useQuery({
    queryKey: [GET_courses_Progress_by_me.name],
    queryFn: () => GET_courses_Progress_by_me(),
    select: ({ data }) => data,
  });
};
