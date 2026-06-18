const { BasePage } = require('./BasePage');

class QuizPage extends BasePage {
  constructor(page) {
    super(page);

    // Heading e subtítulo
    this.pageHeading = page.getByRole('heading', { level: 1, name: 'Quiz de Inglês' });
    this.subtitle    = page.getByText('Desafio de Vocabulário');

    // Cards de contador
    this.questaoCard = page.locator('[class*="card"]').filter({ hasText: 'Questão' });
    this.acertosCard = page.locator('[class*="card"]').filter({ hasText: 'Acertos' });
    this.errosCard   = page.locator('[class*="card"]').filter({ hasText: 'Erros' });

    // Estrutura da questão — card que contém o enunciado e os botões de resposta
    this.questionCard   = page.locator('[class*="card"]').filter({ hasText: 'Qual a tradução de:' });
    this.questionPrompt = page.getByText('Qual a tradução de:');
    this.exampleLabel   = page.getByText('Exemplo em contexto:');

    // Toast de feedback
    this.toast      = page.locator('[role="status"][aria-live="off"]');
    this.toastTitle = this.toast.locator('.font-semibold');
  }

  async goto() {
    await this.navigate('/quiz');
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

  // Botão de resposta dentro do card da questão (evita capturar botão de fechar o toast)
  getAnswerButton(nth) {
    return this.questionCard.locator('button').nth(nth);
  }

  // Extrai o valor numérico de um card contador (ex: "14/30Questão" → 14, "7Acertos" → 7)
  async getCounterValue(label) {
    const card = this.page.locator('[class*="card"]').filter({ hasText: label }).first();
    const text = await card.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}

module.exports = { QuizPage };
