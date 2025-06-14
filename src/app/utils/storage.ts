/**
 * localStorage, sessionStorage 사용과 관련한 유틸 함수 모음입니다.
 */

import {
	INSTY_ACCESS_TOKEN_KEY,
	INSTY_REFRESH_TOKEN_KEY,
} from "@/app/constants";


const getAccessToken = () => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(INSTY_ACCESS_TOKEN_KEY);
};

const getRefreshToken = () => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(INSTY_REFRESH_TOKEN_KEY);
};

export { getAccessToken, getRefreshToken };
