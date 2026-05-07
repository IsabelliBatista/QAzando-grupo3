const { BasePage } = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    // Campos compartilhados entre login e cadastro
    this.emailInput    = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.heading       = page.locator('h3');

    // Login
    this.loginBtn        = page.getByRole('button', { name: 'Entrar' });
    this.forgotPasswordBtn = page.getByRole('button', { name: 'Esqueci minha senha' });
    this.goToRegisterBtn = page.getByRole('button', { name: /Não tem uma conta/i });

    // Cadastro
    this.nameInput       = page.locator('input[placeholder="Seu nome completo"]');
    this.createAccountBtn = page.getByRole('button', { name: 'Criar Conta' });
    this.backToLoginBtn  = page.getByRole('button', { name: /Já tem uma conta/i });

    // Toast (Radix UI)
    this.toast        = page.locator('[role="status"][aria-live="off"]');
    this.toastTitle   = this.toast.locator('.font-semibold');
    this.toastMessage = this.toast.locator('.opacity-90');
  }

  async goto() {
    await this.navigate('/auth');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async fillRegister(name, email, password) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async isDestructiveToast() {
    const cls = await this.toast.getAttribute('class');
    return cls?.includes('destructive') ?? false;
  }
}

module.exports = { AuthPage };