const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { USERS }        = require('../utils/credentials');

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-001 | Login com credenciais válidas', async ({ loginPage, page }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'login');

    await test.step('Preencher credenciais e submeter', async () => {
      await loginPage.login(USERS.admin.email, USERS.admin.senha);
    });

    await test.step('Aguardar redirecionamento após login', async () => {
      await page.waitForURL(url => !url.href.includes('/auth'), { timeout: 8000 });
    });

    await test.step('Verificar redirecionamento para o dashboard', async () => {
      expect(await loginPage.isLoggedIn()).toBeTruthy();
    });
  });

  test('CT-002 | Login com senha incorreta exibe mensagem de erro', async ({ loginPage }) => {
    allure.label('severity', 'normal');
    allure.tag('login', 'negativo');

    await test.step('Preencher credenciais inválidas e submeter', async () => {
      await loginPage.login(USERS.invalido.email, USERS.invalido.senha);
    });

    await test.step('Verificar mensagem de erro', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Email ou senha incorretos');
    });
  });

  test('CT-003 | Login com campos vazios não submete', async ({ loginPage, page }) => {
    allure.label('severity', 'minor');
    allure.tag('login', 'validacao');

    await test.step('Clicar em Entrar sem preencher campos', async () => {
      await loginPage.login('', '');
    });

    await test.step('Permanecer na página de login', async () => {
      await expect(page).toHaveURL(/auth/);
    });
  });

});