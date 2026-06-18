//LoginPage.js
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput = page.getByPlaceholder('seu@email.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.loginButton   = page.getByRole('button', { name: /entrar/i });

    this.errorMessage  = page.locator('[role="status"][aria-live="off"] .opacity-90');
    this.logoutButton  = page.getByRole('button', { name: 'Sair' });
  }

  async goto() {
    await this.navigate('/auth');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ timeout: 8000 });
    return await this.errorMessage.textContent();
  }

  async isLoggedIn() {
    return !this.page.url().includes('/auth');
  }
}

module.exports = { LoginPage };