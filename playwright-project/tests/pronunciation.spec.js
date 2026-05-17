//pronunciation.spec.js
const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { PronunciationPage } = require ('../pages/PronunciationPage');
const { LoginPage } = require('../pages/LoginPage');
const path = require('path');

test.describe('Treinar Pronúncia', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('@gmail.com', '1234');
  });

  test('TC001 - Carregamento da tela "Treinar Pronúncia"', async ({  page }) => {
    // Dado que o usuário esteja logado
    // Quando abrir página Treinar Fala
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
      const pronunciationPage = new PronunciationPage(page);
      await pronunciationPage.goto();
    });
    // Então deve exibir Treinar fala
    await test.step('Verifica o título "Treinar Pronúncia"', async () => {
      await pronunciationPage.verificarTitulo();
    });
    // E exibir subtítulo sobre feedback
    await test.step('Verifica o subtítulo sobre feedback', async () => {
      await pronunciationPage.verificarSubtitulo();
    });
    // E exibir botão Gerar Nova Frase com IA
    await test.step('Verifica o botão "Gerar Nova Frase com IA"', async () => {
      await pronunciationPage.verificarBotaoGerarFrase();
    });
  });

  test('TC002 - Gerar nova frase para praticar', async ({  page }) => {
    // Dado que o usuário esteja na página Treinar Fala
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
      const pronunciationPage = new PronunciationPage(page);
      await pronunciationPage.goto();
    });
    // Quando clicar no botão Gerar Nova Frase com IA
    await test.step('Clica no botão "Gerar Nova Frase com IA"', async () => {
      await pronunciationPage.clicarGerarFrase();
    });
    // Então deve retornar uma frase em inglês
    await test.step('Verifica que uma nova frase em inglês foi gerada', async () => {
      await pronunciationPage.verificarFraseGerada();
    });
  });

  test('TC003 - Gravar pronúncia da frase gerada', async ({  page }) => {
    // Dado que o usuário tenha recebido uma frase em inglês
    await test.step('Acessa a página "Treinar Pronúncia" e gera uma frase', async () => {
      const pronunciationPage = new PronunciationPage(page);
      await pronunciationPage.goto();
      await pronunciationPage.clicarGerarFrase();
    });
    // Quando gravar a pronúncia
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
      await pronunciationPage.clicarFalarAgora();
      //enviar audio com pronúncia 
    });
    // Então deve retornar um alerta com feedback
    
  });

  test('TC004 - Receber feedback de pronúncia correta', async ({  page }) => {
    // Dado que o usuário tenha uma frase em inglês
    // Quando gravar a pronúncia correta
    // Então deve retornar um alerta com feedback positivo
  });

  test('TC005 - Receber feedback de pronúncia incorreta', async ({  page }) => {
    // Dado que o usuário tenha uma frase em inglês
    // Quando gravar a pronúncia incorreta
    // Então deve retornar um alerta com dicas de melhoria
  });

  test('TC006 - Negar permissão de microfone', async ({  page }) => {
    // Dado que o ususário tenha uma frase 
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
        const pronunciationPage = new PronunciationPage(page);
        await pronunciationPage.goto();
        await pronunciationPage.clicarGerarFrase();
    });
    // Quando clicar em Falar Agora e Receber Feedback
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
        await pronunciationPage.clicarFalarAgora();
    });
    // E negar a permissão de microfone
    await test.step('Nega permissão de microfone', async () => {
        await page.addInitScript(() => {
            navigator.mediaDevices.getUserMedia = async () => {
                throw new Error('Permission denied');
            };
        }); 
    });    
    // Então exibe mensagem orientativa sem quebrar a interface
    await test.step('Verifica mensagem orientativa', async () => {
        await pronunciationPage.verificarAlertaErroAudio();
    });
  });

  test('TC007 - Gerar nova frase após praticar', async ({  page }) => {
    // Dado que foi entregue feedback
    // Quando clicar em Gerar outra frase
    // Então deve retornar uma nova frase em inglês 
  });
});