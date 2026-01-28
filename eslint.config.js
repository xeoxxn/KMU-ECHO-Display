import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tseslint from 'typescript-eslint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entryPointAbs = path.join(__dirname, 'src', 'index.css');

export default tseslint.config([
    { ignores: ['dist'] },
    {
        settings: {
            'better-tailwindcss': { entryPoint: entryPointAbs },
            react: { version: 'detect' },
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            sourceType: 'module',
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'better-tailwindcss': betterTailwindcss,
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            'better-tailwindcss/enforce-consistent-class-order': 'off',
            'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
            'better-tailwindcss/no-duplicate-classes': 'warn',
            'better-tailwindcss/no-unnecessary-whitespace': 'warn',
            'better-tailwindcss/no-unregistered-classes': 'warn',
            'no-unused-vars': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'prettier/prettier': ['warn', { endOfLine: 'auto' }],
        },
    },
]);
