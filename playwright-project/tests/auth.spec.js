const { test, expect } = require('../fixtures');
const { allure }       = require('allure-playwright');
const { USERS }        = require('../utils/credentials');

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Login', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test('CT-001 | Deve exibir o formulário de login ao acessar /auth', async ({ authPage }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'login');

    await test.step('Verificar título do formulário', async () => {
      await expect(authPage.heading).toHaveText('Bem-vindo de volta!');
    });

    await test.step('Verificar campos de email e senha visíveis', async () => {
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
    });

    await test.step('Verificar botão Entrar visível', async () => {
      await expect(authPage.loginBtn).toBeVisible();
    });
  });

  test('CT-002 | Login com campos vazios não deve submeter o formulário', async ({ authPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('login', 'validacao');

    await test.step('Clicar em Entrar sem preencher campos', async () => {
      await authPage.loginBtn.click();
    });

    await test.step('Permanecer na página /auth', async () => {
      await expect(page).toHaveURL(/auth/);
    });

    await test.step('Formulário de login ainda visível', async () => {
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
    });
  });

  test('CT-003 | Login com email em formato inválido deve bloquear submissão', async ({ authPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('login', 'validacao');

    await test.step('Preencher email sem formato válido e senha', async () => {
      await authPage.emailInput.fill('emailinvalido');
      await authPage.passwordInput.fill('qualquersenha');
    });

    await test.step('Clicar em Entrar', async () => {
      await authPage.loginBtn.click();
    });

    await test.step('Permanecer na página /auth (bloqueio por HTML5)', async () => {
      await expect(page).toHaveURL(/auth/);
    });
  });

  test('CT-004 | Login com credenciais inválidas deve exibir mensagem de erro', async ({ authPage }) => {
    allure.label('severity', 'critical');
    allure.tag('login', 'negativo');

    await test.step('Preencher credenciais inexistentes', async () => {
      await authPage.login(USERS.invalido.email, USERS.invalido.senha);
    });

    await test.step('Verificar toast de erro', async () => {
      await expect(authPage.toast).toBeVisible({ timeout: 8000 });
      expect(await authPage.isDestructiveToast()).toBe(true);
    });

    await test.step('Verificar mensagem de erro correta', async () => {
      await expect(authPage.toastTitle).toHaveText('Erro ao fazer login');
      await expect(authPage.toastMessage).toHaveText('Email ou senha incorretos');
    });
  });

  test('CT-005 | Login com email não confirmado deve exibir mensagem de erro', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('login', 'negativo');

    await test.step('Tentar login com conta sem email confirmado', async () => {
      await authPage.login(USERS.semEmailConfirmado.email, USERS.semEmailConfirmado.senha);
    });

    await test.step('Verificar toast de erro exibido', async () => {
      await expect(authPage.toast).toBeVisible({ timeout: 8000 });
      expect(await authPage.isDestructiveToast()).toBe(true);
    });
  });

  test('CT-006 | Login com credenciais válidas (admin) deve redirecionar para home', async ({ authPage, page }) => {
    allure.label('severity', 'critical');
    allure.tag('smoke', 'login', 'positivo');

    await test.step('Realizar login com usuário admin', async () => {
      await authPage.login(USERS.admin.email, USERS.admin.senha);
    });

    await test.step('Verificar toast de sucesso', async () => {
      await expect(authPage.toast).toBeVisible({ timeout: 8000 });
      expect(await authPage.isDestructiveToast()).toBe(false);
      await expect(authPage.toastTitle).toHaveText('Sucesso!');
      await expect(authPage.toastMessage).toHaveText('Login realizado com sucesso');
    });

    await test.step('Verificar redirecionamento para a home', async () => {
      await expect(page).toHaveURL('https://ingles-qazando.com/');
    });

    await test.step('Verificar conteúdo da home após login', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Ir para Exercícios' })).toBeVisible();
    });
  });

  test('CT-007 | Clicar em "Criar agora" deve exibir o formulário de cadastro', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('login', 'navegacao');

    await test.step('Clicar no link de criação de conta', async () => {
      await authPage.goToRegisterBtn.click();
    });

    await test.step('Verificar que o formulário de cadastro foi exibido', async () => {
      await expect(authPage.heading).toHaveText('Criar Conta');
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Esqueci minha senha
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Esqueci minha senha', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test('CT-008 | Clicar sem email preenchido deve exibir toast de erro', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('esqueci-senha', 'validacao');

    await test.step('Garantir que o campo de email está vazio', async () => {
      await expect(authPage.emailInput).toBeEmpty();
    });

    await test.step('Clicar em Esqueci minha senha', async () => {
      await authPage.forgotPasswordBtn.click();
    });

    await test.step('Verificar toast destrutivo de orientação', async () => {
      await expect(authPage.toast).toBeVisible();
      expect(await authPage.isDestructiveToast()).toBe(true);
      await expect(authPage.toastMessage).toHaveText('Digite seu email primeiro');
    });
  });

  test('CT-009 | Clicar com email preenchido deve exibir confirmação de envio', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('esqueci-senha', 'positivo');

    await test.step('Preencher o campo de email', async () => {
      await authPage.emailInput.fill(USERS.admin.email);
    });

    await test.step('Clicar em Esqueci minha senha', async () => {
      await authPage.forgotPasswordBtn.click();
    });

    await test.step('Verificar toast de confirmação (não é erro)', async () => {
      await expect(authPage.toast).toBeVisible({ timeout: 5000 });
      expect(await authPage.isDestructiveToast()).toBe(false);
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Criar Conta
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Criar Conta', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
    await authPage.goToRegisterBtn.click();
    await expect(authPage.heading).toHaveText('Criar Conta');
  });

  test('CT-010 | Formulário de cadastro deve exibir os campos corretos', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('cadastro', 'smoke');

    await test.step('Verificar campo nome visível', async () => {
      await expect(authPage.nameInput).toBeVisible();
    });

    await test.step('Verificar campo email visível', async () => {
      await expect(authPage.emailInput).toBeVisible();
    });

    await test.step('Verificar campo senha visível', async () => {
      await expect(authPage.passwordInput).toBeVisible();
    });

    await test.step('Verificar botão Criar Conta visível', async () => {
      await expect(authPage.createAccountBtn).toBeVisible();
    });
  });

  test('CT-011 | Criar conta com campos vazios não deve submeter', async ({ authPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('cadastro', 'validacao');

    await test.step('Clicar em Criar Conta sem preencher campos', async () => {
      await authPage.createAccountBtn.click();
    });

    await test.step('Permanecer na página /auth', async () => {
      await expect(page).toHaveURL(/auth/);
    });

    await test.step('Formulário de cadastro ainda visível', async () => {
      await expect(authPage.heading).toHaveText('Criar Conta');
    });
  });

  test('CT-012 | Criar conta com email em formato inválido deve bloquear submissão', async ({ authPage, page }) => {
    allure.label('severity', 'normal');
    allure.tag('cadastro', 'validacao');

    await test.step('Preencher formulário com email sem formato válido', async () => {
      await authPage.fillRegister('Fulano Teste', 'emailinvalido', 'Senha@123');
    });

    await test.step('Tentar submeter', async () => {
      await authPage.createAccountBtn.click();
    });

    await test.step('Permanecer na página /auth (bloqueio por HTML5)', async () => {
      await expect(page).toHaveURL(/auth/);
    });
  });

  test('CT-013 | Criar conta com dados inválidos deve exibir toast de erro', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('cadastro', 'negativo');

    await test.step('Preencher formulário com senha muito curta', async () => {
      await authPage.fillRegister('Fulano Teste', 'fulano@teste.com', '123');
    });

    await test.step('Submeter formulário', async () => {
      await authPage.createAccountBtn.click();
    });

    await test.step('Verificar toast de erro', async () => {
      await expect(authPage.toast).toBeVisible({ timeout: 8000 });
      expect(await authPage.isDestructiveToast()).toBe(true);
    });
  });

  test('CT-014 | "Já tem uma conta? Fazer login" deve voltar ao formulário de login', async ({ authPage }) => {
    allure.label('severity', 'normal');
    allure.tag('cadastro', 'navegacao');

    await test.step('Clicar em Já tenho uma conta', async () => {
      await authPage.backToLoginBtn.click();
    });

    await test.step('Verificar retorno ao formulário de login', async () => {
      await expect(authPage.heading).toHaveText('Bem-vindo de volta!');
    });

    await test.step('Verificar campos de login visíveis', async () => {
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
    });
  });

});