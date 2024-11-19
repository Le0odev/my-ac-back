const Prestador = require('../models/Prestador');
const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');

module.exports = {
  async register(req, res) {
    try {
      const { nome, email, senha, empresaId } = req.body;

      // Verificando se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(400).json({ message: 'Empresa não encontrada' });
      }

      // Verificando se o email do prestador já está cadastrado
      const prestadorExistente = await Prestador.findOne({ where: { email } });
      if (prestadorExistente) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criptografando a senha do prestador
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Criando o prestador e associando à empresa
      const novoPrestador = await Prestador.create({
        nome,
        email,
        senha: hashedPassword,
        empresaId,  // Associando o prestador à empresa
      });

      res.status(201).json({ message: 'Prestador criado com sucesso', prestador: novoPrestador });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar prestador' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscando o prestador pelo email
      const prestador = await Prestador.findOne({ where: { email } });
      if (!prestador) {
        return res.status(400).json({ error: 'Prestador não encontrado' });
      }

      // Verificando a senha
      const senhaValida = await bcrypt.compare(senha, prestador.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: 'Senha incorreta' });
      }

      // Gerando o token JWT (considerando que a role do prestador é 'prestador')
      const token = jwt.sign(
        { id: prestador.id, role: prestador.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar prestador' });
    }
  },
};
