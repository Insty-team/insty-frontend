import DOMPurify from "dompurify";
import { useCallback } from "react";

export function useFormatAssistantText() {
	return useCallback((raw: string) => {
		if (typeof raw !== "string") return "";
		if (!raw) return "";
		let text = raw;

		console.log("원본 텍스트:", JSON.stringify(raw));

		// 마크다운 링크 변환 [텍스트](URL) → 굵은 초록색 텍스트 링크
		text = text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-green-500 hover:text-primary-green-600 no-underline hover:underline cursor-pointer font-bold">$1</a>',
		);

		// URL 자동 링크 변환 - 회색 배경의 URL 표시
		text = text.replace(
			/(^|[^"'>])(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g,
			'$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 bg-gray-100 hover:bg-gray-200 no-underline hover:underline cursor-pointer px-1 py-0.5 rounded text-sm font-mono">$2</a>',
		);

		// 개선된 번호 목록 분리 로직
		// 1. 마침표나 콜론 뒤에 오는 번호들을 더 정확하게 분리 (** 강조문 포함)
		text = text.replace(/([.:])\s*(\d+\.\s*\*\*[^*]+\*\*)/g, "$1\n$2");

		// 2. 일반 번호 목록도 분리
		text = text.replace(/([.:])\s*(\d+\.\s*[*\w가-힣])/g, "$1\n$2");

		// 3. 숫자와 점 뒤에 바로 오는 한글/영문도 분리
		text = text.replace(/(\d+\.\s*)([가-힣A-Za-z*])/g, "$1\n$2");

		// 3. 리스트 아이템 분리 개선 (간격 줄이면서 - 유지)
		text = text.replace(/([.:])\s*(-\s+)/g, "$1<br>$2");

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

		// 개선된 줄바꿈 처리
		// 1. 먼저 연속된 줄바꿈을 단락으로 처리
		text = text.replace(/\n\n+/g, '<div class="paragraph-break"></div>');

		// 2. 번호 목록이나 리스트 앞의 줄바꿈은 <br>로 유지
		text = text.replace(/\n(?=\s*\d+\.|\s*-)/g, "<br>");

		// 3. 나머지 일반 줄바꿈은 띄어쓰기로 처리
		text = text.replace(/\n/g, " ");

		text = DOMPurify.sanitize(text);

		return text;
	}, []);
}
