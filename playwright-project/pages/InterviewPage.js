// pages/InterviewPage.js
const { BasePage } = require('./BasePage');

class InterviewPage extends BasePage {
  constructor(page) {
    super(page);

    this.botaoGerarPergunta = page.getByRole('button', { name: 'Gerar Pergunta de Entrevista' });
    this.campoResposta      = page.getByPlaceholder('Type your answer here in English...');
    this.botaoEnviarResposta = page.getByRole('button', { name: 'Enviar Resposta' }); 
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


}

module.exports = { InterviewPage };