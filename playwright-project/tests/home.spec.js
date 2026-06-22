const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');

test.describe('Home', () => {

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ── Carregamento ──────────────────────────────────────────────────────────

  test('CT-001 | Deve abrir a página inicial com sucesso', async ({ page }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home');

    await test.step('Verificar URL correta', async () => {
      await expect(page).toHaveURL('https://ingles-qazando.com/');
    });

    await test.step('Verificar título da página', async () => {
      await expect(page).toHaveTitle(/qazando/i);
    });
  });

  test('CT-002 | Página não deve exibir erros críticos no console', async ({ page }) => {
    allure.label('severity', 'normal');
    allure.tag('smoke', 'home');

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await test.step('Aguardar carregamento completo', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verificar ausência de erros de JavaScript', async () => {
      expect(errors).toHaveLength(0);
    });
  });

  // ── Conteúdo visual ───────────────────────────────────────────────────────

  test('CT-003 | Navbar deve estar visível', async ({ homePage }) => {
    allure.label('severity', 'normal');
    allure.tag('home', 'layout');

    await test.step('Verificar visibilidade da barra de navegação', async () => {
      await expect(homePage.navbar).toBeVisible();
    });
  });

  test('CT-004 | Heading principal deve estar visível na hero section', async ({ homePage }) => {
    allure.label('severity', 'normal');
    allure.tag('home', 'conteudo');

    await test.step('Verificar que existe um H1 visível na página', async () => {
      await expect(homePage.mainHeading).toBeVisible();
    });

    await test.step('Verificar que o heading não está vazio', async () => {
      const text = await homePage.mainHeading.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    });
  });

  test('CT-005 | Logo Qazando deve estar visível na navbar', async ({ homePage }) => {
    allure.label('severity', 'normal');
    allure.tag('home', 'layout');

    await test.step('Verificar visibilidade da imagem do logo', async () => {
      await expect(homePage.logoImg).toBeVisible();
    });

    await test.step('Verificar visibilidade do nome da marca "English QA"', async () => {
      await expect(homePage.brandText).toBeVisible();
    });
  });

  // ── Botões e links ────────────────────────────────────────────────────────

  test('CT-006 | Botão "Entrar" deve estar visível na navbar', async ({ homePage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home', 'navegacao');

    await test.step('Verificar visibilidade do botão Entrar', async () => {
      await expect(homePage.loginLink).toBeVisible();
    });
  });

  test('CT-007 | Botão "Começar Grátis" deve estar visível na navbar', async ({ homePage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home', 'cta');

    await test.step('Verificar visibilidade do botão CTA da navbar', async () => {
      await expect(homePage.ctaNavBtn).toBeVisible();
    });
  });

  // ── Redirecionamentos ─────────────────────────────────────────────────────

  test('CT-008 | Botão "Entrar" deve redirecionar para a página de autenticação', async ({ page, homePage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home', 'redirecionamento');

    await test.step('Clicar no botão Entrar', async () => {
      await homePage.loginLink.click();
    });

    await test.step('Verificar redirecionamento para /auth', async () => {
      await expect(page).toHaveURL(/auth/i);
    });
  });

  test('CT-009 | Botão "Começar Grátis" da navbar deve redirecionar para /auth', async ({ page, homePage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home', 'redirecionamento', 'cta');

    await test.step('Clicar no botão Começar Grátis', async () => {
      await homePage.ctaNavBtn.click();
    });

    await test.step('Verificar redirecionamento para /auth', async () => {
      await expect(page).toHaveURL(/auth/i);
    });
  });

  test('CT-010 | Botão "Comece Agora" da hero section deve redirecionar para /auth', async ({ page, homePage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'home', 'redirecionamento', 'cta');

    await test.step('Verificar visibilidade do botão CTA da hero', async () => {
      await expect(homePage.ctaHeroBtn).toBeVisible();
    });

    await test.step('Clicar no botão Comece Agora', async () => {
      await homePage.ctaHeroBtn.click();
    });

    await test.step('Verificar redirecionamento para /auth', async () => {
      await expect(page).toHaveURL(/auth/i);
    });
  });

  // ── Responsividade ────────────────────────────────────────────────────────

  test('CT-011 | Página deve ser exibida corretamente em mobile', async ({ page }) => {
    allure.label('severity', 'normal');
    allure.tag('home', 'responsividade');

    await test.step('Redimensionar para resolução mobile (375x667)', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    await test.step('Verificar que o heading principal ainda está visível', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    await test.step('Verificar ausência de scroll horizontal', async () => {
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });
  });

});
