//pronunciation.spec.js
const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { PronunciationPage } = require('../pages/PronunciationPage');
const { LoginPage } = require('../pages/LoginPage');
const path = require('path');
const fs = require('fs');
const { USERS }        = require('../utils/credentials');

test.describe('Treinar Pronúncia', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.admin.email, USERS.admin.senha);
  });

  test('CT-001 | Carregamento da tela "Treinar Pronúncia"', async ({  page }) => {
    const pronunciationPage = new PronunciationPage(page);
    // Dado que o usuário esteja logado
    // Quando abrir página Treinar Fala
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
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

  test('CT-002 | Gerar nova frase para praticar', async ({  page }) => {
    const pronunciationPage = new PronunciationPage(page);
    // Dado que o usuário esteja na página Treinar Fala
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
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

  test('CT-003 | Gravar pronúncia da frase gerada', async ({  page }) => {
    
    const pronunciationPage = new PronunciationPage(page);
    await pronunciationPage.mockSpeechRecognition();
    // Dado que o usuário tenha recebido uma frase em inglês
    await test.step('Acessa a página "Treinar Pronúncia" e gera uma frase', async () => {
      await pronunciationPage.goto();
      await pronunciationPage.clicarGerarFrase();
    });
    // Quando gravar a pronúncia
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
      await pronunciationPage.clicarFalarAgora();
      //enviar audio com pronúncia 
    });
    // Então deve retornar um alerta com feedback
    await test.step('Verifica que um alerta de feedback foi exibido', async () => {
      await pronunciationPage.verificarAlertaFeedback();
    });
    
  });

  test('CT-004 | Receber feedback de pronúncia correta', async ({  page }) => {
    
    const pronunciationPage = new PronunciationPage(page);

    // Mock instalado ANTES da navegação, garantindo que exista
    // quando o app real carregar e tentar usar SpeechRecognition.
    await pronunciationPage.mockSpeechRecognition();
    let frase;

    // Dado que o usuário tenha uma frase em inglês
    await test.step('Acessa a página "Treinar Pronúncia" e gera uma frase', async () => {
      await pronunciationPage.goto();
      await pronunciationPage.clicarGerarFrase();
    });

    await test.step('Captura a frase gerada pela IA', async () => {
      frase = await page
        .locator('p.text-3xl.font-bold.text-foreground')
        .innerText();

      expect(frase).toBeTruthy();
      console.log('Frase gerada:', frase);

      // Injeta a frase capturada como transcript simulado de fala correta
      await page.evaluate((texto) => {
        window.__mockTranscript = texto;
      }, frase);
    });

    // Quando gravar a pronúncia correta
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
      await pronunciationPage.clicarFalarAgora();
      //enviar audio com pronúncia 
    });
    // Então deve retornar um alerta com feedback positivo
    await test.step('Verifica que um alerta de feedback foi exibido', async () => {
      await pronunciationPage.verificarAlertaFeedbackPositivo();
    });
  });

  test('CT-005 | Receber feedback de pronúncia incorreta', async ({  page }) => {
   
    const pronunciationPage = new PronunciationPage(page);
    await pronunciationPage.mockSpeechRecognition();
    // Dado que o usuário tenha uma frase em inglês
    await test.step('Acessa a página "Treinar Pronúncia" e gera uma frase', async () => {
      await pronunciationPage.goto();
      await pronunciationPage.clicarGerarFrase();
    });
    // Quando gravar a pronúncia incorreta
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
      await pronunciationPage.clicarFalarAgora();
      //enviar audio com pronúncia 
    });
    // Então deve retornar um alerta com dicas de melhoria
    await test.step('Verifica que um alerta de feedback foi exibido', async () => {
      await pronunciationPage.verificarAlertaFeedback();
    });
  });

  test('CT-006 | Negar permissão de microfone', async ({  page }) => {
    
    const pronunciationPage = new PronunciationPage(page);
    await pronunciationPage.mockSpeechRecognition({ error: 'not-allowed' });
    page.on('console', msg => {
      console.log(msg.text());
    });
    // Dado que o ususário tenha uma frase 
    await test.step('Acessa a página "Treinar Pronúncia"', async () => {
        await pronunciationPage.goto();
        await pronunciationPage.clicarGerarFrase();
    });
    // Quando clicar em Falar Agora e Receber Feedback
    await test.step('Clica no botão "Falar Agora" e "Receber Feedback"', async () => {
        await pronunciationPage.clicarFalarAgora();
    });
    // E negar a permissão de microfone
    await test.step('Nega permissão de microfone', async () => {
       //negar permissão não é possível por meio do playwright 
    });    
    // Então exibe mensagem orientativa sem quebrar a interface
    await test.step('Verifica mensagem orientativa', async () => {
        await pronunciationPage.verificarAlertaErroAudio();
    });
  });

  test('CT-007 | Gerar nova frase após praticar', async ({  page }) => {
    const pronunciationPage = new PronunciationPage(page);
    await pronunciationPage.mockSpeechRecognition();
    // Dado que o usuário tenha praticado a pronúncia de uma frase
    await test.step('Acessa a página "Treinar Pronúncia" e pratica uma frase', async () => {
        await pronunciationPage.goto();
        await pronunciationPage.clicarGerarFrase();
        await pronunciationPage.clicarFalarAgora();
        //enviar audio com pronúncia 
    });
    // E foi entregue feedback
    await test.step('Verifica que um alerta de feedback foi exibido', async () => {
        await pronunciationPage.verificarAlertaFeedback();
    });
    // Quando clicar em Gerar outra frase
    await test.step('Clica no botão "Gerar Nova Frase com IA"', async () => {
        await pronunciationPage.clicarOutraFrase();
    });
    // Então deve retornar uma nova frase em inglês 
    await test.step('Verifica que uma nova frase em inglês foi gerada', async () => {
        await pronunciationPage.verificarFraseGerada();
    });
  
  });
});