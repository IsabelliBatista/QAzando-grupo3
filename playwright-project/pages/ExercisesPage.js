const { BasePage } = require('./BasePage');

class ExercisesPage extends BasePage {

    constructor(page) {
        super(page);

        this.titulo =
            page.getByText('Complete a Frase');

        this.campoResposta =
            page.getByPlaceholder('Sua resposta aqui...');

        this.botaoVerificar =
            page.getByRole('button', {
                name: /verificar resposta/i
            });

        this.toastAtencao =
            page.getByText('Atenção');

        this.toastRespostaObrigatoria =
            page.getByText('Por favor, digite uma resposta').first();

        this.toastCorreto =
            page.getByText('Correto!', { exact: true });

        this.toastIncorreto =
            page.getByText('Incorreto', { exact: true });

        this.toastRespostaCorreta =
            page.getByText('A resposta correta é:').first();

        this.contadorQuestao =
            page.locator('h3').locator('span').first();

        this.progressoPorcentagem =
            page.locator('div', { hasText: /^\d+%$/ });

        this.itensHistorico =
            page.locator('div').filter({
                has: page.getByText('Você respondeu:')
            });
    }

    async getProgressoPorcentagem() {
        const texto = await this.progressoPorcentagem.textContent();
        return parseInt(texto.replace('%', ''));
    }

    async goto() {
        await this.navigate('/exercises');
    }

}

module.exports = { ExercisesPage };
