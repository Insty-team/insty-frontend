import React, { useState } from "react";

function VideoEdit({ videoId, onBack }: { videoId: number; onBack: () => void }) {
  // 태그 관리
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 설치 환경 체크리스트 관리
  const [environments, setEnvironments] = useState([
    { value: "Windows 10 / 11 환경", support: "지원" },
  ]);

  // 핵심 내용 관리
  const [coreContents, setCoreContents] = useState<string[]>([
    "파이썬 개발 환경 설치 (Windows 기준)",
  ]);

  // 태그 추가
  const handleAddTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };
  // 태그 삭제
  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  // 환경 추가/삭제/수정
  const handleEnvChange = (idx: number, key: "value" | "support", value: string) => {
    const arr = [...environments];
    arr[idx][key] = value;
    setEnvironments(arr);
  };
  const handleAddEnv = () => setEnvironments([...environments, { value: "", support: "지원" }]);
  const handleRemoveEnv = (idx: number) => setEnvironments(environments.filter((_, i) => i !== idx));

  // 핵심 내용 추가/삭제/수정
  const handleCoreChange = (idx: number, value: string) => {
    const arr = [...coreContents];
    arr[idx] = value;
    setCoreContents(arr);
  };
  const handleAddCore = () => setCoreContents([...coreContents, ""]);
  const handleRemoveCore = (idx: number) => setCoreContents(coreContents.filter((_, i) => i !== idx));

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">콘텐츠 수정</h2>
      <div className="flex w-full gap-8">
        {/* 왼쪽: 썸네일/업로드/삭제 */}
        <div className="flex flex-col w-2/5 min-w-[220px] max-w-[350px]">
          <div className="mb-4">
            <textarea
              className="w-full h-10 border border-gray-200 rounded p-2 resize-none text-sm"
              placeholder="업로드 하실 영상의 링크를 붙여넣기 해주세요."
            />
          </div>
          <div className="mb-2 w-full h-36 bg-gray-100 rounded flex items-center justify-center text-gray-400 relative">
            썸네일 미리보기 {videoId}
            <button className="absolute top-2 right-2 text-gray-400">✕</button>
          </div>
          <div className="flex gap-2 mb-2">
            <button className="flex-1 py-2 bg-primary-blue-600 text-white rounded">썸네일 선택</button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded border border-gray-200">실습 자료 파일 선택</button>
          </div>
          <button className="text-red-500 text-sm self-start flex items-center gap-1 mt-1">
            <span>업로드 영상 삭제</span>
            <span className="text-lg">🗑️</span>
          </button>
        </div>
        {/* 오른쪽: 폼 입력 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold mb-1">제목</label>
            <div className="flex gap-2">
              <input className="flex-1 border border-gray-200 rounded p-2" placeholder="설치 가이드 주제 입력" />
              <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs">AI추천 문장입력</button>
            </div>
          </div>
          {/* 대상자/가격 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">대상자</label>
              <input className="w-full border border-gray-200 rounded p-2" placeholder="예: 파이썬 개발 환경 설치가 처음인 초보자" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">가격</label>
              <input className="w-full border border-gray-200 rounded p-2" placeholder="예: 199,990" />
            </div>
          </div>
          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold mb-1">설명</label>
            <div className="flex gap-2">
              <textarea className="flex-1 border border-gray-200 rounded p-2 resize-none" rows={2} placeholder="설명 내용 입력" />
              <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs">AI추천 요약입력</button>
            </div>
          </div>
          {/* 설치 환경 체크리스트 */}
          <div>
            <label className="block text-sm font-semibold mb-1">설치 환경 체크리스트</label>
            <div className="flex flex-col gap-2">
              {environments.map((env, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="flex-1 border border-gray-200 rounded p-2"
                    value={env.value}
                    onChange={e => handleEnvChange(idx, "value", e.target.value)}
                    placeholder="환경 입력"
                  />
                  <select
                    className="border border-gray-200 rounded p-2 text-sm"
                    value={env.support}
                    onChange={e => handleEnvChange(idx, "support", e.target.value)}
                  >
                    <option>지원</option>
                    <option>미지원</option>
                  </select>
                  <button className="text-gray-400 ml-2" onClick={() => handleRemoveEnv(idx)}>✕</button>
                </div>
              ))}
              <button className="self-start px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs mt-1" onClick={handleAddEnv}>더 입력하기 +</button>
            </div>
          </div>
          {/* 핵심 전달이 되는 핵심 내용 */}
          <div>
            <label className="block text-sm font-semibold mb-1">핵심 전달이 되는 핵심 내용</label>
            <div className="flex flex-col gap-2">
              {coreContents.map((content, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="flex-1 border border-gray-200 rounded p-2"
                    value={content}
                    onChange={e => handleCoreChange(idx, e.target.value)}
                    placeholder="핵심 내용 입력"
                  />
                  <button className="text-gray-400 ml-2" onClick={() => handleRemoveCore(idx)}>✕</button>
                </div>
              ))}
              <button className="self-start px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs mt-1" onClick={handleAddCore}>더 입력하기 +</button>
            </div>
          </div>
          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold mb-1">태그</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded p-2"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
              />
              <button className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs" onClick={handleAddTag}>추가</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full flex items-center text-sm">
                  {tag}
                  <button onClick={() => handleRemoveTag(idx)} className="ml-1 text-red-400">x</button>
                </span>
              ))}
            </div>
          </div>
          {/* 수정 완료 버튼 */}
          <div className="flex justify-end mt-4">
            <button className="px-8 py-2 bg-primary-blue-600 text-white rounded text-lg">수정 완료</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoEdit; 