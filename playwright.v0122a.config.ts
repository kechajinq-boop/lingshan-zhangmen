import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4180 --strictPort',
    url: 'http://127.0.0.1:4180/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
