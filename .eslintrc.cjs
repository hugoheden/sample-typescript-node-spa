module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'plugin:import/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        // It is unclear if the below rule set is a good idea. Maybe it is better to just use the default rules?
        // We have sprinkled with rules here...
        '@typescript-eslint/no-var-requires': 'error',
        'import/no-commonjs': 'error',
        'import/no-dynamic-require': 'error',
        "import/no-duplicates": "error",
        "import/no-unresolved": "error",
        'import/no-extraneous-dependencies': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-unused-modules': 'error',
        'import/no-useless-path-segments': 'error',
        "import/order": ["error", {
            "groups": ["builtin", "external", "internal"],
            "newlines-between": "always",
        }],
        "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_"}],
    },
};