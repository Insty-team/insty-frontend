"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetMyCoursesQuery } from "@/app/queries";

import CourseDetail from "./CourseDetail";
import CourseEdit from "./CourseEdit";
import CourseList from "./CourseList";

function CourseManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const {
    data: myCoursesItems,
    isLoading,
    error,
  } = useGetMyCoursesQuery(1, 100);

  const mode =
    (searchParams.get("mode") as "list" | "edit" | "detail") || "list";
  const courseIdFromUrl = searchParams.get("courseId");

  useEffect(() => {
    if (courseIdFromUrl) {
      setSelectedCourseId(Number(courseIdFromUrl));
    }
  }, [courseIdFromUrl]);

  //누를때마다 쿼리스트링으로 모드 변경(뒤로가기 흔적 남기기 위함...)
  const handleModeChange = (
    newMode: "list" | "edit" | "detail",
    courseId?: number,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    if (courseId) {
      params.set("courseId", courseId.toString());
    } else {
      params.delete("courseId");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (mode === "edit" && selectedCourseId) {
    return (
      <CourseEdit
        courseId={selectedCourseId}
        onBack={() => handleModeChange("list")}
      />
    );
  }
  if (mode === "detail" && selectedCourseId) {
    return (
      <CourseDetail
        courseId={selectedCourseId}
        onBack={() => handleModeChange("list")}
      />
    );
  }

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!myCoursesItems) return <div>데이터가 없습니다</div>;

  return (
    <>
      <h2 className="text-3xl font-semibold mt-6 mb-4">업로드한 강의 리스트</h2>
      <CourseList
        myCoursesItems={myCoursesItems.items}
        onEdit={(courseId) => {
          handleModeChange("edit", courseId);
        }}
        onDetail={(courseId) => {
          handleModeChange("detail", courseId);
        }}
      />
    </>
  );
}

export default CourseManagement;
