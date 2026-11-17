import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Folders ESLint should never look inside.
  globalIgnores(['dist', 'coverage', 'android', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Catches hook mistakes such as calling hooks inside if-statements.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Keeps hot reload working: component files should export only components.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Matches "verbatimModuleSyntax" in tsconfig: types use `import type`.
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // Must be last: switches off style rules that would fight with Prettier.
  prettier,
]);
