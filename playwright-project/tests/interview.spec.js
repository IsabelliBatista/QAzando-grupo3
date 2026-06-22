//interview.spec.js
const { test, expect} = require('../fixtures');
const { allure }       = require('allure-playwright');
const { InterviewPage } = require ('../pages/InterviewPage');
const { USERS }        = require('../utils/credentials');

test.describe('Entrevista', () => {

    test.beforeEach(async ({ loginPage, page }) => {
        await loginPage.goto();
        await loginPage.login(USERS.admin.email, USERS.admin.senha);
        await page.waitForURL(url => !url.href.includes('/auth'), { timeout: 8000 });
        console.log('Login concluído');
    });

    test('CT-001 | Carregamento da tela', async ({  page }) => {
        const interviewPage = new InterviewPage(page);
        await test.step('Acessa a página de entrevista', async () => { 
            await interviewPage.goto();
        });
        await test.step('Verifica se o título "Pronto para começar?" está visível', async () => {
            await interviewPage.verificarTituloComecar();
        });
        await test.step('Verifica se o botão "Gerar Pergunta de Entrevista" está visível', async () => {
            await interviewPage.verificarBotaoGerarPergunta();
        });
    });

    test('CT-002 | Gerar pergunta QA em inglês', async ({  page }) => {
        const interviewPage = new InterviewPage(page);
        await interviewPage.goto();
        await test.step('Clica no botão Gerar Pergunta', async () => {
            await interviewPage.gerarPergunta();
        });
        await test.step('Confirma a criação de pergunta', async () =>{
            await interviewPage.verificarPerguntaSucesso();
        });
        await test.step('Verifica se o texto da pergunta está em inglês e relacionado a QA', async () => {
            const pergunta = await page.locator('p.text-lg.font-medium.leading-relaxed').innerText();
            expect(pergunta).toMatch(/(What|How|Why|When|Where|Who|Describe|Your)/i);
        });
        
    });

    test('CT-003 | Responder pergunta', async ({  page }) => {
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

    test('CT-004 | Resposta vazia', async ({ page }) => {
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

    test('CT-005 | Gerar nova pergunta após resposta', async ({ page }) => {
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