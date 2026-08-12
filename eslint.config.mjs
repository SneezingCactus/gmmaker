import antfu from '@antfu/eslint-config';

export default antfu({
  rules: {
    'antfu/consistent-chaining': 'off',
    'antfu/no-import-dist': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-imports': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'ts/switch-exhaustiveness-check': 'off',
    'ts/no-namespace': 'off',
    'ts/no-redeclare': 'off',
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-argument': 'off',
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
}, {
  files: ['**/*.json'],
  language: 'json/json',
  rules: {
    'style/max-len': 'off',
  },
}, {
  files: ['**/*.d.ts'],
  rules: {
    'ts/method-signature-style': 'off',
  },
});
