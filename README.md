# QAzando - Grupo 3 | Automação com Playwright

Projeto de automação de testes end-to-end utilizando **Playwright**, com arquitetura **Page Object Model (POM)** e relatórios visuais com **Allure Report**.

---

## Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

### 1. Node.js (versão 18 ou superior)

O Node.js já vem com o **npm** (gerenciador de pacotes).

- Acesse: https://nodejs.org
- Baixe a versão **LTS** (recomendada)
- Siga o instalador normalmente

Para verificar se instalou corretamente, abra o terminal e execute:

```bash
node --version
npm --version
```

### 2. Git

- Acesse: https://git-scm.com/downloads
- Baixe e instale para o seu sistema operacional

Para verificar:

```bash
git --version
```

---

## Como clonar e configurar o projeto

### Passo 1 — Clonar o repositório

Abra o terminal na pasta onde você quer salvar o projeto e execute:

```bash
git clone <URL_DO_REPOSITORIO>
```

> Substitua `<URL_DO_REPOSITORIO>` pela URL real do projeto no GitHub.

### Passo 2 — Entrar na pasta do projeto de automação

```bash
cd QAzando-grupo3/playwright-project
```

### Passo 3 — Instalar as dependências

```bash
npm install
```

Isso vai baixar todas as bibliotecas necessárias (Playwright, Allure, etc.).

### Passo 4 — Instalar os navegadores do Playwright

```bash
npx playwright install
```

Isso vai baixar os navegadores que o Playwright usa para rodar os testes (Chromium, Firefox, WebKit).

---

## Como rodar os testes

Todos os comandos abaixo devem ser executados dentro da pasta `playwright-project`.

### Rodar todos os testes (modo headless — sem abrir o navegador)

```bash
npm test
```

### Rodar os testes com o navegador visível

```bash
npm run test:headed
```

### Rodar em modo debug (abre o Playwright Inspector)

```bash
npm run test:debug
```

### Rodar com a interface visual do Playwright (recomendado para iniciantes)

```bash
npm run test:ui
```

> O Playwright UI Mode permite ver os testes rodando passo a passo com capturas de tela — ótimo para aprender e depurar!

---

## Como visualizar os relatórios

### Relatório Allure (mais detalhado)

Após rodar os testes, execute:

```bash
npm run report
```

Isso vai gerar o relatório e abrir automaticamente no navegador.

Ou, se preferir separado:

```bash
npm run allure:generate   # Gera o relatório HTML
npm run allure:open       # Abre no navegador
npm run allure:serve      # Serve resultados em tempo real
```

### Relatório HTML do Playwright

Após rodar os testes, execute:

```bash
npx playwright show-report
```

---

## Estrutura do projeto

```
playwright-project/
├── tests/               # Arquivos de teste (.spec.js)
├── pages/               # Page Objects (representam as páginas da aplicação)
│   ├── BasePage.js      # Métodos comuns a todas as páginas
│   └── LoginPage.js     # Métodos específicos da página de login
├── fixtures/
│   └── index.js         # Configuração de fixtures (injeção dos Page Objects)
├── utils/
│   └── helpers.js       # Funções utilitárias reutilizáveis
├── allure-results/      # Dados gerados pelos testes (não editar)
├── allure-report/       # Relatório HTML do Allure (não editar)
├── test-results/        # Screenshots e vídeos das falhas (não editar)
└── playwright.config.js # Configurações do Playwright
```

---

## Padrão utilizado: Page Object Model (POM)

O projeto segue o padrão **POM**, onde cada página da aplicação tem uma classe correspondente em `pages/`. Isso mantém os testes limpos: a lógica de interação fica na classe, os testes focam só no comportamento esperado.

### Como adicionar um novo Page Object

**1. Crie o arquivo em `pages/MinhaPagina.js` herdando de `BasePage`:**

```js
const { BasePage } = require('./BasePage');

class MinhaPagina extends BasePage {
  constructor(page) {
    super(page);
    this.meuBotao = page.getByRole('button', { name: 'Confirmar' });
  }

  async clicarConfirmar() {
    await this.meuBotao.click();
  }
}

module.exports = { MinhaPagina };
```

**2. Registre a fixture em `fixtures/index.js`:**

```js
const { MinhaPagina } = require('../pages/MinhaPagina');

const test = base.extend({
  minhaPagina: async ({ page }, use) => {
    await use(new MinhaPagina(page));
  },
});
```

**3. Use no teste:**

```js
test('meu cenário', async ({ minhaPagina }) => {
  await minhaPagina.clicarConfirmar();
});
```

---

## Configurações importantes

As configurações do projeto ficam em `playwright.config.js`. Algumas das principais:

| Configuração | Valor padrão | Descrição |
|---|---|---|
| `baseURL` | `https://example.com` | URL base da aplicação testada |
| `fullyParallel` | `true` | Testes rodam em paralelo |
| `retries` | `2` em CI, `0` local | Quantas vezes retentar um teste que falhou |
| `timeout` | `30s` por teste | Tempo máximo para cada teste |

Para alterar a URL base sem mexer no arquivo de config, use a variável de ambiente:

```bash
BASE_URL=https://minha-aplicacao.com npm test
```

---

## Boas práticas adotadas

- Seletores centralizados nos Page Objects (fácil manutenção)
- `BasePage` evita repetição de código comum
- Fixtures injetam Page Objects automaticamente nos testes
- Allure com steps descritivos (`test.step`) e metadados (severity, tags)
- Screenshots e vídeos automáticos em caso de falha

---

## Dúvidas frequentes

**Os testes falharam logo de cara, o que faço?**
1. Verifique se está dentro da pasta `playwright-project`
2. Rode `npm install` novamente
3. Rode `npx playwright install` para garantir que os browsers estão instalados
4. Verifique se a `baseURL` no `playwright.config.js` aponta para a aplicação correta

**Como rodo apenas um teste específico?**

```bash
npx playwright test tests/login.spec.js
```

**Como rodo apenas um caso de teste pelo nome?**

```bash
npx playwright test -g "Login com credenciais válidas"
```
