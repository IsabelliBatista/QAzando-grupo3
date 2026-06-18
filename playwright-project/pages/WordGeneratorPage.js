const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class WordGeneratorPage extends BasePage {
  constructor(page) {
    super(page);

    this.campoTitulo = page.getByRole('heading', { name: 'Gerador de Palavras' });
    this.campoSubtitulo = page.getByText('Crie listas personalizadas de vocabulário com exemplos e áudio');
    this.campoQtdPalavras = page.getByPlaceholder('10');
    this.campoTema = page.getByRole('textbox', { name: 'Ex: comida, animais, viagens' });
    this.botaoGerarPalavras = page.getByRole('button', { name: 'Gerar Palavras com IA' });
    this.campoResultadoVocabulario = page.getByRole('heading', { name: 'Vocabulário Gerado' });
    this.campoAlerta = page.getByRole('status').first();
    this.palavraIngles = page.getByRole('heading', { level: 3 }).first();
    this.palavraPortugues = page.locator('p.text-muted-foreground').first();
    this.botaoOuvir = page.getByTitle('Ouvir pronúncia').first();
    this.ultimoBotaoOuvir = page.getByTitle('Ouvir pronúncia').last();
    this.exemploIngles = page.getByText('Exemplo em inglês:').first();
    this.ultimoExemploIngles = page.getByText('Exemplo em inglês:').last();
    this.traducao = page.getByText('🇧🇷 Tradução:').first();
    this.ultimaTraducao = page.getByText('🇧🇷 Tradução:').last();
  }

 async goto() {
    await this.navigate('/words');
  }

  async digitarQtdPalavras(quantidade) {
    await this.campoQtdPalavras.clear();
    await this.campoQtdPalavras.pressSequentially(quantidade);
  }

  async digitarTema(tema) {
    await this.campoTema.fill(tema);
  }

  async clicarGerarPalavras() {
    await this.botaoGerarPalavras.click();
  }

  async verificarTitulo() {
    await expect(this.campoTitulo).toBeVisible();
  }

  async verificarSubtitulo() {
    await expect(this.campoSubtitulo).toBeVisible();
  }

  async botaoGerarPalavrasDesabilitado() {
    await expect(this.botaoGerarPalavras).toBeDisabled();
  }

  async alerta(tempo = 5000) {
    await expect(this.campoAlerta).toBeVisible({ timeout: tempo });
  }

  async verificarResultadoAlerta(tempo = 5000) {
    await expect(this.campoResultadoVocabulario).toBeVisible({ timeout: tempo });
  }

  async verificarExibicaoCampos(tempo = 5000) {
    await this.ultimaTraducao.waitFor({ state: 'visible', timeout: tempo });
    await expect(this.palavraIngles).toBeVisible({ timeout: tempo });
    await expect(this.palavraPortugues).toBeVisible();
    await expect(this.botaoOuvir).toBeVisible();
    await expect(this.ultimoBotaoOuvir).toBeVisible();
    await expect(this.exemploIngles).toBeVisible();
    await expect(this.ultimoExemploIngles).toBeVisible();
    await expect(this.traducao).toBeVisible();
    await expect(this.ultimaTraducao).toBeVisible();
  }
}

module.exports = { WordGeneratorPage };