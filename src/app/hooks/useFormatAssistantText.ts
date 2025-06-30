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
		// <br> 생략
		text = text.replace(/<br\s*\/?>/gi, "");
		return text;
	}, []);
}
