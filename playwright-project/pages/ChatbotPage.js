// pages/ChatbotPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class ChatbotPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.botaoAvatar = page.getByRole('button', { name: ' Avatar' });
    this.botaoNovaConversa = page.getByRole('button', { name: 'Nova Conversa' });
    this.botaoGravarAudio = page.getByRole('button', { name: 'Gravar áudio' });
    this.botaoEnviarMensagem = page.locator('button:has(svg.lucide-send)');

    this.campoMensagem = page.getByPlaceholder('Type your message in English...');
    this.verificarCabecalho = page.getByText(/Chat com Max/i);
    this.verificarRespostaMax = page.locator('p.whitespace-pre-wrap.break-words.leading-relaxed');
  }

  async goto() {
    await this.navigate('/chatbot');
    await this.page.waitForLoadState('networkidle');
  }

  async cabecalho() {
    await expect(this.verificarCabecalho).toBeVisible();
  }

  async verificarAvatar() {
    await expect(this.botaoAvatar).toBeVisible();
  }

  async verificarNovaConversa() {
    await expect(this.botaoNovaConversa).toBeVisible();
  }

  async botaoNovaConversa() {
    await this.botaoNovaConversa.click();
  }

  async verificarMensagem() {
    await expect(this.campoMensagem).toBeVisible();
  }

  async mensagem(mensagem) {
    await this.campoMensagem.fill(mensagem);
  }

  async enviarMensagem() {
    await this.botaoEnviarMensagem.click();
  }

  async respostaMax() {
    await expect(this.verificarRespostaMax).toBeVisible({ timeout: 15000 });
  }
  
  async gravarAudio() {
    await expect(this.botaoGravarAudio).toBeVisible();
  }

}

module.exports = { ChatbotPage };