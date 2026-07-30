import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import angularEslint from '@angular-eslint/eslint-plugin';
import angularTemplateParser from '@angular-eslint/template-parser';
import angularTemplateEslint from '@angular-eslint/eslint-plugin-template';
import rxjs from 'eslint-plugin-rxjs';
import jsdoc from 'eslint-plugin-jsdoc';

const angularRecommendedRules = {
  '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
  '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
  '@angular-eslint/no-input-rename': 'error',
  '@angular-eslint/no-output-rename': 'error',
  '@angular-eslint/no-output-on-prefix': 'error',
  '@angular-eslint/no-output-native': 'error',
  '@angular-eslint/no-empty-lifecycle-method': 'error',
  '@angular-eslint/no-inputs-metadata-property': 'error',
  '@angular-eslint/no-outputs-metadata-property': 'error',
  '@angular-eslint/use-lifecycle-interface': 'error',
  '@angular-eslint/use-pipe-transform-interface': 'error',
  '@angular-eslint/contextual-lifecycle': 'error',
  '@angular-eslint/no-async-lifecycle-method': 'error',
};

const angularTemplateRecommendedRules = {
  '@angular-eslint/template/banana-in-box': 'error',
  '@angular-eslint/template/no-negated-async': 'error',
};

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  fetch: 'readonly',
  atob: 'readonly',
  btoa: 'readonly',
  confirm: 'readonly',
  alert: 'readonly',
  crypto: 'readonly',
  performance: 'readonly',
  getComputedStyle: 'readonly',
};

const testGlobals = {
  describe: 'readonly',
  it: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  expect: 'readonly',
  jasmine: 'readonly',
  spyOn: 'readonly',
  fail: 'readonly',
  pending: 'readonly',
  HttpClientTestingModule: 'readonly',
};

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.angular/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...browserGlobals,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslint,
      rxjs,
      jsdoc,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...angularRecommendedRules,
      'rxjs/no-unbound-methods': 'off',
      'rxjs/no-ignored-error': 'off',
      'rxjs/no-unsafe-take': 'off',
      'rxjs/no-unsafe-first': 'off',
      'rxjs/no-unsafe-switch-map': 'off',
      'rxjs/prefer-observable-from-event': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-wrapper-object-types': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/test-helpers/**/*.ts'],
    languageOptions: {
      globals: testGlobals,
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplateEslint,
    },
    rules: {
      ...angularTemplateRecommendedRules,
    },
  },
];