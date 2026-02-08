import Cookies from 'cookies-next';
import { StateStorage } from 'zustand/middleware';

const isProduction = process.env.NODE_ENV === 'production';

const cookieStorage: StateStorage = {
  getItem: (name: string) => {
    return Cookies.getCookie(name) as string | null;
  },
  setItem: (name: string, value: string) => {
    Cookies.setCookie(name, value, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: '/',
      secure: isProduction, // HTTPS 환경에서만 true
      sameSite: 'lax',
      // domain: '.insty.ai.kr', // 서브도메인 공유 필요 시
    });
  },
  removeItem: (name: string) => {
    Cookies.deleteCookie(name, {
      path: '/',
      // domain: '.insty.ai.kr', // setItem과 동일하게
    });
  },
};

export default cookieStorage;
