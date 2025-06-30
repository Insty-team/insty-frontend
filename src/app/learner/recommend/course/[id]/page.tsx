"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getCourseDetail } from "@/app/api/backend";
import PreviewInfomation from "@/app/learner/_component/courses/PreviewInformation";
import { CourseDetail as CourseDetailType } from "@/app/types/course";

function CourseDetail() {
	const params = useParams();
	const [courseData, setCourseData] = useState<CourseDetailType>();

	useEffect(() => {
		const courseData = async () => {
			try {
				const res = await getCourseDetail(Number(params.id));
				if (res && res.data) {
					console.log(res.data);
					setCourseData(res.data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		courseData();
	}, [params.id]);

	if (!courseData) return <div>데이터가 없습니다.</div>;

	return <PreviewInfomation data={courseData} />;
}

export default CourseDetail;
