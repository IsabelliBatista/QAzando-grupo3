const { test, expect } = require('../fixtures');
const { allure } = require('allure-playwright');
const { WordGeneratorPage } = require('../pages/WordGeneratorPage');
const { LoginPage } = require('../pages/LoginPage');
const { USERS } = require('../utils/credentials');

test.describe('Gerador de Palavras', () => {

    test.beforeEach(async ({ loginPage, page }) => {
        await loginPage.goto();
        await loginPage.login(USERS.admin.email, USERS.admin.senha);
        await page.getByText('Login realizado com sucesso').first().waitFor({ state: 'visible', timeout: 5000 });
    });

    test('CT-001 | Carregamento da tela "Gerador de Palavras"', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.verificarTitulo();
        await wordGeneratorPage.verificarSubtitulo();

    });

    test('CT-002 | Gerar palavras com quantidade e temas válidos', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('15');
        await wordGeneratorPage.digitarTema('comida');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.verificarResultadoAlerta(10000);
        await wordGeneratorPage.alerta(10000);
    });

    test('CT-003 | Gerar palavras com tema em branco', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('15');
        await wordGeneratorPage.digitarTema('');
        await wordGeneratorPage.botaoGerarPalavrasDesabilitado();
    });

    test('CT-004 | Validar limite máximo de 100 palavras', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('101');
        await wordGeneratorPage.digitarTema('viagens');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.alerta();
    });

    test('CT-005 | Digitar "0" ou "número negativo" no campo quantidade', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('0');
        await wordGeneratorPage.digitarTema('viagens');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.alerta();

        await wordGeneratorPage.digitarQtdPalavras('-5');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.alerta();
    });

    test('CT-006 | Lista gerada exibe palavra, exemplo e áudio', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('15');
        await wordGeneratorPage.digitarTema('comida');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.verificarExibicaoCampos(10000);
    });

    test('CT-007 | Digitar valor letras e/ou caracteres especiais no campo de quantidade', async ({ page }) => {
        const wordGeneratorPage = new WordGeneratorPage(page);
        await wordGeneratorPage.goto();
        await wordGeneratorPage.digitarQtdPalavras('teste');
        await wordGeneratorPage.digitarTema('viagens');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.alerta();

        await wordGeneratorPage.digitarQtdPalavras('!@#$/*');
        await wordGeneratorPage.clicarGerarPalavras();
        await wordGeneratorPage.alerta();
    });
});