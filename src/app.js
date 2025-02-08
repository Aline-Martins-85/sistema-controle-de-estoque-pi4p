const express = require('express');
const app = express();
const PORT = 3000;
const fornecedorRoutes = require('./routes');

app.use(express.json());
app.use('/api', fornecedorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Controle de Estoque está ativa!', status: 'OK' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const authRoutes = require('./auth'); // Importa rotas de autenticação
app.use('/api/auth', authRoutes); // Define o prefixo para rotas de autenticação
