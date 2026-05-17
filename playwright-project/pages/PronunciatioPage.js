// pages/PronunciationPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class PronunciationPage extends BasePage {
  constructor(page) {
        super(page);

        this.campoTitulo = page.getByRole('heading', { name: 'Treinar Pronúncia' });
        this.campoSubtitulo = page.getByText('Pratique sua pronúncia com frases geradas por IA e feedback em tempo real');
        this.botaoGerarFrase = page.getByRole('button', { name: 'Gerar Nova Frase com IA' });
        this.campoFraseGerada = page.getByText('text-3xl.font-bold.text-foreground.mb-6.text-center.leading-relaxed');
        this.botaoFalarAgora = page.getByRole('button', { name: 'Falar Agora e Receber Feedback' });
        this.campoAlertaErroAudio = page.getByText('Não foi possível reconhecer o áudio. Tente novamente.');
    }

    async goto() {
        await this.navigate('/pronunciation');
        await this.page.waitForLoadState('networkidle');
    }

    async verificarTitulo() {
        await expect(this.campoTitulo).toBeVisible();
    }

    async verificarSubtitulo() {
        await expect(this.campoSubtitulo).toBeVisible();
    }

    async verificarBotaoGerarFrase() {
        await expect(this.botaoGerarFrase).toBeVisible();
    }

    async verificarFraseGerada() {
        await expect(this.campoFraseGerada).toBeVisible({ timeout: 10000 });
    }

    async verificarAlertaErroAudio() {
        await expect(this.campoAlertaErroAudio).toBeVisible({ timeout: 10000 });
    }

    async clicarGerarFrase() {
        await this.botaoGerarFrase.click();
    }

    async clicarFalarAgora() {
        await this.botaoFalarAgora.click();
    }
}
module.exports = { PronunciationPage };