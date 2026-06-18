const { test, expect } = require('../fixtures');
const { LoginPage } = require('../pages/LoginPage');
const { StoriesPage } = require('../pages/StoriesPage');

test.describe('Tela de Histórias', () => {

    let loginPage;
    let storiesPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        storiesPage = new StoriesPage(page);

        await loginPage.goto();

        await loginPage.login(
            'usuario@teste.com',
            'Senha@123'
        );

        await page.waitForLoadState('networkidle');

        await storiesPage.goto();

    });

    test('TC001 - Carregamento da tela Gerador de Histórias', async () => {

        await expect(storiesPage.titulo)
            .toBeVisible();

        await expect(storiesPage.campoTema)
            .toBeVisible();

        await expect(storiesPage.botaoGerar)
            .toBeVisible();

    });

    test('TC002 - Gerar história com tema preenchido', async ({ page }) => {

        await storiesPage.preencherTema(
            'Dois amigos explorando uma floresta encantada'
        );

        await storiesPage.botaoGerar.click();

        await page.waitForTimeout(5000);

    });

    test('TC003 - Tentar gerar história com campo em branco', async () => {

        await expect(
            storiesPage.botaoGerar
        ).toBeDisabled();

    });

    test('TC004 - Gerar nova história após a anterior', async ({ page }) => {

        await storiesPage.gerarHistoria(
            'Um unicórnio especialista em Claude'
        );

        await page.waitForTimeout(5000);

        await storiesPage.campoTema.clear();

        await storiesPage.preencherTema(
            'Uma viagem espacial para encontrar um planeta habitável'
        );

        await storiesPage.botaoGerar.click();

        await page.waitForTimeout(5000);

    });

    test('TC005 - Botão habilitado após preencher tema', async () => {

        await expect(
            storiesPage.botaoGerar
        ).toBeDisabled();

        await storiesPage.preencherTema(
            'Uma aventura na floresta'
        );

        await expect(
            storiesPage.botaoGerar
        ).toBeEnabled();

    });

    test('TC006 - Limpar história gerada', async () => {

        await storiesPage.preencherTema(
            'Um dragão amigável'
        );

        await storiesPage.botaoGerar.click();

        await expect(
            storiesPage.botaoLimpar
        ).toBeVisible({ timeout: 30000 });

        await storiesPage.botaoLimpar.click();

        await expect(
            storiesPage.botaoLimpar
        ).not.toBeVisible();

    });

    test('TC007 - Exibir história em português e inglês', async ({ page }) => {

        await storiesPage.preencherTema(
            'Um dragão amigável'
        );

        await storiesPage.botaoGerar.click();

        await expect(
            page.getByRole('heading', {
                name: /english|inglês/i
            })
        ).toBeVisible({ timeout: 30000 });

        await expect(
            page.getByRole('heading', {
                name: /versão em português/i
            })
        ).toBeVisible({ timeout: 30000 });

    });

});  