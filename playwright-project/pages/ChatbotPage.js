// pages/ChatbotPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class ChatbotPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.botaoAvatar = page.getByRole('button', { name: 'Avatar' });
    this.botaoNovaConversa = page.getByRole('button', { name: 'Nova Conversa' });
    this.botaoGravarAudio = page.getByRole('button', { name: 'Gravar áudio' });
    this.campoMensagem = page.getByPlaceholder('Type your message in English...');
    this.verificarCabecalho = page.getByRole('heading', { name: 'Chat com Max' });
  }

  async goto() {
    await this.navigate('/chatbot');
  }

  async cabecalho() {
    await expect(this.verificarCabecalho).toBeVisible();
  }

  async verificarAvatar() {
    await expect(this.botaoAvatar).toBeVisible();
  }

  async novaConversa() {
    await expect(this.botaoNovaConversa).toBeVisible();
  }

  async mensagem() {
    await expect(this.campoMensagem).toBeVisible();
  }
  
  async gravarAudio() {
    await expect(this.botaoGravarAudio).toBeVisible();
  }

}

module.exports = { ChatbotPage };