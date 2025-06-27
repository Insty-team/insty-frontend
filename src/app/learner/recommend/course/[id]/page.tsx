"use client";

import PreviewInfomation from "@/app/creator/courses/_component/upload/PreviewInfomation";

function CourseDetail() {
  //더미데이터...
  const dummyVideoData = {
    title: "설치 가이드 주제 설치 가이드",
    targetAudience: "초보자",
    description:
      "파이썬 개발 환경과 RTX 3060 드라이버 설치를 다루는 영상입니다.",
    price: 199990,
    tags: [
      "열글자열글자열글자1",
      "열글자열글자열글자2",
      "열글자열글자열글자3",
      "열글자열글자열글자4",
      "열글자열글자열글자5",
      "열글자열글자열글자6",
    ],
    installEnvChecklist: [
      { content: "Windows 10 / 11 환경", isSupported: true },
      { content: "RTX 3060 이상 GPU", isSupported: true },
      { content: "Visual Studio Code 설치 필요", isSupported: true },
      { content: "conda / pip 가상 환경 설정", isSupported: true },
      { content: "Mac 환경", isSupported: false },
    ],
    keyPoints: [
      "파이썬 개발 환경 설치 (Windows 기준)",
      "RTX 3060 사용자 드라이버 / 호환 설정",
      "파이썬 및 텐서플로 프로젝트 설정",
      "실습 및 베스트 프랙티스 소개",
    ],
    isShow: true,
    videoUuid: "1234567890",
  };

  return (
    <PreviewInfomation data={dummyVideoData} onEdit={() => {}} mode="learner" />
  );
}

export default CourseDetail;
