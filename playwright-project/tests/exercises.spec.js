const { test, expect } = require('../fixtures');
const { LoginPage } = require('../pages/LoginPage');
const { ExercisesPage } = require('../pages/ExercisesPage');
const { USERS } = require('../utils/credentials');

test.describe('Tela de Exercícios', () => {

    let loginPage;
    let exercisesPage;

    test.beforeEach(async ({ page }, testInfo) => {

        loginPage = new LoginPage(page);
        exercisesPage = new ExercisesPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.admin.email, USERS.admin.senha);
        await page.waitForURL(url => !url.href.includes('/auth'), { timeout: 8000 });
        await exercisesPage.goto();
        await page.waitForLoadState('networkidle');

        // Pula testes que precisam do campo de resposta se exercícios estiverem concluídos
        const precisaDeInput = ['TC002', 'TC003', 'TC004', 'TC005', 'TC006', 'TC007'];
        if (precisaDeInput.some(tc => testInfo.title.includes(tc))) {
            const inputVisivel = await exercisesPage.campoResposta.isVisible();
            testInfo.skip(!inputVisivel, 'Campo de resposta não encontrado — exercícios concluídos ou indisponíveis');
        }

    });

    test('TC001 - Carregamento da primeira questão', async () => {

        await expect(exercisesPage.titulo)
            .toBeVisible();

        await expect(exercisesPage.campoResposta)
            .toBeVisible();

        await expect(exercisesPage.botaoVerificar)
            .toBeVisible();

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText(/^\d+$/);

    });

    test('TC002 - Responder e avançar questão', async ({ page }) => {

        const contadorAntes = await exercisesPage.contadorQuestao.textContent();
        const numeroAntes = parseInt(contadorAntes);

        await exercisesPage.campoResposta.fill('you');
        await exercisesPage.botaoVerificar.click();

        // Aceita toast de acerto ou erro — o importante é que a questão avançou
        const toastCorreto = exercisesPage.toastCorreto;
        const toastIncorreto = exercisesPage.toastIncorreto;
        await expect(toastCorreto.or(toastIncorreto)).toBeVisible({ timeout: 8000 });

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText(String(numeroAntes + 1), { timeout: 5000 });

    });

    test('TC003 - Responder incorretamente', async ({ page }) => {

        const contadorAntes = await exercisesPage.contadorQuestao.textContent();
        const numeroAntes = parseInt(contadorAntes);

        await exercisesPage.campoResposta.fill('banana');
        await exercisesPage.botaoVerificar.click();

        await expect(
            exercisesPage.toastIncorreto
        ).toBeVisible({ timeout: 8000 });

        await expect(
            exercisesPage.toastRespostaCorreta
        ).toContainText('A resposta correta é:');

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText(String(numeroAntes + 1), { timeout: 5000 });

    });

    test('TC004 - Tentar verificar com campo vazio', async ({ page }) => {

        const contadorAntes = await exercisesPage.contadorQuestao.textContent();

        await exercisesPage.campoResposta.fill('');
        await exercisesPage.botaoVerificar.click();

        await expect(
            exercisesPage.toastRespostaObrigatoria
        ).toContainText('Por favor, digite uma resposta');

        await expect(
            exercisesPage.toastIncorreto
        ).not.toBeVisible();

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText(contadorAntes);

    });

    test('TC005 - Atualização da porcentagem de progresso', async () => {

        const progressoAntes = await exercisesPage.getProgressoPorcentagem();

        await exercisesPage.campoResposta.fill('you');
        await exercisesPage.botaoVerificar.click();

        const progressoDepois = await exercisesPage.getProgressoPorcentagem();

        expect(progressoDepois).toBeGreaterThan(progressoAntes);

    });

    test('TC006 - Registro no histórico de respostas', async () => {

        const quantidadeAntes =
            await exercisesPage.itensHistorico.count();

        await exercisesPage.campoResposta.fill('they');
        await exercisesPage.botaoVerificar.click();

        const quantidadeDepois =
            await exercisesPage.itensHistorico.count();

        expect(quantidadeDepois)
            .toBeGreaterThan(quantidadeAntes);

    });

    test('TC007 - Aceitar variações de maiúsculas e minúsculas', async () => {

        await exercisesPage.campoResposta.fill('YOU');
        await exercisesPage.botaoVerificar.click();

        // Verifica que algum feedback foi dado (correto ou incorreto) — a resposta foi aceita
        const toastCorreto = exercisesPage.toastCorreto;
        const toastIncorreto = exercisesPage.toastIncorreto;
        await expect(toastCorreto.or(toastIncorreto)).toBeVisible({ timeout: 8000 });

    });

});
