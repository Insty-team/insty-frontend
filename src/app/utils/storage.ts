/**
 * localStorage, sessionStorage 사용과 관련한 유틸 함수 모음입니다.
 */

import {
	INSTY_ACCESS_TOKEN_KEY,
	INSTY_RECEIVE_EMAIL_KEY,
	INSTY_REFRESH_TOKEN_KEY,
} from "@/app/constants";

import { useLocalStorage } from "usehooks-ts";

/**
 * Access Token 관련 hook
 */
export const getAccessToken = () => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(INSTY_ACCESS_TOKEN_KEY);
};

/**
 * Refresh Token 관련 hook
 */
export const getRefreshToken = () => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(INSTY_REFRESH_TOKEN_KEY);
};

/**
 * 이메일 수신 동의 여부 관련 hook
 * @returns [value, setValue]
 */
export const useAgreeEmail = () => {
  const [isAgreeEmail, setIsAgreeEmail] = useLocalStorage<boolean>(
    INSTY_RECEIVE_EMAIL_KEY,
    false
  );

  return [isAgreeEmail, setIsAgreeEmail] as const;
};

