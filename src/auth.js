const express = require('express');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'sua_chave_secreta'; // Idealmente, armazene isso em variáveis de ambiente

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já está cadastrado
    const checkQuery = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(checkQuery, [email], async (err, row) => {
        if (err) return res.status(500).json({ erro: 'Erro ao verificar e-mail.' });
        if (row) return res.status(400).json({ erro: 'E-mail já cadastrado.' });

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(senha, 10);

        const insertQuery = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
        db.run(insertQuery, [nome, email, hashedPassword], function (err) {
            if (err) return res.status(500).json({ erro: 'Erro ao registrar usuário.' });
            res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
        });
    });
});

// Rota para login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
        if (!user) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });

        // Comparar a senha enviada com a senha armazenada
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, mensagem: 'Login bem-sucedido!' });
    });
});

module.exports = router;
