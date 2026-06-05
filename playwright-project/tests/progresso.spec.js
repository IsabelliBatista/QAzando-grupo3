const { test, expect } = require('../fixtures');
const { LoginPage } = require('../pages/LoginPage');
const { ProgressoPage } = require('../pages/ProgressoPage');

test.describe('Tela de Progresso', () => {

  let loginPage;
  let progressoPage;

  test.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    progressoPage = new ProgressoPage(page);

    await loginPage.goto();

    await loginPage.login(
      'usuario@teste.com',
      'Senha@123'
    );

    await page.waitForLoadState('networkidle');

    await progressoPage.goto();

  });

  test('TC001 - Exibição das Estatísticas de Frases', async () => {

    await expect(progressoPage.estatisticasFrasesTitulo)
      .toBeVisible();

    await expect(progressoPage.frasesRespondidas)
      .toBeVisible();

    await expect(progressoPage.frasesCorretas)
      .toBeVisible();

    await expect(progressoPage.frasesIncorretas)
      .toBeVisible();

    await expect(progressoPage.acertoFrases)
      .toBeVisible();

  });

  test('TC002 - Exibição das Estatísticas de Palavras', async () => {

    await expect(progressoPage.estatisticasPalavrasTitulo)
      .toBeVisible();

    await expect(progressoPage.palavrasRespondidas)
      .toBeVisible();

    await expect(progressoPage.palavrasCorretas)
      .toBeVisible();

    await expect(progressoPage.palavrasIncorretas)
      .toBeVisible();

    await expect(progressoPage.acertoPalavras)
      .toBeVisible();

  });

  test('TC005 - Cálculo correto do percentual de acerto', async () => {
    // TODO: substituir por selectors específicos dos cards

    const {
      respondidas,
      corretas,
      percentual
    } = await progressoPage.getProgressoData();

    const percentualEsperado =
      respondidas > 0
        ? Math.floor((corretas / respondidas) * 100)
        : 0;

    expect(percentual).toBe(percentualEsperado);

  });

  test('TC006 - Botão continuar praticando redireciona', async ({ page }) => {

    await expect(progressoPage.botaoContinuarPraticando)
      .toBeVisible();

    await progressoPage.botaoContinuarPraticando.click();

    await expect(page)
      .toHaveURL(/exercises/);

  });

});