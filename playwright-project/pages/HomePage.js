const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.navbar      = page.getByRole('navigation');
    this.mainHeading = page.getByRole('heading', { level: 1 });
    this.loginLink   = page.getByRole('link', { name: 'Entrar' });
    this.ctaNavBtn   = page.getByRole('link', { name: 'Começar Grátis' });
    this.ctaHeroBtn  = page.getByRole('link', { name: /comece agora/i });
    this.logoImg     = page.locator('img[alt="Qazando"]').first();
    this.brandText   = page.locator('nav').getByText('English QA');
    this.footer      = page.locator('footer');
  }

  async goto() {
    await this.navigate('/');
  }
}

module.exports = { HomePage };
