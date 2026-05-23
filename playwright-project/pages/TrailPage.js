const { BasePage } = require('./BasePage');

class TrailPage extends BasePage {
  constructor(page) {
    super(page);

    // Header
    this.pageHeading = page.getByRole('heading', { level: 1, name: 'Trilha do Inglês' });

    // Contadores
    this.xpTotalLabel     = page.getByText('XP Total');
    this.completadasLabel = page.getByText('Completadas');
    this.sequenciaLabel   = page.getByText('Sequência');

    // Unidade 1 banner
    this.unidade1Heading  = page.getByRole('heading', { level: 2, name: 'Unidade 1' });
    this.comeceDozeroText = page.getByText('Comece do zero');
    this.bannerStarIcon   = page.locator('svg.lucide-star').first();

    // Seções das unidades — .nth(0) é o grid de contadores, unidades começam no índice 1
    this.unidade1Section = page.locator('.animate-slide-up').nth(1);
    this.unidade2Section = page.locator('.animate-slide-up').nth(2);
    this.unidade3Section = page.locator('.animate-slide-up').nth(3);

    // Modal de confirmação de lição (overlay customizado, não usa role=dialog)
    this.lessonModalStartBtn  = page.getByRole('button', { name: 'Começar' });
    this.lessonModalCancelBtn = page.getByRole('button', { name: 'Cancelar' });
  }

  async goto() {
    await this.navigate('/duolingo');
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndGoto(email, senha) {
    await this.navigate('/auth');
    await this.page.locator('input[type="email"]').fill(email);
    await this.page.locator('input[type="password"]').fill(senha);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
    await this.page.waitForTimeout(2000);
    await this.goto();
  }

  // Retorna o card disponível (sem opacity-50) pelo nome da lição
  getLessonCard(lessonName) {
    return this.page
      .locator('[class*="shadow-card"]:not([class*="opacity-50"])')
      .filter({ hasText: lessonName })
      .first();
  }

  // Retorna o card bloqueado (com opacity-50) pelo nome da lição
  getBlockedCard(lessonName) {
    return this.page
      .locator('[class*="shadow-card"][class*="opacity-50"]')
      .filter({ hasText: lessonName })
      .first();
  }

  // Verifica se um card tem ícone de cadeado
  async hasLockIcon(card) {
    return (await card.locator('svg.lucide-lock').count()) > 0;
  }

  // Retorna o botão circular de navegação da Unidade 1 (nth = índice do botão)
  getLessonNodeButton(nth = 0) {
    return this.unidade1Section.locator('button.rounded-full').nth(nth);
  }
}

module.exports = { TrailPage };