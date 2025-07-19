"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CoursesPage() {
	const router = useRouter();
	useEffect(() => {
		router.replace("/creator/courses/course-management");
	}, [router]);
	return null;
}
