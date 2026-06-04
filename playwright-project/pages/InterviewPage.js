// pages/InterviewPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class InterviewPage extends BasePage {
  constructor(page) {
    super(page);

    this.botaoGerarPergunta = page.getByRole('button', { name: 'Gerar Pergunta de Entrevista' });
    this.campoResposta      = page.getByPlaceholder('Type your answer here in English...');
    this.campoTituloComecar = page.getByRole('heading', { name: 'Pronto para começar?', level: 3 });
    this.botaoEnviarResposta = page.getByRole('button', { name: 'Enviar Resposta' }); 
    this.botaoGerarNovaPergunta = page.getByRole('button', { name: 'Gerar Nova Pergunta' });
    this.perguntaComSucesso = page.getByText('Sua pergunta de entrevista foi criada com sucesso');
    this.respostaAvaliadaComSucesso = page.getByText('Resposta Avaliada!');
  }
  
  async goto() {
    await this.navigate('/interview');
  }

  async gerarPergunta() {
    await this.botaoGerarPergunta.click({timeout: 15000});
  }

  async responder(resposta) {
   await this.campoResposta.fill(resposta);
  }

  async enviarResposta() {
    return this.botaoEnviarResposta.click({timeout: 10000});
  }

  async gerarNovaPergunta() {
    await this.botaoGerarNovaPergunta.click();
  }

  async verificarTituloComecar() {
    await expect(this.campoTituloComecar).toBeVisible();
  }

  async verificarBotaoGerarPergunta() {
    await expect(this.botaoGerarPergunta).toBeVisible();
  }

  async verificarBotaoEnviarDesabilitado() {
    await expect(this.botaoEnviarResposta).toBeDisabled();
  }

  async verificarPerguntaSucesso() {
    await expect(this.perguntaComSucesso.first()).toBeVisible({ timeout: 10000 });
  }

  async respostaAvaliada() {
    await expect(this.respostaAvaliadaComSucesso.first()).toBeVisible({ timeout: 15000 });
  }
  
}

module.exports = { InterviewPage };