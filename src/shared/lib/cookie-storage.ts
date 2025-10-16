import Cookies from 'cookies-next';
import { StateStorage } from 'zustand/middleware';

const cookieStorage: StateStorage = {
  getItem: (name: string) => {
    return Cookies.getCookie(name) as string | null;
  },
  setItem: (name: string, value: string) => {
    Cookies.setCookie(name, value, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
  },
  removeItem: (name: string) => {
    Cookies.deleteCookie(name);
  },
};

export default cookieStorage;
