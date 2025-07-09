"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "@/app/_components/common/Loading";
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

	if (!courseData)
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen">
				데이터 불러오는 중...
				<Loading width={60} height={60} />
			</div>
		);

	return <PreviewInfomation data={courseData} />;
}

export default CourseDetail;
