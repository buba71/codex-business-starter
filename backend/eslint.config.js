import eslint from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';

export default [
    {
        ignores: [
            'node_modules/**',
            'public/build/**',
            'vendor/**',
            'var/**',
        ],
    },
    eslint.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        files: ['assets/**/*.{js,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
        },
    },
    {
        files: ['eslint.config.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['assets/**/*.{test,spec}.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.vitest,
            },
        },
    },
];
