import React from "react";
import dayjs from "dayjs";
import CommonLineChart from "@/app/creator/_component/CommonLineChart";

const dummyTags = ["RTX 3060", "무료", "추천", "리눅스"];
const dummyPoints = ["썸네일", "설명란", "가격"];

// 예시: 13분 24초 = 804초
const totalSeconds = 13 * 60 + 24;
const sectionCount = 6;
const sectionLength = Math.floor(totalSeconds / sectionCount);

const chartData = Array.from({ length: sectionCount }, (_, i) => {
  const start = i * sectionLength;
  const end = i === sectionCount - 1 ? totalSeconds : (i + 1) * sectionLength - 1;
  return {
    name: `${Math.floor(start / 60)}:${String(start % 60).padStart(2, "0")}~${Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")}`,
    value: Math.floor(Math.random() * 100),
  };
});

function VideoDetail({
  videoId,
  onBack,
}: {
  videoId: number;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">콘텐츠 분석</h2>
      {/* 상단: 영상 정보 */}
      <div className="flex gap-8 mb-8">
        <div className="w-1/3 min-w-[220px] max-w-[350px]">
          <div className="w-full h-36 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xl font-bold mb-2">영상 제목 영상 제목 영상 제목 영상 제목 영상 제목</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {dummyTags.map(tag => (
              <span key={tag} className="bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-xs">{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 text-gray-500 text-sm mb-2">
            <span>업로드 날짜: {dayjs().format("YYYY년 MM월 DD일")}</span>
            <span>가격: 199,999원</span>
          </div>
          <div className="text-gray-600 mb-2">
            영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 설명
          </div>
        </div>
      </div>
      {/* 하단: flex 7:3 */}
      <div className="flex gap-8">
        {/* 왼쪽: 그래프, AI 요약 */}
        <div className="flex-[7] min-w-0">
          {/* 그래프 */}
          <div className="mb-8">
            <div className="font-semibold mb-2">이탈 구간 시각화</div>
            <CommonLineChart
              data={chartData}
              yAxisLabel="%"
              tooltipLabel="이탈률"
              tooltipUnit="%"
              height={200}
            />
          </div>
          {/* AI 분석 요약 */}
          <div>
            <div className="font-semibold mb-2">AI 분석 요약</div>
            <div className="text-gray-600 text-sm">
              이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
            </div>
          </div>
        </div>
        {/* 오른쪽: 추천 포인트, 핵심지표 */}
        <div className="flex-[3] min-w-[260px] max-w-[350px] flex flex-col gap-8">
          {/* 추천 개선 포인트 */}
          <div>
            <div className="font-semibold mb-2">추천 개선 포인트</div>
            <div className="flex flex-col gap-2">
              {dummyPoints.map((point, idx) => (
                <div key={point} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 font-bold text-primary-blue-600">{idx + 1}</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 핵심 지표 */}
          <div>
            <div className="font-semibold mb-2">핵심 지표</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <span className="text-xl">👍</span>
                <span>조회수</span>
                <span className="ml-auto font-bold text-primary-blue-600">999,999,999회</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <span className="text-xl">%</span>
                <span>구매율</span>
                <span className="ml-auto font-bold text-primary-blue-600">38%</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <span className="text-xl">⏱️</span>
                <span>평균 시청 시간</span>
                <span className="ml-auto font-bold text-primary-blue-600">38분</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button onClick={onBack} className="px-6 py-2 bg-primary-blue-600 text-white rounded">뒤로가기</button>
      </div>
    </div>
  );
}

export default VideoDetail; 