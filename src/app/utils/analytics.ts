import mixpanel from "mixpanel-browser";

// 환경변수 확인
const MIXPANEL_KEY = process.env.NEXT_PUBLIC_MIX_PANEL_KEY;

// 개발 환경 체크 함수
const isDevelopment = () => {
	if (typeof window === "undefined") return false;
	const currentUrl = window.location.href;
	return currentUrl.includes("localhost") || currentUrl.includes("dev");
};

/**
 * Mixpanel 초기화 상태 확인 함수
 */
const isMixpanelInitialized = () => {
	// 환경변수가 없으면 바로 false 반환
	if (!MIXPANEL_KEY) {
		return false;
	}

	try {
		if (typeof window === "undefined" || !mixpanel) {
			return false;
		}

		// Mixpanel이 올바른 함수들을 가지고 있는지만 확인
		return (
			typeof mixpanel.track === "function" &&
			typeof mixpanel.identify === "function" &&
			typeof mixpanel.init === "function"
		);
	} catch (error) {
		console.error("Mixpanel initialization error:", error);
		return false;
	}
};

/**
 * 믹스패널 이벤트 트래킹 함수
 * 이벤트 이름만 전송 (상세 속성 없음)
 */
export const trackEvent = (eventName: string) => {
	// 개발 환경에서는 실행하지 않음
	if (isDevelopment()) {
		return;
	}

	// 환경변수가 없으면 아무것도 하지 않음
	if (!MIXPANEL_KEY) {
		return;
	}

	try {
		if (typeof window !== "undefined" && isMixpanelInitialized()) {
			// 추가 안전 장치: track 호출 전 한 번 더 확인
			if (mixpanel && typeof mixpanel.track === "function") {
				mixpanel.track(eventName);
			}
		}
	} catch (error) {
		console.error("Mixpanel tracking error:", error);
	}
};

/**
 * 페이지 뷰 트래킹 함수
 */
export const trackPageView = (pageName: string) => {
	// 개발 환경에서는 실행하지 않음
	if (isDevelopment()) {
		return;
	}

	// 환경변수가 없으면 아무것도 하지 않음
	if (!MIXPANEL_KEY) {
		return;
	}

	try {
		if (typeof window !== "undefined" && isMixpanelInitialized()) {
			mixpanel.track("Page View", { page: pageName });
		}
	} catch (error) {
		console.error("Mixpanel page view tracking error:", error);
	}
};

/**
 * 사용자 식별 함수
 */
export const identifyUser = (userId: string) => {
	// 개발 환경에서는 실행하지 않음
	if (isDevelopment()) {
		return;
	}

	// 환경변수가 없으면 아무것도 하지 않음
	if (!MIXPANEL_KEY) {
		return;
	}

	try {
		if (typeof window !== "undefined" && isMixpanelInitialized()) {
			mixpanel.identify(userId);
		}
	} catch (error) {
		console.error("Mixpanel identify error:", error);
	}
};

/**
 * 사용자 속성 설정 함수 (최소한의 정보만)
 */
export const setUserProfile = (userId: string, userType?: string) => {
	// 개발 환경에서는 실행하지 않음
	if (isDevelopment()) {
		return;
	}

	// 환경변수가 없으면 아무것도 하지 않음
	if (!MIXPANEL_KEY) {
		return;
	}

	try {
		if (typeof window !== "undefined" && isMixpanelInitialized()) {
			const profile: { [key: string]: string } = { user_id: userId };
			if (userType) {
				profile.user_type = userType;
			}
			mixpanel.people.set(profile);
		}
	} catch (error) {
		console.error("Mixpanel profile error:", error);
	}
};

/**
 * 믹스패널 리셋 함수 (로그아웃 시 사용)
 */
export const resetAnalytics = () => {
	// 개발 환경에서는 실행하지 않음
	if (isDevelopment()) {
		return;
	}

	// 환경변수가 없으면 아무것도 하지 않음
	if (!MIXPANEL_KEY) {
		return;
	}

	try {
		if (typeof window !== "undefined" && isMixpanelInitialized()) {
			mixpanel.reset();
		}
	} catch (error) {
		console.error("Mixpanel reset error:", error);
	}
};
