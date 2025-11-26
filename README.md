## 📁 프로젝트 구조 분석

### **1. 기술 스택**

#### 핵심 프레임워크

- **Next.js 15.5.5** - React 19.1.0 기반
- **TypeScript 5** - 엄격한 타입 시스템
- **Tailwind CSS 4** - 유틸리티 기반 스타일링
- **Turbopack** - Next.js의 새로운 번들러 사용

#### 상태 관리 & 데이터 페칭

- **Zustand** - 경량 상태 관리 (토큰 & 사용자 정보)
- **React Query (TanStack Query)** - 서버 상태 관리
- **Axios** - HTTP 클라이언트

#### UI 라이브러리

- **shadcn/ui** (New York 스타일) - Radix UI 기반 컴포넌트
- **Lucide React** - 아이콘
- **class-variance-authority (cva)** - 변형 스타일 관리
- **Pretendard Variable** - 한글 폰트

#### 폼 관리 & 검증

- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증

---

## 📐 프로젝트 아키텍처

### **폴더 구조 원칙**

```
src/
├── app/                          # Next.js App Router
│   ├── (authorized)/            # 인증된 사용자 전용 라우트 그룹
│   │   ├── creator/             # 크리에이터 페이지
│   │   └── learner/             # 러너 페이지
│   ├── login/                   # 로그인 페이지
│   ├── signup/                  # 회원가입 페이지
│   └── _components/             # 앱 레벨 컴포넌트
│
└── shared/                      # 공유 리소스 (재사용 가능)
    ├── components/ui/           # UI 컴포넌트 라이브러리
    ├── lib/                     # 유틸리티 함수
    ├── services/                # API 서비스 레이어
    │   └── [domain]/            # 도메인별 구성
    │       ├── *.service.ts     # API 호출 함수
    │       ├── *.hook.ts        # React Query 훅
    │       └── *.type.ts        # 타입 정의
    ├── stores/                  # Zustand 스토어
    ├── providers/               # React Context Providers
    └── types/                   # 전역 타입 정의
```

### **라우트 그룹 전략**

- `(authorized)` - 인증 필요한 페이지 그룹화
- `(mypage)` - 마이페이지 관련 라우트 그룹
- URL에 영향을 주지 않으면서 레이아웃 공유

---

## 🎨 디자인 시스템

### **컬러 시스템**

#### Primary Colors (브랜드 그린)

```css
--color-primary-green-50: #f6fdf1 --color-primary-green-100: #e8fbd9 --color-primary-green-200: #d1f8b4
  --color-primary-green-300: #b2f381 --color-primary-green-400: #9bef5b --color-primary-green-500: #7dea29
  /* 메인 컬러 */ --color-primary-green-600: #67d215 /* 버튼 기본 */ --color-primary-green-700: #51a611 /* 버튼 호버 */
  --color-primary-green-800: #3b780c --color-primary-green-900: #244a08;
```

#### 시맨틱 컬러 (oklch 색상 공간 사용)

- **Background**: 흰색 (Light) / 어두운 회색 (Dark)
- **Primary**: 기본 버튼 및 강조 색상
- **Secondary**: 보조 버튼
- **Muted**: 비활성화 요소
- **Destructive**: 삭제/경고 액션

### **타이포그래피**

- **폰트**: Pretendard Variable (가변 폰트)
- **폴백**: Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic

### **Border Radius**

```css
--radius: 0.625rem (10px) --radius-sm: 6px --radius-md: 8px --radius-lg: 10px --radius-xl: 14px;
```

### **다크모드 지원**

- CSS 변수 기반 테마 전환
- `.dark` 클래스로 제어

---

## 💻 코드 컨벤션

### **1. 파일명 규칙**

| 타입     | 규칙              | 예시                                |
| -------- | ----------------- | ----------------------------------- |
| 컴포넌트 | PascalCase        | `Button.tsx`, `ScrollAnimation.tsx` |
| 페이지   | page.tsx          | `app/login/page.tsx`                |
| 레이아웃 | layout.tsx        | `app/(authorized)/layout.tsx`       |
| 서비스   | domain.service.ts | `auth.service.ts`                   |
| 훅       | domain.hook.ts    | `auth.hook.ts`                      |
| 타입     | domain.type.ts    | `auth.type.ts`                      |
| 유틸     | kebab-case.ts     | `cookie-storage.ts`                 |

### **2. 명명 규칙**

#### API 함수 명명 (HTTP 메서드 접두사)

```typescript
// ✅ 올바른 예시
export const POST_login = async (data: LoginRequest) => {};
export const GET_profile = async () => {};
export const PUT_profile = async (data: UserRequest) => {};
export const DELETE_withdraw = async () => {};
```

#### Hook 명명

```typescript
// ✅ 올바른 예시
export const usePostLogin = () => {};
export const useGetProfile = () => {};
```

#### 타입 명명

```typescript
// Request/Response 접미사 사용
export type LoginRequest = { ... }
export type LoginResponse = { ... }
export type UserResponse = { ... }
```

#### Enum 명명

```typescript
// 타입과 Enum을 함께 export
export type UserType = 'LEARNER' | 'CREATOR';
export const enum UserTypeEnum {
  LEARNER = 'LEARNER',
  CREATOR = 'CREATOR',
}
```

### **3. Import 순서 (Prettier 자동 정렬)**

