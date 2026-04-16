const { test: base } = require('@playwright/test');
const { LoginPage }  = require('../pages/LoginPage');
// Importe outros Page Objects aqui conforme o projeto crescer:
// const { DashboardPage } = require('../pages/DashboardPage');

/**
 * Fixtures customizadas.
 * Cada propriedade aqui fica disponível como parâmetro nos testes,
 * eliminando a necessidade de instanciar pages manualmente.
 *
 * Uso no teste:
 *   test('meu teste', async ({ loginPage }) => { ... })
 */
const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Exemplo para adicionar mais pages:
  // dashboardPage: async ({ page }, use) => {
  //   await use(new DashboardPage(page));
  // },
});

const { expect } = require('@playwright/test');

module.exports = { test, expect };
