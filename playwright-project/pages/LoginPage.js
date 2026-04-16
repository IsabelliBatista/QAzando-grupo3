const { BasePage } = require('./BasePage');

/**
 * Page Object para a tela de Login.
 * Exemplo de implementação — adapte os seletores para sua aplicação.
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Seletores — centralizados aqui para fácil manutenção
    this.usernameInput = page.getByLabel('Usuário');
    this.passwordInput = page.getByLabel('Senha');
    this.loginButton   = page.getByRole('button', { name: 'Entrar' });
    this.errorMessage  = page.locator('.error-message');
    this.welcomeText   = page.locator('.welcome-header');
  }

  /**
   * Navega para a página de login.
   */
  async goto() {
    await this.navigate('/login');
  }

  /**
   * Realiza login com as credenciais fornecidas.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Retorna o texto da mensagem de erro exibida.
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Verifica se o login foi realizado com sucesso.
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    return await this.welcomeText.isVisible();
  }
}

module.exports = { LoginPage };
