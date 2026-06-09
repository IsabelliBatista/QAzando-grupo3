const { BasePage } = require('./BasePage');

class StoriesPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        super(page);

        this.titulo =
            page.getByText('Gerador de Histórias');

        this.campoTema =
            page.getByPlaceholder(
                'Ex: Um dragão amigável, Aventura na floresta, Viagem espacial...'
            );

        this.botaoGerar =
            page.getByRole('button', {
                name: /gerar história com ia/i
            });

        this.botaoLimpar =
            page.getByRole('button', {
                name: /limpar/i
            });
    }

    async goto() {
        await this.navigate('/stories');
    }

    async preencherTema(tema) {
        await this.campoTema.fill(tema);
    }

    async gerarHistoria(tema) {
        await this.preencherTema(tema);
        await this.botaoGerar.click();
    }
}

module.exports = { StoriesPage };