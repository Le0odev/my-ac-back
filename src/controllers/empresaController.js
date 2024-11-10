const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        try {
            const { nome, email, telefone, senha, cnpj, endereco } = req.body;

            // verificando existencia
            const empresaExistente = await Empresa.findOne({where: { email }});
            if (empresaExistente) {
                return res.status(400).json({error: 'Email já cadastrado'});
            }

            // senha criptografada
            const hashedPassword = await bcrypt.hash(senha, 10);

            // cadastro de nova empresa
            const novaEmpresa = await Empresa.create({
                nome, 
                email,
                telefone,
                senha: hashedPassword,
                cnpj,
                endereco,
            });
            res.status(201).json(novaEmpresa);
        } catch (error) {
            res.status(500).json({error: 'Erro ao registrar empresa'});
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const empresa = await Empresa.findOne({where: {email} });

            if (!empresa) {
                return res.status(400).json({ error: 'Email ou senha incorretos'});
            }

            const senhaValida = await bcrypt.compare(senha, empresa.senha);
            if(!senhaValida) {
                return res.status(400).json({ error: 'Email ou senha incorretos'});
            }

            const token = jwt.sign({ id: empresa.id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            res.json({ token });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao autenticar empresa' });

        }
    },

};