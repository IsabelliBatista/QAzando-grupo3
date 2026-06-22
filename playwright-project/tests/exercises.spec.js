const { test, expect } = require('../fixtures');
const { LoginPage } = require('../pages/LoginPage');
const { ExercisesPage } = require('../pages/ExercisesPage');

test.describe('Tela de Exercícios', () => {

    let loginPage;
    let exercisesPage;

    test.beforeEach(async ({ page }) => {

        loginPage = new LoginPage(page);
        exercisesPage = new ExercisesPage(page);

        await loginPage.goto();

        await loginPage.login(
            'usuario@teste.com',
            'Senha@123'
        );

        await page.waitForLoadState('networkidle');

        await exercisesPage.goto();

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
        ).toHaveText('1');

    });

    test('TC002 - Responder corretamente', async ({ page }) => {

        await exercisesPage.campoResposta.fill('you');

        await exercisesPage.botaoVerificar.click();

        await expect(
            exercisesPage.toastCorreto
        ).toBeVisible();

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText('2');

    });

    test('TC003 - Responder incorretamente', async ({ page }) => {

        await exercisesPage.campoResposta.fill('banana');

        await exercisesPage.botaoVerificar.click();

        await expect(
            exercisesPage.toastIncorreto
        ).toBeVisible();

        await expect(
            exercisesPage.toastRespostaCorreta
        ).toContainText('A resposta correta é:');

        await expect(
            exercisesPage.contadorQuestao
        ).toHaveText('3');

    });

    test('TC004 - Tentar verificar com campo vazio', async ({ page }) => {

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
        ).toHaveText('3');
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
            .toBeGreaterThan(quantidadeAntes + 1);

    });

    test('TC007 - Aceitar variações de maiúsculas e minúsculas', async () => {

        await exercisesPage.campoResposta.fill('YOU');

        await exercisesPage.botaoVerificar.click();

        await expect(
            exercisesPage.toastCorreto
        ).toBeVisible();

    });

}); 