import { useCallback } from "react";

export function useFormatAssistantText() {
	return useCallback((raw: string) => {
		if (typeof raw !== "string") return "";
		if (!raw) return "";
		let text = raw;

		// 언어가 명시된 코드블록 (```bash ... ```)
		text = text.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
			return `
        <div class="codeblock-group">
          <div class="codeblock-lang">${lang}</div>
          <pre>${code.trim()}</pre>
        </div>
      `;
		});

		// 언어 없는 코드블록 (``` ... ```)
		text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
			return `<pre>${code.trim()}</pre>`;
		});

		// 인라인 코드
		text = text.replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`);

		// 굵은 글씨
		text = text.replace(
			/\*\*([^*]+)\*\*/g,
			(match, bold) => `<strong>${bold}</strong>`,
		);

		// 번호 목록 처리 (1. 2. 3. 등)
		text = text.replace(/^(\d+\.)\s+(.+)$/gm, (match, number, content) => {
			return `<div class="numbered-list-item"><span class="list-number">${number}</span><span class="list-content">${content}</span></div>`;
		});

		// 연속된 줄바꿈을 단락으로 처리
		text = text.replace(/\n\n+/g, '<div class="paragraph-break"></div>');

		// 일반 줄바꿈을 <br>로 변경
		text = text.replace(/\n/g, "<br>");

		// 이후에 모든 br 태그 제거
		text = text.replace(/<br\s*\/?>/gi, "");

		return text;
	}, []);
}
