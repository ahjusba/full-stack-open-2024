import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {      
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      // '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
    },
    rules: {
      // ...tseslint.configs.recommendedTypeChecked.rules,
      '@stylistic/semi': 'error',
      'space-before-blocks': ['error', 'always'],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-argument': 'error', 
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
      { 'argsIgnorePattern': '^_' }
      ],      
      'keyword-spacing': ['error', {
          before: true,
          after: true,
          overrides: {
            if: { after: true },
            for: { after: true },
            while: { after: true }
          }
        }]
    },
  },
]);
