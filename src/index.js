// src/index.js
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');



const corsOptions = {
  origin: ['http://localhost:5173', 'http://192.168.18.4:5173'],
  methods: ['GET', 'POST'], // Permitindo métodos GET e POST
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitindo certos cabeçalhos
};



const empresaRoutes = require('./routes/empresaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

app.use('/api/empresa', empresaRoutes);
app.use('/api/cliente', clienteRoutes);

// Definindo uma rota inicial
app.get('/', (req, res) => {
  res.send('Servidor está rodando!');
});


sequelize.sync({ force: false })  // força a criação das tabelas se necessário, mas sem apagar dados existentes
  .then(() => {
    console.log('Banco de dados sincronizado!');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

sequelize
 .authenticate()
 .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
 })
 .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);

 })
// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


