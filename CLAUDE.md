# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build (Turbopack)
npm run lint     # Run ESLint
npm run start    # Start production server
```

There are no test commands — this project has no test suite.

## Architecture

**Next.js 15 App Router** project with TypeScript strict mode. Path alias `@/*` maps to `src/*`.

### Folder structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (authorized)/        # Auth-gated route group (creator/, learner/, creator-center/)
│   ├── login/, signup/      # Public auth pages
│   ├── _components/         # App-level shared components (Header, Footer, etc.)
│   └── stores/              # App-level Zustand stores
└── shared/                  # Reusable modules
    ├── components/ui/        # shadcn/ui primitives (~30 components)
    ├── lib/                  # Utils: cn(), formatViewCount(), hooks/, regex.ts
    ├── services/             # Domain-based API layer (see below)
    ├── stores/               # Zustand stores (auth.ts, etc.)
    ├── providers/            # ReactQueryProvider
    └── types/                # Global types: ApiResponse<T>, UserType enum
```

### Three-tier service pattern

Every API domain in `src/shared/services/[domain]/` follows this structure:

**`*.service.ts`** — pure API call functions, named with HTTP method prefix:
```typescript
export const POST_login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post('/api/v1/auth/login', data);
  return response.data;
};
```

**`*.hook.ts`** — React Query wrappers around services:
```typescript
export const usePostLogin = () =>
  useMutation({ mutationKey: [POST_login.name], mutationFn: (data: LoginRequest) => POST_login(data) });
```

**`*.type.ts`** — TypeScript types for the domain (`*Request`, `*Response`, `*Enum`).

Components call hooks via `mutateAsync` or `data` — never call service functions directly from components.

### State management

- **Zustand** (`shared/stores/auth.ts`): `accessToken` + `refreshToken` persisted to cookies under key `@insty-app.token` via `cookieStorage` adapter. `nickname` stored in memory-only `useUserStore`.
- **React Query**: server state, `staleTime: 60_000ms`. Provider in `shared/providers/react-query-provider.tsx`.

### API & auth

- Axios instance in `shared/services/api.ts` with interceptors:
  - **Request**: auto-attaches `Authorization: Bearer <token>` from Zustand store.
  - **Response**: on 401 → refresh token → queue concurrent requests → retry. Uses `_retry` flag to prevent infinite loops.
- API proxied through Next.js rewrites (`/api/v1/*` → `NEXT_PUBLIC_BACK_BASE_URL`).

### Routing & middleware

`src/middleware.ts` reads the Zustand cookie (`@insty-app.token`) directly:
- `AUTH_REQUIRED_ROUTES`: `/creator`, `/creator-center`, `/learner`, `/mypage` → redirects to `/login?redirect=...` if unauthenticated.
- `GUEST_ONLY_ROUTES`: `/login`, `/signup` → redirects to `/home` if already authenticated.

User types are `LEARNER` and `CREATOR` — separate pages under `/learner/*` and `/creator/*`.

## Naming conventions

| What | Convention | Example |
|---|---|---|
| Components | PascalCase | `ScrollAnimation.tsx` |
| Services | `domain.service.ts` | `auth.service.ts` |
| Hooks | `domain.hook.ts` | `auth.hook.ts` |
| Types | `domain.type.ts` | `auth.type.ts` |
| Utils | kebab-case | `cookie-storage.ts` |
| API functions | `HTTP_METHOD_name` | `POST_login`, `GET_profile` |
| Query hooks | `use` + method + name | `usePostLogin`, `useGetProfile` |
| Type suffixes | `*Request`, `*Response` | `LoginRequest`, `LoginResponse` |

## UI & styling

- **shadcn/ui** (New York style) + **Tailwind CSS 4** via PostCSS.
- Use `cn()` from `shared/lib/utils.ts` (clsx + tailwind-merge) for className merging.
- Use **CVA** (`class-variance-authority`) for component variants.
- Brand color: `primary-green-600` (#67d215) for default buttons; `-700` (#51a611) on hover.
- Dark mode via `.dark` CSS class with oklch-based CSS variables.

## Forms

React Hook Form + Zod. Always use the `<Form>` / `<FormField>` / `<FormItem>` / `<FormControl>` / `<FormMessage>` pattern from shadcn/ui. Validation regexes live in `shared/lib/regex.ts`.

## Common global types

```typescript
// shared/types/api.type.ts
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}
```

## Prettier config (key settings)

`singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 120`, `trailingComma: "all"`. Plugins auto-sort imports and Tailwind classes — run Prettier before committing.
