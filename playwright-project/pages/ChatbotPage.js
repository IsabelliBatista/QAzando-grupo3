// pages/ChatbotPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class ChatbotPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.botaoAvatar = page.getByRole('button', { name: ' Avatar' });
    this.botaoNovaConversa = page.getByRole('button', { name: 'Nova Conversa' });
    this.botaoGravarAudio = page.getByRole('button', { name: 'Gravar áudio' });
    this.botaoPararAudio = page.getByRole('button', { name: 'Parar gravação' });
    this.botaoEnviarMensagem = page.locator('button:has(svg.lucide-send)');

    this.campoMensagem = page.getByPlaceholder('Type your message in English...');
    this.verificarCabecalho = page.getByText(/Chat com Max/i);
    this.verificarRespostaMax = page.locator('p.whitespace-pre-wrap.break-words.leading-relaxed');
    this.verificarRespostaMaxAudio = page.locator('div.text-sm.font-semibold',{ hasText: 'Texto reconhecido' });
    this.alertaNovaConversa = page.locator('div.text-sm.font-semibold',{ hasText: 'Nova Conversa' });
    this.alertaErroAudio = page.locator('div.text-sm.font-semibold',{ hasText: 'Erro' });
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

  async verificarNovaConversa() {
    await expect(this.botaoNovaConversa).toBeVisible();
  }

  async novaConversa() {
    await this.botaoNovaConversa.click();
  }

  async verificarMensagem() {
    await expect(this.campoMensagem).toBeVisible();
  }

  async clicarNovaConversa() {
    await this.botaoNovaConversa.click();
  }

  async verificarAlertaNovaConversa() {
    await expect(this.alertaNovaConversa).toBeVisible({ timeout: 15000 });
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
  
  async verificarAudio() {
    await expect(this.botaoGravarAudio).toBeVisible();
  }

  async gravarAudio() {
    await this.botaoGravarAudio.click();
  }

  async pararGravarAudio() {
    await this.botaoPararAudio.click();
  }

  async respostaMaxAudio() {
    await expect(this.verificarRespostaMaxAudio).toBeVisible({ timeout: 5000 });
  }

  async verificarAlertaErroAudio() {
    await expect(this.alertaErroAudio).toBeVisible({ timeout: 5000 });
  }

  async verificarOrdemMensagens() {
    const mensagens = await this.page.locator('p.whitespace-pre-wrap.break-words.leading-relaxed').allTextContents();
    const mensagensUsuario = mensagens.filter(text => text.startsWith('User:'));
    const mensagensMax = mensagens.filter(text => text.startsWith('Max:')); 
  }


} 
module.exports = { ChatbotPage };