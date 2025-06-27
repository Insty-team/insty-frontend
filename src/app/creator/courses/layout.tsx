"use client";

import BaseTab from "@/app/_components/common/BaseTab";

const tabItems = [
  { label: "강의 관리", path: "/creator/courses/course-management" },
  { label: "강의 업로드", path: "/creator/courses/course-upload" },
  { label: "수익 확인하기", path: "/creator/courses/my-revenue" },
];

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <BaseTab items={tabItems} />
      {children}
    </div>
  );
}
