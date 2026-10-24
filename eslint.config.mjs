import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^(_|ignore)' }],
    },
  },
  {
    ignores: ['.next/', '.open-next/', '.wrangler/', 'src/payload-types.ts', 'src/migrations/', 'src/app/(payload)/', 'cloudflare-env.d.ts'],
  },
]

export default eslintConfig
