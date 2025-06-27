"use client";

import { ChangeEvent, useState } from "react";

import { BaseSearchBar } from "@/app/_components/common";

import AIChatItem from "./AIChatItem";

function MyPageAIChat() {
  const [value, setValue] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl">AI 챗봇 질문 내역</h3>
        <BaseSearchBar
          value={value}
          onChange={(e) => onChange(e)}
          placeholder="설치 환경(OS), 소프트웨어 이름을 입력해보세요!"
        />
      </div>
      {[
        new Date().toISOString(),
        new Date(Date.now() - 86400000).toISOString(),
        new Date(Date.now() - 2 * 86400000).toISOString(),
      ].map((date) => (
        <AIChatItem key={date} date={date} />
      ))}
    </div>
  );
}

export default MyPageAIChat;
