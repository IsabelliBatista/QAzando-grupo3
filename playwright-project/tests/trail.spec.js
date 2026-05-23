const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { USERS }        = require('../utils/credentials');

test.describe('M01 · Trilha do Inglês', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ trailPage }) => {
    await trailPage.loginAndGoto(USERS.admin.email, USERS.admin.senha);
  });

  // ── F01.01 - Contadores XP / Completadas / Sequência ─────────────────────

  test('CT-M01-001 | Contadores XP Total, Completadas e Sequência devem estar visíveis', async ({ trailPage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'trilha', 'contadores');

    await test.step('Verificar card XP Total visível', async () => {
      await expect(trailPage.xpTotalLabel).toBeVisible();
    });

    await test.step('Verificar card Completadas visível', async () => {
      await expect(trailPage.completadasLabel).toBeVisible();
    });

    await test.step('Verificar card Sequência visível', async () => {
      await expect(trailPage.sequenciaLabel).toBeVisible();
    });

    await test.step('Verificar que os contadores exibem valores numéricos', async () => {
      const xpText = await trailPage.xpTotalLabel.locator('../..').textContent();
      const compText = await trailPage.completadasLabel.locator('../..').textContent();
      const seqText = await trailPage.sequenciaLabel.locator('../..').textContent();
      expect(xpText).toMatch(/\d+/);
      expect(compText).toMatch(/\d+/);
      expect(seqText).toMatch(/\d+/);
    });
  });

  // ── F01.02 - Banner Unidade 1 ─────────────────────────────────────────────

  test('CT-M01-002 | Banner da Unidade 1 deve exibir título, descrição e ícone de estrela', async ({ trailPage }) => {
    allure.label('severity', 'normal');
    allure.tag('trilha', 'unidade1', 'banner');

    await test.step('Verificar título "Unidade 1" visível no banner', async () => {
      await expect(trailPage.unidade1Heading).toBeVisible();
    });

    await test.step('Verificar descrição "Comece do zero" visível', async () => {
      await expect(trailPage.comeceDozeroText).toBeVisible();
    });

    await test.step('Verificar ícone de estrela visível no banner da Unidade 1', async () => {
      await expect(trailPage.bannerStarIcon).toBeVisible();
    });
  });

  // ── F01.03 - Lição disponível ─────────────────────────────────────────────

  test('CT-M01-003 | Lição 1 da Unidade 1 deve estar acessível e exibir indicador de XP', async ({ trailPage }) => {
    allure.label('severity', 'critical');
    allure.tag('trilha', 'unidade1', 'licao');

    const licao1Card = trailPage.getLessonCard('Lição 1');

    await test.step('Verificar que o card da Lição 1 (Unidade 1) está visível', async () => {
      await expect(licao1Card).toBeVisible();
    });

    await test.step('Verificar que o indicador "+25 XP" está presente no card', async () => {
      await expect(licao1Card.getByText('+25 XP')).toBeVisible();
    });

    await test.step('Verificar que a Lição 1 não está bloqueada (sem texto "Bloqueado")', async () => {
      await expect(licao1Card.getByText('Bloqueado')).not.toBeVisible();
    });

    await test.step('Verificar que não há ícone de cadeado na Lição 1', async () => {
      expect(await trailPage.hasLockIcon(licao1Card)).toBe(false);
    });
  });

  test('CT-M01-004 | Clicar em lição disponível deve abrir modal de confirmação', async ({ trailPage }) => {
    allure.label('severity', 'critical');
    allure.tag('trilha', 'unidade1', 'navegacao');

    const nodeButton = trailPage.getLessonNodeButton(0);

    await test.step('Clicar no botão da lição na trilha', async () => {
      await nodeButton.click();
    });

    await test.step('Verificar que o modal de confirmação da lição foi aberto', async () => {
      await expect(trailPage.lessonModalStartBtn).toBeVisible({ timeout: 5000 });
    });

    await test.step('Verificar que o modal exibe a opção de cancelar', async () => {
      await expect(trailPage.lessonModalCancelBtn).toBeVisible();
    });
  });

  // ── F01.04 - Lição bloqueada ──────────────────────────────────────────────

  test('CT-M01-005 | Lição bloqueada deve exibir ícone de cadeado e texto "Bloqueado"', async ({ trailPage }) => {
    allure.label('severity', 'normal');
    allure.tag('trilha', 'unidade3', 'bloqueado');

    const licao1Bloqueada = trailPage.getBlockedCard('Lição 1');

    await test.step('Verificar que o card da lição bloqueada está visível', async () => {
      await expect(licao1Bloqueada).toBeVisible();
    });

    await test.step('Verificar texto "Bloqueado" no card', async () => {
      await expect(licao1Bloqueada.getByText('Bloqueado')).toBeVisible();
    });

    await test.step('Verificar ícone de cadeado no card bloqueado', async () => {
      expect(await trailPage.hasLockIcon(licao1Bloqueada)).toBe(true);
    });
  });

  test('CT-M01-006 | Clicar em lição bloqueada não deve navegar para o conteúdo', async ({ trailPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('trilha', 'unidade3', 'bloqueado', 'negativo');

    const licao1Bloqueada = trailPage.getBlockedCard('Lição 1');

    await test.step('Clicar no card da lição bloqueada', async () => {
      await licao1Bloqueada.click({ force: true });
      await page.waitForTimeout(800);
    });

    await test.step('Verificar que o usuário permanece na Trilha do Inglês', async () => {
      await expect(page).toHaveURL(/duolingo/);
    });
  });

  // ── F01.05 - Prática bloqueada ────────────────────────────────────────────

  test('CT-M01-007 | Item bloqueado na trilha deve exibir cadeado e impedir acesso', async ({ trailPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('trilha', 'unidade3', 'bloqueado', 'negativo');

    // "Áudio" é o item especial bloqueado da Unidade 3 (equivalente a "Prática")
    const audioCard = trailPage.getBlockedCard('Áudio');

    await test.step('Verificar que o item especial bloqueado está visível', async () => {
      await expect(audioCard).toBeVisible();
    });

    await test.step('Verificar texto "Bloqueado" no item', async () => {
      await expect(audioCard.getByText('Bloqueado')).toBeVisible();
    });

    await test.step('Verificar ícone de cadeado no item', async () => {
      expect(await trailPage.hasLockIcon(audioCard)).toBe(true);
    });

    await test.step('Clicar no item bloqueado', async () => {
      await audioCard.click({ force: true });
      await page.waitForTimeout(800);
    });

    await test.step('Verificar que o usuário permanece na Trilha do Inglês', async () => {
      await expect(page).toHaveURL(/duolingo/);
    });
  });

  // ── F01.06 - Ganho de XP ──────────────────────────────────────────────────

  test.skip('CT-M01-008 | XP Total deve incrementar após concluir uma lição', async () => {
    // Requer usuário com XP = 0 (conta nova) e completar uma lição do início.
    // O usuário admin já tem progresso acumulado.
    // Para automatizar: criar conta nova, completar Lição 1 e verificar XP = 25.
  });

  // ── F01.08 - Desbloqueio progressivo ─────────────────────────────────────

  test.skip('CT-M01-009 | Concluir uma lição deve desbloquear a próxima', async () => {
    // Requer usuário com conta nova (sem progresso) para que Lição 2 esteja bloqueada
    // e concluir a Lição 1 para verificar o desbloqueio.
    // O usuário admin já tem as lições da Unidade 1 e 2 completadas.
  });

});