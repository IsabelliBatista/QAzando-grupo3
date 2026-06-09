const { BasePage } = require('./BasePage');

class ProgressoPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        super(page);

        // FRASES
        this.estatisticasFrasesTitulo =
            page.getByText('Estatísticas de Frases');

        this.frasesRespondidas =
            page.getByText('Frases Respondidas');

        this.frasesCorretas =
            page.getByText('Frases Corretas');

        this.frasesIncorretas =
            page.getByText('Frases Incorretas');

        this.acertoFrases =
            page.getByText('Acerto em Frases (%)');

        // PALAVRAS
        this.estatisticasPalavrasTitulo =
            page.getByText('Estatísticas de Palavras');

        this.palavrasRespondidas =
            page.getByText('Palavras Respondidas');

        this.palavrasCorretas =
            page.getByText('Palavras Corretas');

        this.palavrasIncorretas =
            page.getByText('Palavras Incorretas');

        this.acertoPalavras =
            page.getByText('Acerto em Palavras (%)');


        // BOTÃO
        this.botaoContinuarPraticando =
            page.getByRole('button', {
                name: /continuar praticando/i
            });

        this.valorFrasesRespondidas =
            page.locator('text=Frases Respondidas')
                .locator('..')
                .locator('p')
                .first();

        this.valorFrasesCorretas =
            page.locator('text=Frases Corretas')
                .locator('..')
                .locator('p')
                .first();

        this.valorFrasesIncorretas =
            page.locator('text=Frases Incorretas')
                .locator('..')
                .locator('p')
                .first();

        this.valorAcertoFrases =
            page.locator('text=Acerto em Frases (%)')
                .locator('..')
                .locator('p')
                .first();

    }

    async goto() {
        await this.navigate('/progress');
    }

    async getProgressoData() {

        const valores = await this.page
            .locator('p')
            .allTextContents();

        console.log('Valores encontrados:', valores);

        return {
            respondidas: Number(valores[2] || 0),
            corretas: Number(valores[4] || 0),
            incorretas: Number(valores[6] || 0),
            percentual: Number(
                (valores[8] || '0%').replace('%', '')
            )
        };
    }

    
}

module.exports = { ProgressoPage };