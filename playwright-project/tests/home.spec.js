const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');

test.describe('Home', () => {

  test('CT-001 | Deve abrir a página inicial com sucesso', async ({ page }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home');

    await test.step('Navegar para a página inicial', async () => {
      await page.goto('/');
    });

    await test.step('Verificar que a página carregou', async () => {
      await expect(page).toHaveURL('https://ingles-qazando.lovable.app/');
      await expect(page).toHaveTitle(/.+/);
    });
  });

});
