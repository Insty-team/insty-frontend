/**
 * 텍스트에서 검색어를 하이라이트하는 유틸리티 함수
 */

/**
 * 텍스트에서 검색어를 찾아서 하이라이트 태그로 감싸기
 * @param text 원본 텍스트
 * @param searchQuery 검색어
 * @param highlightClass CSS 클래스명 (선택사항)
 * @returns 하이라이트가 적용된 HTML 문자열
 */
export const highlightText = (
	text: string,
	searchQuery: string,
	highlightClass: string = "bg-green-200 text-green-800 font-semibold px-1 rounded",
): string => {
	if (!text || !searchQuery || searchQuery.trim() === "") {
		return text;
	}

	// 검색어를 정규식으로 변환 (대소문자 구분 없이, 전역 검색)
	const regex = new RegExp(
		`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
		"gi",
	);

	// 검색어를 하이라이트 태그로 감싸기
	return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

/**
 * React에서 사용할 수 있는 하이라이트 함수 (dangerouslySetInnerHTML용)
 * @param text 원본 텍스트
 * @param searchQuery 검색어
 * @returns { __html: string } 형태의 객체
 */
export const getHighlightedHTML = (
	text: string,
	searchQuery: string,
): { __html: string } => {
	return {
		__html: highlightText(text, searchQuery),
	};
};
