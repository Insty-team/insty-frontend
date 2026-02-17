import {
  DELETE_course_by_id,
  DELETE_course_question_answer_by_id,
  DELETE_course_question_by_id,
  GET_course_by_id,
  GET_course_by_id_for_creator,
  GET_course_progress_exists_by_id,
  GET_course_question__by_id,
  GET_course_question_answer_accept_by_id,
  GET_course_question_answers_by_id,
  GET_course_questions_by_id,
  GET_course_questions_my_by_id,
  GET_courses,
  GET_courses_my,
  GET_courses_Progress_by_me,
  GET_my_course_questions,
  PATCH_course_question_answer_by_id,
  PATCH_course_question_by_id,
  POST_course,
  POST_course_progress_by_id,
  POST_course_question_answer_accept_by_id,
  POST_course_question_answer_by_id,
  POST_course_question_by_id,
  PUT_course_by_id,
  PUT_course_visible_by_id,
} from './course.service';
import {
  CourseQuestionAnswerRequest,
  CourseQuestionAnswerUpdateRequest,
  CourseQuestionRequest,
  CourseQuestionSearchParams,
  CourseQuestionUpdateRequest,
  CourseRequest,
} from './course.type';

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

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

/** 강좌의 visible 상태 변경 */
export const usePutCourseVisibleById = (courseId: string) => {
  return useMutation({
    mutationKey: [PUT_course_visible_by_id.name, courseId],
    mutationFn: (isShow: boolean) => PUT_course_visible_by_id(courseId, isShow),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_progress_by_id.name, courseId],
    mutationFn: () => POST_course_progress_by_id(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_progress_exists_by_id.name, courseId] });
    },
  });
};

/** 내가 업로드한 강의 목록조회 */
export const useGetCoursesMy = (page: number = 1, pageSize: number = 10, isShow?: boolean) => {
  return useQuery({
    queryKey: [GET_courses_my.name, page, pageSize, isShow],
    queryFn: () => GET_courses_my(page, pageSize, isShow),
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
export const useGetCoursesProgressByMe = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [GET_courses_Progress_by_me.name, page, pageSize],
    queryFn: () => GET_courses_Progress_by_me(page, pageSize),
    select: ({ data }) => data,
  });
};

/** 강의 수강 여부 조회 */
export const useGetCourseProgressExistsById = (courseId: string) => {
  return useQuery({
    queryKey: [GET_course_progress_exists_by_id.name, courseId],
    queryFn: () => GET_course_progress_exists_by_id(courseId),
    enabled: !!courseId,
    select: ({ data }) => data,
  });
};

/**
 * 강의 QA 및 커뮤니티 관련 query
 */

/** 강의 질문 목록 검색 */
export const useGetCourseQuestions = (courseId: number, params: CourseQuestionSearchParams) => {
  return useQuery({
    queryKey: [GET_course_questions_by_id.name, courseId, params],
    queryFn: () => GET_course_questions_by_id(courseId, params),
    enabled: !!courseId,
    select: ({ data }) => data,
  });
};

/** 강의 질문 목록 무한 스크롤 */
export const useGetCourseQuestionsInfinite = (courseId: number, params: Omit<CourseQuestionSearchParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: [GET_course_questions_by_id.name, courseId, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => GET_course_questions_by_id(courseId, { ...params, page: pageParam }),
    initialPageParam: 1,
    enabled: !!courseId,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && lastPageParam < pagination.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap(page => page.data?.items || []),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
  });
};

/** 질문 작성 */
export const usePostCourseQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_question_by_id.name],
    mutationFn: ({ courseId, data }: { courseId: number; data: CourseQuestionRequest }) =>
      POST_course_question_by_id(courseId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_by_id.name, variables.courseId] });
      // 이거는 필요할지 모르겠음
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_my_by_id.name, variables.courseId] });
    },
  });
};

/** 질문 상세 조회 */
export const useGetCourseQuestion = (
  courseId: number,
  questionId: number,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: [GET_course_question__by_id.name, courseId, questionId],
    queryFn: () => GET_course_question__by_id(courseId, questionId),
    enabled: options?.enabled,
    select: ({ data }) => data,
  });
};

/** 질문 수정 */
export const usePatchCourseQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATCH_course_question_by_id.name],
    mutationFn: ({
      courseId,
      questionId,
      data,
    }: {
      courseId: number;
      questionId: number;
      data: CourseQuestionUpdateRequest;
    }) => PATCH_course_question_by_id(courseId, questionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question__by_id.name, variables.courseId, variables.questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_by_id.name, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_questions.name] });
    },
  });
};

