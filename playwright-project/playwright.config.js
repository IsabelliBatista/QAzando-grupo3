// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Diretório onde ficam os testes
  testDir: './tests',

  // Executar testes em paralelo
  fullyParallel: true,

  // Falhar o build se deixar test.only no código
  forbidOnly: !!process.env.CI,

  // Número de retentativas em CI
  retries: process.env.CI ? 2 : 0,

  // Workers paralelos
  workers: process.env.CI ? 1 : undefined,

  // Reporter: Allure + HTML nativo como fallback
  reporter: [
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    // URL base — ajuste para a URL da sua aplicação
    baseURL: process.env.BASE_URL || 'https://ingles-qazando.lovable.app',

    // Capturar trace em caso de falha
    trace: 'on-first-retry',

    // Screenshot em caso de falha
    screenshot: 'only-on-failure',

    // Vídeo em caso de falha
    video: 'on-first-retry',

    // Timeout de ação (ex: click, fill)
    actionTimeout: 10_000,

    // Headless por padrão
    headless: true,
  },

  // Timeout global por teste
  timeout: 30_000,

  // Timeout de expect
  expect: {
    timeout: 5_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomente para adicionar outros browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Pasta de resultados
  outputDir: 'test-results/',
});