```typescript
// 1. 상대 경로 import (CSS 제외)
import { LoginRequest } from './auth.type';

// 2. CSS/SCSS
import './globals.css';

// 3. React
import { useState } from 'react';

// 4. Next.js
import Link from 'next/link';

// 6. @/ 경로 (알파벳 순)
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/shared/stores/auth';
// 5. Third-party 라이브러리
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
```

### **4. TypeScript 설정**

```json
{
  "strict": true, // 엄격 모드
  "target": "ES2017",
  "module": "esnext",
  "moduleResolution": "bundler",
  "paths": {
    "@/*": ["./src/*"] // 절대 경로 alias
  }
}
```

---

## 🏗️ 아키텍처 패턴

### **1. 서비스 레이어 패턴 (3단 구조)**

#### ① Service Layer (\*.service.ts)

```typescript
// API 호출 로직만 담당
export const POST_login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post('/api/v1/auth/login', data);
  return response.data;
};
```

#### ② Hook Layer (\*.hook.ts)

```typescript
// React Query를 사용한 상태 관리
export const usePostLogin = () => {
  return useMutation({
    mutationKey: [POST_login.name],
    mutationFn: (data: LoginRequest) => POST_login(data),
  });
};
```

#### ③ Component Layer

```typescript
// 비즈니스 로직 실행
const { mutateAsync: postLogin } = usePostLogin();

const onSubmit = async (data: LoginRequest) => {
  await postLogin(data).then((response) => {
    // 성공 처리
  });
};
```

### **2. 공통 API Response 타입**

```typescript
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}
```

### **3. Axios 인터셉터 패턴**

#### Request Interceptor

- Zustand 스토어에서 `accessToken` 가져오기
- Authorization 헤더 자동 추가

#### Response Interceptor

- 401 에러 시 토큰 자동 갱신
- Refresh Token 기반 재인증
- Queue 패턴으로 동시 요청 처리

### **4. 상태 관리 전략**

#### Zustand (클라이언트 상태)

```typescript
// 토큰은 쿠키에 persist
export const useAuthStore = create(
  persist<AuthState & AuthActions>(
    (set) => ({ ... }),
    {
      name: '@insty-app.token',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

// 사용자 정보는 메모리에만 저장
export const useUserStore = create<UserState & UserActions>((set) => ({ ... }));
```

#### React Query (서버 상태)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
    },
  },
});
```

---

## ✨ Prettier 설정

```json
{
  "singleQuote": true, // 작은따옴표 사용
  "semi": true, // 세미콜론 필수
  "tabWidth": 2, // 들여쓰기 2칸
  "trailingComma": "all", // 후행 쉼표
  "printWidth": 120, // 줄 길이 120자
  "arrowParens": "always", // 화살표 함수 괄호 항상
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
```

---

## 🎯 UI 컴포넌트 패턴

### **1. shadcn/ui 기반 컴포넌트**

#### Button 컴포넌트 변형

```typescript
const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'bg-primary-green-600 text-primary-foreground hover:bg-primary-green-700',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      outline: 'border bg-background shadow-xs hover:bg-accent',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md gap-1.5 px-3',
      lg: 'h-10 rounded-md px-6',
      icon: 'size-9',
    },
  },
});
```

### **2. 폼 패턴 (React Hook Form)**

```typescript
const form = useForm({
  defaultValues: { email: '', password: '' },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      rules={{
        required: { value: true, message: '이메일을 입력해주세요.' },
        pattern: { value: emailReg, message: '이메일 형식이 잘못되었습니다.' },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl>
            <Input {...field} placeholder="이메일을 입력해주세요." />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## 🔒 보안 패턴

### **1. 쿠키 기반 토큰 저장**

```typescript
storage: createJSONStorage(() => cookieStorage);
```

### **2. 환경변수 분리**

- `NEXT_PUBLIC_BACK_BASE_URL` - API 기본 URL

### **3. API Proxy 패턴**

```typescript
// next.config.ts
rewrites: async () => {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_BACK_BASE_URL + '/api/:path*',
    },
  ];
};
```

---

## 📱 라우팅 패턴

### **사용자 타입별 분리**

- `/creator` - 크리에이터 전용
- `/learner` - 러너 전용
- `/login/[userType]` - 동적 라우트

### **레이아웃 중첩**

```
RootLayout (전역)
  └─ AuthorizedLayout (인증 필요)
       ├─ Header
       ├─ Main Content
       └─ Footer
```

---

## 🛠️ 개발 도구 설정

### **ESLint**

- `next/core-web-vitals` 확장
- `next/typescript` 확장

### **PostCSS**

- `@tailwindcss/postcss` - Tailwind v4 플러그인

### **애니메이션**

- `tw-animate-css` - Tailwind 애니메이션 확장

---

## 📝 주요 특징 요약

1. **모듈화된 서비스 레이어**: 도메인별로 service/hook/type 3단 구조
2. **타입 안정성**: 모든 API Response에 제네릭 타입 적용
3. **자동 토큰 갱신**: Interceptor 패턴으로 무중단 인증
4. **컴포넌트 재사용성**: shadcn/ui + cva로 변형 관리
5. **일관된 코딩 스타일**: Prettier + ESLint 자동 포맷팅
6. **사용자 타입 분리**: Creator/Learner 별도 라우팅
7. **다크모드 지원**: CSS 변수 기반 테마 시스템
8. **최신 Next.js**: App Router + Turbopack

---
