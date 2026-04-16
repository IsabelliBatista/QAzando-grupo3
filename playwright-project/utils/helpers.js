/**
 * Helpers reutilizáveis nos testes.
 * Adicione aqui funções que não pertencem a nenhuma página específica.
 */

/**
 * Gera um e-mail aleatório para testes de cadastro.
 * @returns {string}
 */
function randomEmail() {
  const timestamp = Date.now();
  return `qa_test_${timestamp}@example.com`;
}

/**
 * Gera uma string aleatória de comprimento N.
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Aguarda N milissegundos (use com moderação — prefira waitFor* do Playwright).
 * @param {number} ms
 */
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formata uma data para o padrão DD/MM/YYYY.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date = new Date()) {
  return date.toLocaleDateString('pt-BR');
}

module.exports = { randomEmail, randomString, sleep, formatDate };
