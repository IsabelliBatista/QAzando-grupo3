const USERS = {
  admin: {
    email: 'admin@teste.com',
    senha: 'Teste@123',
    perfil: 'Admin',
  },
  premiumAtivo: {
    email: 'ativo@teste.com',
    senha: 'Teste@123',
    perfil: 'Premium Ativo',
  },
  usuarioComum: {
    email: 'inativo@teste.com',
    senha: 'Teste@123',
    perfil: 'Usuario Comum',
  },
  semEmailConfirmado: {
    email: 'semconfirmar@teste.com',
    senha: 'Teste@123',
    perfil: 'Sem Email Confirmado',
  },
  invalido: {
    email: 'usuario_inexistente@teste.com',
    senha: 'SenhaErrada@999',
  },
};

module.exports = { USERS };