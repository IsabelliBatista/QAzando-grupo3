const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { USERS }        = require('../utils/credentials');

test.describe('M02 · Ranking', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ rankingPage }) => {
    await rankingPage.loginAndGoto(USERS.admin.email, USERS.admin.senha);
  });

  // ── F02.01 - Estado vazio ─────────────────────────────────────────────────

  test('CT-RK-001 | Ranking vazio deve exibir ícone de troféu e mensagens de estado vazio', async ({ rankingPage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'ranking', 'estado-vazio');

    await test.step('Verificar que o heading principal está visível', async () => {
      await expect(rankingPage.pageHeading).toBeVisible();
    });

    await test.step('Verificar ícone de troféu no estado vazio', async () => {
      await expect(rankingPage.emptyStateTrophyIcon).toBeVisible();
    });

    await test.step('Verificar mensagem "Nenhum usuário no ranking ainda"', async () => {
      await expect(rankingPage.emptyStateMsg).toBeVisible();
    });

    await test.step('Verificar sub-mensagem "Seja o primeiro a responder exercícios!"', async () => {
      await expect(rankingPage.emptyStateSub).toBeVisible();
    });
  });

  // ── F02.02 - Cards de métricas ────────────────────────────────────────────

  test('CT-RK-002 | Cards de métricas devem exibir "0", "N/A" e "0%" quando ranking vazio', async ({ rankingPage }) => {
    allure.label('severity', 'critical');
    allure.tag('ranking', 'metricas', 'estado-vazio');

    await test.step('Verificar card "Total de Competidores" exibe 0', async () => {
      await expect(rankingPage.totalCompetidoresCard).toBeVisible();
      await expect(rankingPage.totalCompetidoresCard).toContainText('0');
    });

    await test.step('Verificar card "Líder Atual" exibe N/A', async () => {
      await expect(rankingPage.liderAtualCard).toBeVisible();
      await expect(rankingPage.liderAtualCard).toContainText('N/A');
    });

    await test.step('Verificar card "Maior Precisão" exibe 0%', async () => {
      await expect(rankingPage.maiorPrecisaoCard).toBeVisible();
      await expect(rankingPage.maiorPrecisaoCard).toContainText('0%');
    });
  });

  // ── F02.03 - Regra de mínimo 5 respostas ─────────────────────────────────

  test('CT-RK-003 | Regra de 5 respostas deve estar visível e usuário com 0 respostas não deve aparecer na classificação', async ({ rankingPage }) => {
    allure.label('severity', 'critical');
    allure.tag('ranking', 'regra-negocio', 'restricao');

    await test.step('Verificar texto da regra de mínimo 5 perguntas', async () => {
      await expect(rankingPage.ruleText).toBeVisible();
    });

    await test.step('Verificar seção "Classificação Geral" visível', async () => {
      await expect(rankingPage.classificacaoHeading).toBeVisible();
    });

    await test.step('Verificar que a Classificação Geral exibe estado vazio (usuário com 0 respostas não aparece)', async () => {
      await expect(rankingPage.emptyStateMsg).toBeVisible();
    });
  });

  // ── F02.04 - Aparece no ranking após 5+ respostas ─────────────────────────

  test.skip('CT-RK-004 | Usuário com 5+ respostas deve aparecer na Classificação Geral com nome e pontuação', async () => {
    // Requer usuário que tenha respondido 5 ou mais questões nos exercícios.
    // Fluxo: responder 5 questões → ir ao ranking → verificar que o usuário aparece na lista.
    // Não automatizado pois depende de pré-condição de dados que varia por execução.
  });

  // ── F02.05 - Ordenação por precisão ──────────────────────────────────────

  test.skip('CT-RK-005 | Usuários devem aparecer ordenados por maior precisão (%) de forma decrescente', async () => {
    // Requer pelo menos 2 usuários com 5+ respostas e precisões distintas.
    // Fluxo: verificar a ordem das linhas na Classificação Geral e comparar os valores de precisão.
  });

  // ── F02.06 - Atualização em tempo real ───────────────────────────────────

  test.skip('CT-RK-006 | Após nova atividade, posição e métricas do usuário devem atualizar no ranking', async () => {
    // Requer controle do estado antes e depois de responder exercícios.
    // Fluxo: anotar posição atual → responder exercício → verificar que métricas e posição atualizaram.
  });

});
