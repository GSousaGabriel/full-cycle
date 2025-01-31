import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path'

const excludeFiles = [
  '**/public/**',
  '**/node_modules/**',
  '**/dist/**',
  '**/html/**',
  '**/docker/**',
  '**/.eslintrc.cjs',
  '**/src/main.tsx',
  '**/src/App.tsx',
  '**/hooks/**',
  '**/types/**',
  '**/interfaces/**',
  '**/schema.tsx',
  '**/columns.tsx',
  '**/assets',
  'src/routes/**',
  'src/pages/jobManagement/components/autoAssign/itemsParameters.tsx',
  'src/pages/user/management', // this was removed for now, the files still there if needed. To be confirmed on next release.
  'src/styles/global.ts',
  'src/utils',
  'src/layout',
  'src/components/**',
  "postcss.config.js",
  "tailwind.config.js",
  "vite.config.ts",
  "vitest.config.ts"
];


export default defineConfig({
  test: {
    ...configDefaults,
    environment: 'node',
    globals: true,
    css: true,
    reporters: ['html'],
    exclude: excludeFiles,
    coverage: {
      provider: 'istanbul',
      exclude: [...excludeFiles, '**/tests/**', '**/*.spec.tsx', '**/*.spec.ts'],
      enabled: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});
