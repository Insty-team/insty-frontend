"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// const tabItems = [
//   { label: "강의 관리", path: "/creator/courses/course-management" },
//   { label: "강의 업로드", path: "/creator/courses/course-upload" },
//   { label: "수익 확인하기", path: "/creator/courses/my-revenue" },
// ];

export default function CoursesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/creator/courses/course-management");
  }, [router]);
  return null;
}
