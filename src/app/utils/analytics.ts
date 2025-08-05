import mixpanel from "mixpanel-browser";

/**
 * 믹스패널 이벤트 트래킹 함수
 * 이벤트 이름만 전송 (상세 속성 없음)
 */
export const trackEvent = (eventName: string) => {
	try {
		if (typeof window !== "undefined") {
			mixpanel.track(eventName);
		}
	} catch (error) {
		console.error("Mixpanel tracking error:", error);
	}
};

/**
 * 페이지 뷰 트래킹 함수
 */
export const trackPageView = (pageName: string) => {
	try {
		if (typeof window !== "undefined") {
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
	try {
		if (typeof window !== "undefined") {
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
	try {
		if (typeof window !== "undefined") {
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
	try {
		if (typeof window !== "undefined") {
			mixpanel.reset();
		}
	} catch (error) {
		console.error("Mixpanel reset error:", error);
	}
};