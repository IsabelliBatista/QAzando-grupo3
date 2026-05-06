// pages/InterviewPage.js
const { BasePage } = require('./BasePage');

class InterviewPage extends BasePage {
  constructor(page) {
    super(page);

    this.botaoGerarPergunta = page.getByRole('button', { name: 'Gerar Pergunta de Entrevista' });
    this.botaoEnviarResposta        = page.getByRole('button', { name: 'Enviar Resposta' });
    this.campoResposta      = page.getByPlaceholder('Type your answer here in English...');
    this.botaoResponder     = page.getByRole('button', { name: 'Enviar Resposta' });
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

  async botaoEnviarResposta() {
    return this.botaoResponder.click();
  }

}

module.exports = { InterviewPage };