import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    rules: {
      'no-duplicate-imports': 'error', // 중복 import 방지
      'no-var': 'error', // var 사용 금지 (let, const 사용 권장)
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 경고
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고
      '@typescript-eslint/no-empty-object-type': 'off', // 빈 객체 타입 허용
      'react/jsx-uses-react': 'error', // JSX에서 React 사용 확인
      'react/jsx-uses-vars': 'error', // JSX에서 사용된 변수 확인
      'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types 비활성화
      'react/no-unescaped-entities': 'off', // 따옴표 이스케이프 규칙 비활성화
      'react-hooks/exhaustive-deps': 'warn', // Hook 의존성 검사 경고로 설정
      '@next/next/no-img-element': 'warn', // img 태그 사용 경고로 설정
    },
  },
];

export default eslintConfig;
