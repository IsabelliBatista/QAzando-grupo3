const { BasePage } = require('./BasePage');

class RankingPage extends BasePage {
  constructor(page) {
    super(page);

    // Heading
    this.pageHeading          = page.getByRole('heading', { level: 1, name: 'Ranking Alunos Qazando' });
    this.classificacaoHeading = page.getByRole('heading', { name: 'Classificação Geral' });

    // Regra de negócio
    this.ruleText = page.getByText('Para aparecer no ranking, você precisa responder pelo menos 5 perguntas');

    // Cards de métricas
    this.totalCompetidoresCard = page.locator('[class*="card"]').filter({ hasText: 'Total de Competidores' });
    this.liderAtualCard        = page.locator('[class*="card"]').filter({ hasText: 'Líder Atual' });
    this.maiorPrecisaoCard     = page.locator('[class*="card"]').filter({ hasText: 'Maior Precisão' });

    // Estado vazio — ícone de troféu grande (h-16), mensagem e sub-mensagem
    this.emptyStateTrophyIcon = page.locator('svg.lucide-trophy.h-16');
    this.emptyStateMsg        = page.getByText('Nenhum usuário no ranking ainda');
    this.emptyStateSub        = page.getByText('Seja o primeiro a responder exercícios!');

    // Seção de Classificação Geral (card que contém a lista / estado vazio)
    this.classificacaoSection = page.locator('[class*="card"]').filter({ hasText: 'Classificação Geral' });
  }

  async goto() {
    await this.navigate('/ranking');
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

  // Retorna linha do ranking com o nome do usuário (útil quando ranking estiver populado)
  getRankingRow(userName) {
    return this.classificacaoSection.locator('tr,li,[class*="row"],[class*="item"]').filter({ hasText: userName });
  }
}

module.exports = { RankingPage };
