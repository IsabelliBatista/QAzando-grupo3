//interview.spec.js
const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { InterviewPage } = require ('../pages/InterviewPage');

test.describe('Entrevista', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('custodiodigitalrafael@gmail.com', 'Yveslarock-26');
  });

  test('TC001 - Carregamento da tela', async ({  page }) => {
        // Acessa a página de entrevista
        await test.step('Acessa a página de entrevista', async () => {
            const interviewPage = new InterviewPage(page);
            await interviewPage.goto();
        });
        // Verifica se o título "Simulação de Entrevista" está visível
        await test.step('Verifica se o título "Simulação de Entrevista" está visível', async () => {
            await expect(page.locator('span', { hasText: 'Simulação de Entrevista' })).toBeVisible();
            //await expect(page.getByText('heading', { name: 'Simulação de Entrevista', level: 2 }).first()).toBeVisible();
        });
        // Verifica se o título "Pronto para começar?" está visível
        await test.step('Verifica se o título "Pronto para começar?" está visível', async () => {
            await expect(page.getByRole('heading', { name: 'Pronto para começar?', level: 3 }).first()).toBeVisible();
        });
        // verifica se o botão "Gerar Pergunta de Entrevista" está visível
        await test.step('Verifica se o botão "Gerar Pergunta de Entrevista" está visível', async () => {
            await expect(page.getByRole('button', { name: 'Gerar Pergunta de Entrevista'})).toBeVisible();
        });
    });

    test('TC002 - Gerar pergunta QA em inglês', async ({  page }) => {
        // acessa a tela de entrevista
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        // clica no botão "Gerar Pergunta de Entrevista"
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        // verifica se a mensagem de sucesso "Sua pergunta de entrevista foi criada com sucesso" está visível
        await test.step('Confirma a criação de pergunta', async () =>{
            await expect(page.getByText('Sua pergunta de entrevista foi criada com sucesso').first()).toBeVisible();
        })
        
    });

    test('TC003 - Responder pergunta', async ({  page }) => {
        // acessa a tela de entrevista
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        // clica no botão "Gerar Pergunta de Entrevista"
        await interviewPage.gerarPergunta();
        // verifica se a mensagem de sucesso "Sua pergunta de entrevista foi criada com sucesso" está visível
        await expect(page.getByText('Sua pergunta de entrevista foi criada com sucesso').first()).toBeVisible();
        // preenche o campo de resposta e clica no botão "Enviar Resposta"
        await interviewPage.responder('Ok');
        await interviewPage.botaoEnviarResposta();
        // verifica se a mensagem "Resposta Avaliada!" está visível
        await expect(page.getByText('Resposta Avaliada!')).toBeVisible();
        // verifica se a avaliação da resposta está visível
        await expect(page.getByText('Sua resposta foi avaliada com sucesso!')).toBeVisible();
    });

    test('TC004 - Resposta vazia', async ({ page }) => {
        // acessa a tela de entrevista
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        // clica no botão "Gerar Pergunta de Entrevista"
        await interviewPage.gerarPergunta();
        // verifica se o botão "Enviar Resposta" está desabilitado
        await expect(interviewPage.botaoEnviarResposta()).toBeDisabled();
        
    });

    test('TC005 - Gerar nova pergunta após resposta', async ({ page }) => {
        // acessa a tela de entrevista
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        // clica no botão "Gerar Pergunta de Entrevista"
        await interviewPage.gerarPergunta();
        // verifica se a mensagem de sucesso "Sua pergunta de entrevista foi criada com sucesso" está visível
        await expect(page.getByText('Sua pergunta de entrevista foi criada com sucesso').first()).toBeVisible();
        // preenche o campo de resposta e clica no botão "Enviar Resposta"
        await interviewPage.responder('ok');
        await interviewPage.botaoEnviarResposta();
        // verifica se a mensagem "Resposta Avaliada!" está visível
        await expect(page.getByText('Resposta Avaliada!')).toBeVisible();
        // clica novamente no botão "Gerar Pergunta de Entrevista"
        await interviewPage.gerarPergunta();
    });


})