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
        this.botaoOutraFrase = page.getByRole('button', { name: 'Gerar Outra Frase' });
        this.campoAlertaErroAudio = page.locator('div.text-sm.font-semibold',{ hasText: 'Erro no reconhecimento' });
        this.alertaFraseGerada = page.locator('div.text-sm.font-semibold',{ hasText: 'Nova frase gerada!' }).first();
        this.alertaFeedback = page.locator('div.text-sm.font-semibold',{ hasText: 'Continue tentando! 💪' });
        this.alertaFeedbackPositivo = page.locator('div.text-sm.font-semibold',{ hasText: 'Excelente! 🎉' });
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

     async verificarAlertaFeedbackPositivo() {
        await expect(this.alertaFeedbackPositivo).toBeVisible({ timeout: 10000 });
    }

    async clicarGerarFrase() {
        await this.botaoGerarFrase.waitFor({ state: 'visible', timeout: 15000 });
        await this.botaoGerarFrase.click();
    }

    async clicarFalarAgora() {
        await this.botaoFalarAgora.click();
    }

    async clicarOutraFrase() {
        await this.botaoOutraFrase.click();
    }

    async mockSpeechRecognition({ delayMs = 300, error = null } = {}) {
        await this.page.addInitScript(({ delayMs, error }) => {
            class FakeSpeechRecognition {
                constructor() {
                    this.lang = 'en-US';
                    this.continuous = false;
                    this.interimResults = false;
                }

               start() {
                    console.log('[MOCK] start() chamado');
                    this.onstart?.();
                    setTimeout(() => {
                        if (error) {
                        console.log('[MOCK] disparando onerror:', error);
                        this.onerror?.({ error });
                        return;
                        }

                        const resultado = [{ transcript: window.__mockTranscript ?? 'default' }];
                        resultado.isFinal = true; // 👈 adiciona a propriedade que a API real tem

                        console.log('[MOCK] disparando onresult, handler existe?', typeof this.onresult);
                        this.onresult?.({
                        results: [resultado],
                        resultIndex: 0, // 👈 alguns apps leem por aqui também
                        });
                        this.onend?.();
                    }, delayMs);
                    }

                stop() {
                    this.onend?.();
                }
            }

            window.SpeechRecognition = FakeSpeechRecognition;
            window.webkitSpeechRecognition = FakeSpeechRecognition;
        }, { delayMs, error });
        
    }

}
module.exports = { PronunciationPage };