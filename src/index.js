require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const defineAssociations = require('../src/models/associations'); // Importa os relacionamentos
const routes = require('./routes'); // Importa todas as rotas definidas no arquivo routes/index.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


// Verifica se a pasta de uploads/avatars existe, se não, cria
const uploadDir = path.join(__dirname, "uploads", "avatars");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Pasta de uploads/avatars criada com sucesso!");
} else {
  console.log("Pasta de uploads/avatars já existe.");
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://192.168.18.4:5173'],
  methods: ['GET', 'POST'], // Permitindo métodos GET e POST
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitindo certos cabeçalhos
};
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Usar o roteador principal
app.use('/api', routes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor está rodando!');
});

// Definir os relacionamentos entre os modelos
defineAssociations(); // Executa as associações

// Sincronização do banco de dados
sequelize
  .sync({ force: false }) // força a criação das tabelas se necessário, mas sem apagar dados existentes
  .then(() => {
    console.log('Banco de dados sincronizado!');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

// Testar a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
