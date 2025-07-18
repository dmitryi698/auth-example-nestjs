// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // eslint
      'class-methods-use-this': 'off',
      complexity: ['error', 20],
      'consistent-return': 'off',
      'eslint-comments/require-description': 'off',
      'func-names': 'off',
      'max-len': ['error', { code: 140, ignoreTemplateLiterals: true, ignoreUrls: true }],
      'newline-per-chained-call': 'off',
      'no-await-in-loop': 'off',
      'no-continue': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'no-void': ['error', { allowAsStatement: true }],
      'object-curly-newline': 'off',
      'spaced-comment': ['error', 'always', { line: { markers: ['/', '#region', '#endregion'] } }],

      // import
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/prefer-default-export': 'off',

      // @typescript-eslint
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'angle-bracket' }],
      '@typescript-eslint/init-declarations': ['error', 'never', { ignoreForLoopInit: true }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['strictCamelCase'] },
        { selector: 'variable', format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'] },
        { selector: 'parameter', modifiers: ['unused'], format: ['strictCamelCase'], leadingUnderscore: 'allow' },
        { selector: 'property', format: null },
        { selector: 'typeProperty', format: null },
        { selector: 'typeLike', format: ['StrictPascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowAny: true, allowBoolean: true, allowNullish: true, allowNumber: true, allowRegExp: true },
      ],
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',

      // stylistic
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': 'off',
      '@stylistic/keyword-spacing': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/operator-linebreak': 'off',

      // sonarjs
      'sonarjs/cognitive-complexity': ['error', 25],
      'sonarjs/no-commented-code': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-nested-assignment': 'off',

      // unicorn
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-ternary': ['error', 'only-single-line'],
      'unicorn/prefer-top-level-await': 'off',

      // jest
      'jest/expect-expect': ['error', { assertFunctionNames: ['expect', 'request.**.expect'] }],
    },
  },
);