/** 질문 삭제 */
export const useDeleteCourseQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_question_by_id.name],
    mutationFn: ({ courseId, questionId }: { courseId: number; questionId: number }) =>
      DELETE_course_question_by_id(courseId, questionId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question__by_id.name, variables.courseId, variables.questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_by_id.name, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_my_by_id.name, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_questions.name] });
    },
  });
};

/** 내 질문 목록 검색 */
export const useGetMyCourseQuestionsById = (courseId: number) => {
  return useQuery({
    queryKey: [GET_course_questions_my_by_id.name],
    queryFn: () => GET_course_questions_my_by_id(courseId),
    select: ({ data }) => data,
  });
};

/** 답변 목록 조회 */
export const useGetCourseQuestionAnswers = (
  courseId: number,
  questionId: number,
  page: number = 1,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: [GET_course_question_answers_by_id.name, courseId, questionId, page, pageSize],
    queryFn: () => GET_course_question_answers_by_id(courseId, questionId, page, pageSize),
    select: ({ data }) => data,
    placeholderData: (previousData) => previousData,
  });
};

/** 답변 목록 조회 (무한 스크롤) */
export const useGetCourseQuestionAnswersInfinite = (
  courseId: number,
  questionId: number,
  pageSize: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: [GET_course_question_answers_by_id.name, 'infinite', courseId, questionId, pageSize],
    queryFn: ({ pageParam = 1 }) => GET_course_question_answers_by_id(courseId, questionId, pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.data.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map((page) => page.data),
      pageParams: data.pageParams,
    }),
  });
};

/** 답변 작성 */
export const usePostCourseQuestionAnswer = (courseId: number, questionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_question_answer_by_id.name, courseId, questionId],
    mutationFn: (data: CourseQuestionAnswerRequest) => POST_course_question_answer_by_id(courseId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, 'infinite', courseId, questionId] });
    },
  });
};

/** 답변 채택 */
export const usePostCourseQuestionAnswerAccept = (courseId: number, questionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_course_question_answer_accept_by_id.name, courseId, questionId],
    mutationFn: (answerId: number) => POST_course_question_answer_accept_by_id(courseId, questionId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answer_accept_by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question__by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_by_id.name, courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_questions.name] });
    },
  });
};

/** 답변 삭제 */
export const useDeleteCourseQuestionAnswer = (courseId: number, questionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_course_question_answer_by_id.name, courseId, questionId],
    mutationFn: (answerId: number) => DELETE_course_question_answer_by_id(courseId, questionId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, 'infinite', courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answer_accept_by_id.name, courseId, questionId] });

      queryClient.invalidateQueries({ queryKey: [GET_course_question__by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_questions_by_id.name, courseId] });
      queryClient.invalidateQueries({ queryKey: [GET_my_course_questions.name] });
    },
  });
};

/** 답변 수정 (answerId) */
export const usePatchCourseQuestionAnswerById = (courseId: number, questionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATCH_course_question_answer_by_id.name, courseId, questionId],
    mutationFn: ({
      answerId,
      data,
    }: {
      answerId: number;
      data: CourseQuestionAnswerUpdateRequest;
    }) => PATCH_course_question_answer_by_id(courseId, questionId, answerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answers_by_id.name, courseId, questionId] });
      queryClient.invalidateQueries({ queryKey: [GET_course_question_answer_accept_by_id.name, courseId, questionId] });
    },
  });
};

/** 채택된 답변 조회 */
export const useGetCourseQuestionAnswerAccepted = (courseId: number, questionId: number) => {
  return useQuery({
    queryKey: [GET_course_question_answer_accept_by_id.name, courseId, questionId],
    queryFn: () => GET_course_question_answer_accept_by_id(courseId, questionId),
    select: ({ data }) => data,
  });
};

/** 내 QA 질문 조회 */
export const useGetMyCourseQuestions = (params: CourseQuestionSearchParams) => {
  return useQuery({
    queryKey: [GET_my_course_questions.name, params],
    queryFn: () => GET_my_course_questions(params),
    select: ({ data }) => data,
  });
};

/** 내 QA 질문 무한 스크롤 */
export const useGetMyCourseQuestionsInfinite = (params: Omit<CourseQuestionSearchParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: [GET_my_course_questions.name, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => GET_my_course_questions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && lastPageParam < pagination.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap((page) => page.data?.items || []),
      pagination: data.pages[data.pages.length - 1]?.data?.pagination,
    }),
  });
};
