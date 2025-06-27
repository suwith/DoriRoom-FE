import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
    rules: {
      // 기본 스타일 규칙
      quotes: ['error', 'single'],
      indent: ['error', 2],
      // 'no-console': 'warn',

      // camelCase: 변수, 함수
      camelcase: ['error', { properties: 'always' }],

      // PascalCase: 클래스/컴포넌트
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],

      // 함수는 function 선언만 허용, 화살표 함수 금지
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
    },
  }),

  // prettier 적용
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
