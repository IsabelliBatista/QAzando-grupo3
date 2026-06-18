const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { USERS }        = require('../utils/credentials');

test.describe('M03 · Quiz', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ quizPage }) => {
    await quizPage.loginAndGoto(USERS.admin.email, USERS.admin.senha);
  });

  // ── F03.01 - Carregamento da página ───────────────────────────────────────

  test('CT-QZ-001 | Página de quiz deve carregar com heading e subtítulo corretos', async ({ quizPage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'quiz', 'layout');

    await test.step('Verificar heading "Quiz de Inglês" visível', async () => {
      await expect(quizPage.pageHeading).toBeVisible();
    });

    await test.step('Verificar subtítulo "Desafio de Vocabulário" visível', async () => {
      await expect(quizPage.subtitle).toBeVisible();
    });
  });

  // ── F03.02 - Contadores ───────────────────────────────────────────────────

  test('CT-QZ-002 | Cards de Questão, Acertos e Erros devem estar visíveis com valores numéricos', async ({ quizPage }) => {
    allure.label('severity', 'critical');
    allure.tag('quiz', 'contadores', 'layout');

    await test.step('Verificar card "Questão" visível com formato X/30', async () => {
      await expect(quizPage.questaoCard).toBeVisible();
      await expect(quizPage.questaoCard).toContainText('/30');
    });

    await test.step('Verificar card "Acertos" visível com valor numérico', async () => {
      await expect(quizPage.acertosCard).toBeVisible();
      const acertos = await quizPage.getCounterValue('Acertos');
      expect(acertos).toBeGreaterThanOrEqual(0);
    });

    await test.step('Verificar card "Erros" visível com valor numérico', async () => {
      await expect(quizPage.errosCard).toBeVisible();
      const erros = await quizPage.getCounterValue('Erros');
      expect(erros).toBeGreaterThanOrEqual(0);
    });
  });

  // ── F03.03 - Estrutura da questão ─────────────────────────────────────────

  test('CT-QZ-003 | Questão deve exibir palavra a traduzir, exemplo em contexto e 3 botões de resposta', async ({ quizPage }) => {
    allure.label('severity', 'critical');
    allure.tag('quiz', 'questao', 'layout');

    await test.step('Verificar enunciado "Qual a tradução de:" visível', async () => {
      await expect(quizPage.questionPrompt).toBeVisible();
    });

    await test.step('Verificar label "Exemplo em contexto:" visível', async () => {
      await expect(quizPage.exampleLabel).toBeVisible();
    });

    await test.step('Verificar que existem exatamente 3 botões de resposta', async () => {
      await expect(quizPage.questionCard.locator('button')).toHaveCount(3);
    });

    await test.step('Verificar que os botões de resposta têm texto', async () => {
      for (let i = 0; i < 3; i++) {
        const btn = quizPage.getAnswerButton(i);
        await expect(btn).toBeVisible();
        const text = await btn.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });
  });

  // ── F03.04 - Feedback ao responder ───────────────────────────────────────

  test('CT-QZ-004 | Clicar em resposta deve exibir toast de feedback e atualizar o contador correspondente', async ({ quizPage }) => {
    allure.label('severity', 'critical');
    allure.tag('quiz', 'feedback', 'interacao');

    const initialAcertos = await quizPage.getCounterValue('Acertos');
    const initialErros   = await quizPage.getCounterValue('Erros');

    await test.step('Clicar na primeira alternativa de resposta', async () => {
      await quizPage.getAnswerButton(0).click();
    });

    await test.step('Verificar que o toast de feedback aparece', async () => {
      await expect(quizPage.toast).toBeVisible({ timeout: 5000 });
    });

    await test.step('Verificar que o contador correto foi incrementado de acordo com o feedback', async () => {
      const toastText   = await quizPage.toast.textContent();
      const newAcertos  = await quizPage.getCounterValue('Acertos');
      const newErros    = await quizPage.getCounterValue('Erros');

      if (toastText?.includes('Correto')) {
        expect(newAcertos).toBe(initialAcertos + 1);
        expect(newErros).toBe(initialErros);
      } else {
        expect(toastText).toMatch(/Incorreto/);
        expect(newErros).toBe(initialErros + 1);
        expect(newAcertos).toBe(initialAcertos);
      }
    });
  });

  // ── F03.05 - Avanço de questão ────────────────────────────────────────────

  test('CT-QZ-005 | Após responder, o contador de questões deve avançar para a próxima (X+1/30)', async ({ quizPage }) => {
    allure.label('severity', 'normal');
    allure.tag('quiz', 'avanco', 'fluxo');

    const initialQuestao = await quizPage.getCounterValue('Questão');

    await test.step('Responder a questão atual clicando na primeira alternativa', async () => {
      await quizPage.getAnswerButton(0).click();
      await expect(quizPage.toast).toBeVisible({ timeout: 5000 });
    });

    await test.step('Aguardar o toast de feedback fechar e a próxima questão carregar', async () => {
      await quizPage.toast.waitFor({ state: 'hidden', timeout: 8000 });
      await quizPage.page.waitForTimeout(500);
    });

    await test.step('Verificar que o contador avançou para a questão seguinte', async () => {
      const newQuestao = await quizPage.getCounterValue('Questão');
      expect(newQuestao).toBe(initialQuestao + 1);
    });

    await test.step('Verificar que uma nova questão com 3 alternativas está visível', async () => {
      await expect(quizPage.questionPrompt).toBeVisible();
      await expect(quizPage.questionCard.locator('button')).toHaveCount(3);
    });
  });

});
