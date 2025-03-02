import onlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export const angularConfig = [
  {
    ignores: ['**/node_modules', '**/dist/', 'projects/**/*']
  },
  ...compat.extends('eslint:recommended', 'prettier', 'eslint-config-turbo'),
  {
    plugins: {
      'only-warn': onlyWarn
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: '/Users/cem.usta/dev/bilge/packages/eslint-config/tsconfig.app.json'
        }
      }
    }
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates'
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts']
    })),
  {
    files: ['**/*.ts'],

    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ]
    }
  },
  ...compat
    .extends(
      'plugin:@angular-eslint/template/recommended',
      'plugin:@angular-eslint/template/accessibility'
    )
    .map((config) => ({
      ...config,
      files: ['**/*.html']
    })),
  {
    files: ['**/*.html'],
    rules: {}
  }
];
