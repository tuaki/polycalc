module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: [ 'dist', '.eslintrc.cjs' ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [ 'react-refresh' ],
    rules: {
        'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true } ],
        'no-eval': [ 'error' ],
        'semi': [ 'error', 'always' ],
        'indent': [ 'warn', 4 ],
        'array-bracket-spacing': [ 'warn', 'always' ],
        'object-curly-spacing': [ 'warn', 'always' ],
        'space-before-function-paren': [ 'warn', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        } ],
        'curly': [ 'warn', 'multi-or-nest', 'consistent' ],
        'brace-style': [ 'warn', 'stroustrup' ],
        '@typescript-eslint/no-empty-function': [ 'warn', { allow: [ 'private-constructors' ] } ],
        'react/display-name': [ 'off' ],
        'nonblock-statement-body-position': [ 'error', 'below' ],
        '@typescript-eslint/member-delimiter-style': [ 'error', { singleline: { delimiter: 'comma' } } ],
        '@typescript-eslint/consistent-type-imports': [ 'error', { fixStyle: 'inline-type-imports' } ],
        'comma-dangle': [ 'warn', 'always-multiline' ],
        'react-hooks/exhaustive-deps': [ 'warn' ],
        'quotes': [ 'warn', 'single', { allowTemplateLiterals: true } ],
        'jsx-quotes': [ 'warn', 'prefer-single' ]
    },
}
