import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
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
    allConfig: js.configs.all,
});

export default defineConfig([globalIgnores(['dist/*']), {
    extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),

    plugins: {
        '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
    },

    rules: {
        strict: ['error', 'global'],
        indent: ['warn', 4],
        'linebreak-style': ['warn', 'unix'],
        'no-trailing-spaces': ['warn'],

        quotes: ['warn', 'single', {
            avoidEscape: true,
        }],

        semi: ['error', 'always'],

        'no-console': ['warn', {
            allow: ['error'],
        }],

        'object-shorthand': ['warn'],
        'quote-props': ['error', 'as-needed'],
        'array-callback-return': ['error'],
        'prefer-rest-params': ['error'],
        'prefer-spread': ['error'],

        'prefer-destructuring': ['error', {
            AssignmentExpression: {
                object: false,
                array: false,
            },
        }],

        'brace-style': ['warn', 'stroustrup'],
        'spaced-comment': ['error'],
        'space-before-blocks': ['error'],
        'keyword-spacing': ['error'],
        'comma-dangle': ['warn', 'always-multiline'],
        'no-var': ['warn'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-empty-function': ['off'],
    },
}]);
