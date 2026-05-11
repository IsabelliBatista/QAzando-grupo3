// pages/InterviewPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class InterviewPage extends BasePage {
  constructor(page) {
    super(page);

    this.botaoGerarPergunta = page.getByRole('button', { name: 'Gerar Pergunta de Entrevista' });
    this.campoResposta      = page.getByPlaceholder('Type your answer here in English...');
    this.botaoEnviarResposta = page.getByRole('button', { name: 'Enviar Resposta' }); 
    this.botaoGerarNovaPergunta = page.getByRole('button', { name: 'Gerar Nova Pergunta' });
    this.perguntaComSucesso = page.getByText('Sua pergunta de entrevista foi criada com sucesso');
    this.respostaAvaliadaComSucesso = page.getByText('Resposta Avaliada!');
  }
  
  async goto() {
    await this.navigate('/interview');
  }

  async gerarPergunta() {
    await this.botaoGerarPergunta.click();
  }

  async responder(resposta) {
   await this.campoResposta.fill(resposta);
  }

  async enviarResposta() {
    return this.botaoEnviarResposta.click();
  }

  async gerarNovaPergunta() {
    await this.botaoGerarNovaPergunta.click();
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