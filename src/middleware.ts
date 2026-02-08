import { NextRequest, NextResponse } from 'next/server';

/**
 * 인증이 필요한 라우트 패턴
 * - /creator/* : 크리에이터 전용 페이지
 * - /creator-center/* : 크리에이터 센터
 * - /learner/* : 학습자 전용 페이지
 * - /mypage/* : 마이페이지
 */
const AUTH_REQUIRED_ROUTES = ['/creator', '/creator-center', '/learner', '/mypage'];

/**
 * 로그인한 사용자가 접근하면 안 되는 라우트
 */
const GUEST_ONLY_ROUTES = ['/login', '/signup'];

/**
 * 쿠키에서 인증 토큰 확인
 */
function getAuthToken(request: NextRequest): string | null {
  const tokenCookie = request.cookies.get('@insty-app.token');

  if (!tokenCookie?.value) return null;

  try {
    // Zustand persist 형식: {"state":{"accessToken":"...","refreshToken":"..."},...}
    const parsed = JSON.parse(tokenCookie.value);
    return parsed?.state?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * 특정 라우트 패턴에 매칭되는지 확인
 */
function matchesRoutePattern(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = getAuthToken(request);
  const isAuthenticated = !!accessToken;

  // 1. 인증이 필요한 라우트에 비로그인 사용자가 접근
  if (matchesRoutePattern(pathname, AUTH_REQUIRED_ROUTES) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 redirect 파라미터 추가
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. 로그인한 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if (matchesRoutePattern(pathname, GUEST_ONLY_ROUTES) && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 정적 파일, API, Next.js 내부 경로 제외
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
