import { UploadformData } from "@/app/types";

import CourseForm from "../common/CourseForm";

function CourseEdit({
	courseId,
	onBack,
}: {
	courseId: number;
	onBack: () => void;
}) {
	const dummyInitialData = {
		link: "",
		thumbnail: "",
		title: "파이썬 개발 환경 설치 가이드",
		description:
			"이 영상은 파이썬 개발 환경을 Windows 10/11에서 설치하는 방법을 안내합니다.",
		price: 19900,
		tags: ["파이썬", "개발환경", "설치", "윈도우"],
		environments: [
			{ value: "Windows 10 / 11 환경", support: "지원" },
			{ value: "MacOS 환경", support: "미지원" },
		],
		coreContents: [
			"파이썬 공식 사이트 접속",
			"설치 파일 다운로드 및 실행",
			"환경 변수 설정",
			"설치 확인 및 테스트",
		],
	};
	console.log(courseId);

	const handleSubmit = (formData: UploadformData) => {
		console.log(formData);
	};

	return (
		<CourseForm
			subject="콘텐츠 수정"
			initialData={dummyInitialData}
			onSubmit={handleSubmit}
			submitText="수정하기"
			onBack={onBack}
		/>
	);
}

export default CourseEdit;
