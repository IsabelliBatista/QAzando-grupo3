const { expect } = require('@playwright/test');

/**
 * Classe base para todos os Page Objects.
 * Centraliza métodos comuns e evita repetição de código.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navega para uma URL relativa à baseURL configurada.
   * @param {string} path - Caminho relativo, ex: '/login'
   */
  async navigate(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Aguarda a página estar completamente carregada.
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Retorna o título da página atual.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Verifica se um elemento está visível na tela.
   * @param {string} selector
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Tira screenshot com nome descritivo.
   * @param {string} name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

module.exports = { BasePage };
