// pages/PronunciationPage.js
const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class PronunciationPage extends BasePage {
  constructor(page) {
        super(page);

        this.campoTitulo = page.getByRole('heading', { name: 'Treinar Pronúncia' });
        this.campoSubtitulo = page.getByText('Pratique sua pronúncia com frases geradas por IA e feedback em tempo real');
        this.botaoGerarFrase = page.getByRole('button', { name: 'Gerar Nova Frase com IA' });
        this.botaoFalarAgora = page.getByRole('button', { name: 'Falar Agora e Receber Feedback' });
        this.campoAlertaErroAudio = page.locator('div.text-sm.font-semibold',{ hasText: 'Erro no reconhecimento' });
        this.alertaFraseGerada = page.locator('div.text-sm.font-semibold',{ hasText: 'Nova frase gerada!' }).first();
        this.alertaFeedback = page.locator('div.text-sm.font-semibold',{ hasText: 'Bom trabalho! 👍' });
    }

    async goto() {
        await this.navigate('/pronunciation');
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
        await expect(this.alertaFraseGerada).toBeVisible({ timeout: 10000 });
    }

    async verificarAlertaErroAudio() {
        await expect(this.campoAlertaErroAudio).toBeVisible({ timeout: 10000 });
    }

    async verificarAlertaFeedback() {
        await expect(this.alertaFeedback).toBeVisible({ timeout: 10000 });
    }

    async clicarGerarFrase() {
        await this.botaoGerarFrase.waitFor({ state: 'visible', timeout: 15000 });
        await this.botaoGerarFrase.click();
    }

    async clicarFalarAgora() {
        await this.botaoFalarAgora.click();
    }

    async mockSpeechRecognition(page, transcript) {
        await page.addInitScript((texto) => {
            class FakeSpeechRecognition {
                start() {
                    setTimeout(() => {
                        this.onresult({
                            results: [[{
                                transcript: texto
                            }]]
                        });
                    }, 1000);
                }

                stop() {}
            }

            window.SpeechRecognition = FakeSpeechRecognition;
            window.webkitSpeechRecognition = FakeSpeechRecognition;
        }, transcript);
    }
}
module.exports = { PronunciationPage };