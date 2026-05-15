//chatbot.spec.js
const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { chromium } = require('playwright');
const { ChatbotPage } = require ('../pages/ChatbotPage');
const { LoginPage } = require('../pages/LoginPage');
const path = require('path');

test.describe('Falar com Max', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('custodiodigitalrafael@gmail.com', 'Yveslarock-26');
  });

    test('TC001 - Carregamento do Chat com Max', async ({  page }) => { 
        const chatbotPage = new ChatbotPage(page);
        // Dado que o usuário está logado na plataforma
        // Quando acessa a página "Chat com Max" /chatbot
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        
        // Então o sistema deve exibir o cabeçalho "Chat com Max"
        await test.step('Verifica o cabeçalho "Chat com Max"', async () => {
            await chatbotPage.cabecalho();
        });
        // E deve exibir os botões "Avatar" e "Nova Conversa"
        await test.step('Verifica os botões "Avatar" e "Nova Conversa"', async () => {
            await chatbotPage.verificarAvatar();
            await chatbotPage.verificarNovaConversa();
        });
        // E deve exibir campo 'Type your message in English...'
        await test.step('Verifica o campo "Type your message in English..."', async () => {
            await chatbotPage.verificarMensagem();
        });
        // E deve exibir botão "Gravar áudio"
        await test.step('Verifica o botão "Gravar áudio"', async () => {
            await chatbotPage.verificarAudio();
        });
    });

    test('TC002 - Enviar mensagem de texto em inglês', async ({  page }) => { 
        const chatbotPage = new ChatbotPage(page);
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Quando digita mensagem de texto em inglês "Hello"
        await test.step('Digita mensagem de texto em inglês "Hello"', async () => {
            await chatbotPage.mensagem('Hello');
        });
        // E clica enviar 
        await test.step('Clica no botão enviar', async () => {
            await chatbotPage.enviarMensagem();
        });
        // Então Max responde 
        await test.step('Verifica resposta do Max', async () => {
            // Aqui você pode adicionar uma verificação para a resposta do Max, por exemplo:
            await chatbotPage.respostaMax();
        });
    });

    test('TC003 - Tentar enviar mensagem vazia', async ({  page }) => {
        const chatbotPage = new ChatbotPage(page);
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Quando campo 'Type your message in English...' estiver vazio
        await test.step('Verifica campo de mensagem vazio', async () => {
            await chatbotPage.mensagem(''); // Preenche o campo com uma string vazia
        });
        // Então o botão enviar deve estar desabilitado
        await test.step('Verifica botão enviar desabilitado', async () => {
            await expect(chatbotPage.botaoEnviarMensagem).toBeDisabled();
        });
    });

    test('TC004 - Gravar áudio para enviar mensagem', async ({  page }) => {
        const chatbotPage = new ChatbotPage(page);

        // caminho do WAV
        const audioFile = path.resolve(
            __dirname,
            '..',
            'fixtures',
            'helloMax.wav'
        );
        // browser com microfone fake
        const browser = await chromium.launch({
            headless: false,
            args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            `--use-file-for-fake-audio-capture=${audioFile}`
            ]
        });

        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Quando clica no botão "Gravar áudio"
        await test.step('Clica no botão "Gravar áudio"', async () => {
            await chatbotPage.gravarAudio();
        });
        
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Quando clica no botão "Gravar áudio"
        await test.step('Clica no botão "Gravar áudio"', async () => {
            await chatbotPage.gravarAudio();
        });
        // E concede permissão de acesso ao microfone (já concedida ao contexto)
        await test.step('Concede permissão de acesso ao microfone', async () => {
            // permissão já aplicada ao contextoAudio
        });
        // E fala alguma palavra (áudio será reproduzido a partir do arquivo configurado)
        await test.step('Fala alguma palavra', async () => {
            //await pageAudio.waitForTimeout(3000);
            await page.waitForTimeout(3000);
        });
        // E clica em "Parar gravação"
        await test.step('Clica em "Parar gravação"', async () => {
            await chatbotPage.pararGravarAudio();
        });
        // Então Max recebe o áudio e responde
        await test.step('Verifica resposta do Max', async () => {
            await chatbotPage.respostaMaxAudio();
        });

        await browserForAudio.close();
    });


    test('TC005 - Negar permissão de microfone', async ({  page }) => {
        const chatbotPage = new ChatbotPage(page);
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Quando clica no botão "Gravar áudio"
        await test.step('Clica no botão "Gravar áudio"', async () => {
            await chatbotPage.gravarAudio();
        });
        // E nega permissão de acesso ao microfone
        await test.step('Nega permissão de acesso ao microfone', async () => {
            // negar permissão não é possível por meio do playwrigh
        });
        // Então exibe mensagem orientativa sem quebrar a interface
        await test.step('Verifica mensagem orientativa', async () => {
            await chatbotPage.respostaMaxAudio();
        });
    });

    test('TC006 - Botão "Nova Conversa" limpa o histórico', async ({  page }) => {
        const chatbotPage = new ChatbotPage(page);

        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Dado que uma conversa foi iniciada
        await test.step('Inicia uma conversa', async () => {
            await chatbotPage.mensagem('Hello');
            await chatbotPage.enviarMensagem();
            await chatbotPage.respostaMax();
        });
        // Quando clicar no botão "Nova Conversa"
        await test.step('Clica no botão "Nova Conversa"', async () => {
            await chatbotPage.clicarNovaConversa();
        });
        // Então é apagado as mensagens anteriores
        await test.step('Verifica histórico apagado', async () => {
            await chatbotPage.verificarMensagem();
        });
        // E exibe alerta "Nova Conversa"
        await test.step('Verifica alerta "Nova Conversa"', async () => {
            await chatbotPage.verificarAlertaNovaConversa();
        });
    });

    test('TC007 - Histórico da conversa exibido em ordem', async ({  page }) => {
        const chatbotPage = new ChatbotPage(page);
        await test.step('Acessa a página "Chat com Max"', async () => {
            await chatbotPage.goto();
        });
        // Dado que uma mensagem foi enviada
        // Quando Max responder
        // Então o chat deve mostrar as frases em ordem de envio
    });

});