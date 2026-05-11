//chatbot.spec.js
const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { ChatbotPage } = require ('../pages/ChatbotPage');

test.describe('Falar com Max', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('custodiodigitalrafael@gmail.com', 'Yveslarock-26');
  });

    test('TC001 - Carregamento do Chat com Max', async ({  page }) => { 
        // Dado que o usuário está logado na plataforma
        // Quando acessa a página "Chat com Max" /chatbot
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        
        // Então o sistema deve exibir o cabeçalho "Chat com Max"
        await test.step('Verifica o cabeçalho "Chat com Max"', async () => {
            //await ChatbotPage.cabecalho();
        });
        // E deve exibir os botões "Avatar" e "Nova Conversa"
        await test.step('Verifica os botões "Avatar" e "Nova Conversa"', async () => {
            await expect(ChatbotPage.verificarAvatar);
            await expect(ChatbotPage.novaConversa);
        });
        // E deve exibir campo 'Type your message in English...'
        await test.step('Verifica o campo "Type your message in English..."', async () => {
            await expect(ChatbotPage.campoMensagem);
        });
        // E deve exibir botão "Gravar áudio"
        await test.step('Verifica o botão "Gravar áudio"', async () => {
            await expect(ChatbotPage.gravarAudio).toBeVisible();
        });
    });

    test('TC002 - Enviar mensagem de texto em inglês', async ({  page }) => { 
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        
        // Quando digita mensagem de texto em inglês "Hello"
        // E clica enviar 
        // Então Max responde 
    });

    test('TC003 - Tentar enviar mensagem vazia', async ({  page }) => {
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        // Quando campo 'Type your message in English...' estiver vazio
        // Então o botão enviar deve estar desabilitado
    });

    test('TC004 - Gravar áudio para enviar mensagem', async ({  page }) => {
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        // Quando clica no botão "Gravar áudio"
        // E fala alguma palavra
        // E clica em "Parar gravação"
        // Então Max recebe o áudio 
        // E responde 
    });

    test('TC005 - Negar permissão de microfone', async ({  page }) => {
        // Dado que o usuário está na página "Chat com Max"
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        // Quando clica no botão "Gravar áudio"
        // E nega permissão de acesso ao microfone
        // Então exibe mensagem orientativa sem quebrar a interface
    });

    test('TC006 - Botão "Nova Conversa" limpa o histórico', async ({  page }) => {
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        // Dado que uma conversa foi iniciada
        // Quando clicar no botão "Nova Conversa"
        // Então é apagado as mensagens anteriores
        // E exibe estado vazio novamente
        // E exibe alerta "Nova Conversa"
    });

    test('TC007 - Histórico da conversa exibido em ordem', async ({  page }) => {
        await test.step('Acessa a página "Chat com Max"', async () => {
            const chatbotPage = new ChatbotPage(page);
            await chatbotPage.goto();
        });
        // Dado que uma mensagem foi enviada
        // Quando Max responder
        // Então o chat deve mostrar as frases em ordem de envio
    });

});