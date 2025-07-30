"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function CoursesPage() {
	const router = useRouter();
	useLayoutEffect(() => {
		router.replace("/creator/courses/course-management");
	}, [router]);
	return null;
}
