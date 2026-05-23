const { test, expect } = require('../fixtures');
const { allure }       = require('@playwright/test');

test('Deve exibir dados corretos na tela de progresso', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('usuario@teste.com', 'Senha@123');

  // Vai direto pra tela
  await page.goto('/progresso');

  // Valida título
  await expect(page.getByText('Seu Progresso aqui')).toBeVisible();

  // Captura valores
  const frasesRespondidas = await page.locator('text=Frases Respondidas').locator('..').locator('strong').textContent();
  const frasesCorretas = await page.locator('text=Frases Corretas').locator('..').locator('strong').textContent();
  const frasesIncorretas = await page.locator('text=Frases Incorretas').locator('..').locator('strong').textContent();

  // Converte para número
  const respondidas = Number(frasesRespondidas);
  const corretas = Number(frasesCorretas);
  const incorretas = Number(frasesIncorretas);

  // Regra de negócio
  expect(corretas + incorretas).toBe(respondidas);
});