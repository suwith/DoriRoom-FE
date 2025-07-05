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

      // 함수는 fucntion 또는 arrow function 모두 허용
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],

      // 콜백 함수는 arrow function 사용 권장
      'prefer-arrow-callback': ['warn'],

      // 빈 함수 금지 (테스트 목적일 경우는 예외 처리 가능)
      'no-empty-function': ['warn'],

      // 사용되지 않는 함수 인자나 변수 금지
      'no-unused-vars': [
        'warn',
        { args: 'after-used', ignoreRestSiblings: true },
      ],

      // async 함수에서 반드시 await를 사용해야 함
      'require-await': ['warn'],
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
