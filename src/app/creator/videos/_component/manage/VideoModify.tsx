import React from "react";

function VideoModify() {
  return (
    <div className="flex w-full gap-8">
      {/* 왼쪽: 썸네일/업로드/삭제 */}
      <div className="flex flex-col w-1/3 min-w-[260px] max-w-[320px]">
        <label className="font-bold text-lg mb-2">콘텐츠 수정</label>
        <div className="mb-4">
          <textarea
            className="w-full h-10 border border-gray-200 rounded p-2 resize-none text-sm"
            placeholder="업로드 하실 영상의 링크를 붙여넣기 해주세요."
          />
        </div>
        <div className="mb-2 w-full h-36 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          썸네일 미리보기
        </div>
        <div className="flex gap-2 mb-2">
          <button className="flex-1 py-2 bg-primary-blue-600 text-white rounded">썸네일 선택</button>
          <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded border border-gray-200">임시 파일 선택</button>
        </div>
        <button className="text-red-500 text-sm self-start flex items-center gap-1 mt-1">
          <span>업로드 영상 삭제</span>
          <span className="text-lg">🗑️</span>
        </button>
      </div>
      {/* 오른쪽: 폼 입력 */}
      <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
        {/* 제목 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">제목</label>
          <div className="flex gap-2">
            <input className="flex-1 border border-gray-200 rounded p-2" placeholder="설치 가이드 주제 입력" />
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs">AI추천 문장입력</button>
          </div>
        </div>
        {/* 대상자 */}
        <div>
          <label className="block text-sm font-semibold mb-1">대상자</label>
          <input className="w-full border border-gray-200 rounded p-2" placeholder="예: 파이썬 개발 환경 설치가 처음인 초보자" />
        </div>
        {/* 가격 */}
        <div>
          <label className="block text-sm font-semibold mb-1">가격</label>
          <input className="w-full border border-gray-200 rounded p-2" placeholder="예: 199,990" />
        </div>
        {/* 설명 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">설명</label>
          <div className="flex gap-2">
            <textarea className="flex-1 border border-gray-200 rounded p-2 resize-none" rows={2} placeholder="설명 내용 입력" />
            <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs">AI추천 요약입력</button>
          </div>
        </div>
        {/* 설치 환경 체크리스트 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">설치 환경 체크리스트</label>
          <div className="flex flex-col gap-2">
            {[1,2,3,4].map((_,i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="flex-1 border border-gray-200 rounded p-2" defaultValue="Windows 10 / 11 환경" />
                <select className="border border-gray-200 rounded p-2 text-sm">
                  <option>지원</option>
                  <option>미지원</option>
                </select>
                <button className="text-gray-400 ml-2">✕</button>
              </div>
            ))}
            <button className="self-start px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs mt-1">더 입력하기 +</button>
          </div>
        </div>
        {/* 핵심 전달이 되는 핵심 내용 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">핵심 전달이 되는 핵심 내용</label>
          <div className="flex flex-col gap-2">
            {[1,2,3].map((_,i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="flex-1 border border-gray-200 rounded p-2" defaultValue="파이썬 개발 환경 설치 (Windows 기준)" />
                <button className="text-gray-400 ml-2">✕</button>
              </div>
            ))}
            <button className="self-start px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs mt-1">더 입력하기 +</button>
          </div>
        </div>
        {/* 태그 */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">태그</label>
          <input className="w-full border border-gray-200 rounded p-2" placeholder="내용을 입력해주세요..." />
        </div>
        {/* 수정 완료 버튼 */}
        <div className="col-span-2 flex justify-end mt-4">
          <button className="px-8 py-2 bg-primary-blue-600 text-white rounded text-lg">수정 완료</button>
        </div>
      </div>
    </div>
  );
}

export default VideoModify; 