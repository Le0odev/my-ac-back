const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        try {
            const { nome, email, telefone, senha, cnpj, endereco } = req.body;

            // Verificando a existência do email
            const empresaExistente = await Empresa.findOne({ where: { email } });
            if (empresaExistente) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Verificando a existência do CNPJ
            const empresaExistenteCnpj = await Empresa.findOne({ where: { cnpj } });
            if (empresaExistenteCnpj) {
                return res.status(400).json({ message: 'CNPJ já cadastrado' });
            }

            // Criptografando a senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Cadastro da nova empresa
            const novaEmpresa = await Empresa.create({
                nome, 
                email,
                telefone,
                senha: hashedPassword,
                cnpj,
                endereco,
                role: 'empresa', // Aqui você pode ajustar conforme o seu modelo de roles
            });

            res.status(201).json(novaEmpresa);
        } catch (error) {
            console.error('Erro ao registrar a empresa:', error);  // Imprime o erro completo no console
            res.status(500).json({ error: 'Erro ao registrar empresa', details: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const empresa = await Empresa.findOne({ where: { email } });

            if (!empresa) {
                return res.status(400).json({ error: 'Email não encontrado' });
            }

            const senhaValida = await bcrypt.compare(senha, empresa.senha);
            if (!senhaValida) {
                return res.status(400).json({ error: 'Senha incorreta' });
            }

            // Gerando o token JWT
            const token = jwt.sign(
                { id: empresa.id, role: empresa.role || 'empresa' }, // Garante que o role será sempre atribuído
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            res.json({ token });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao autenticar empresa' });
        }
    },
};
