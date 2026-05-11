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
        await test.step('Acessa a página de entrevista', async () => {
            const interviewPage = new InterviewPage(page);
            await interviewPage.goto();
        });
        await test.step('Verifica se o título "Pronto para começar?" está visível', async () => {
            await expect(page.getByRole('heading', { name: 'Pronto para começar?', level: 3 }).first()).toBeVisible();
        });
        await test.step('Verifica se o botão "Gerar Pergunta de Entrevista" está visível', async () => {
            await expect(page.getByRole('button', { name: 'Gerar Pergunta de Entrevista'})).toBeVisible();
        });
    });

    test('TC002 - Gerar pergunta QA em inglês', async ({  page }) => {
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        await test.step('Confirma a criação de pergunta', async () =>{
            await interviewPage.verificarPerguntaSucesso();
        });
        await test.step('Verifica se o texto da pergunta está em inglês e relacionado a QA', async () => {
            // o teste não pode ser implementado devido a falta de um seletor específico para a pergunta, o texto da pergunta é dinâmico e não possui um padrão fixo, o que dificulta a criação de um seletor confiável para capturar o texto da pergunta.
            const pergunta = await page.locator('p.text-lg.font-medium.leading-relaxed').innerText();
            expect(pergunta).toMatch(/(What|How|Why|When|Where|Who|Describe|Your)/i);
        });
        
    });

    test('TC003 - Responder pergunta', async ({  page }) => {
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        await test.step('Confirma a criação de pergunta', async () =>{
            await interviewPage.verificarPerguntaSucesso();
        });
        await test.step('Preenche o campo de resposta e clica no botão "Enviar Resposta"', async () => {
            await interviewPage.responder('Ok');
            await interviewPage.enviarResposta();
        });
        await test.step('Confirma alerta avaliação da resposta', async () => {
            await interviewPage.respostaAvaliada();
        });
        await test.step('Confirma a avaliação da resposta', async () => {
            await interviewPage.verificarAvaliacaoVisivel();
        });
    });

    test('TC004 - Resposta vazia', async ({ page }) => {
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        await test.step('Confirma a criação de pergunta', async () =>{
            await interviewPage.verificarPerguntaSucesso();
        });
        await test.step('Verifica o estado do botão "Enviar Resposta"', async () => {
            await interviewPage.verificarBotaoEnviarDesabilitado();
        });
        
    });

    test('TC005 - Gerar nova pergunta após resposta', async ({ page }) => {
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        await test.step('Confirma a criação de pergunta', async () =>{
            await interviewPage.verificarPerguntaSucesso();
        });
        await test.step('Preenche o campo de resposta e clica no botão "Enviar Resposta"', async () => {
            await interviewPage.responder('ok');
            await interviewPage.enviarResposta();
        });
        await test.step('Confirma a avaliação da resposta', async () => {
            await interviewPage.respostaAvaliada();
        });
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarNovaPergunta();
        });
    });


})