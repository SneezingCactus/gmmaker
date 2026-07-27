import antfu from '@antfu/eslint-config';

export default antfu({
  rules: {
    'antfu/consistent-chaining': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-imports': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'ts/switch-exhaustiveness-check': 'off',
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-call': 'off',
    'no-console': 'off',
    'no-alert': 'off',
  },
  stylistic: {
    semi: true,
    overrides: {
      'style/max-len': ['error', { code: 120 }],
    },
  },
  typescript: { tsconfigPath: './tsconfig.json' },
});
