const express = require('express');
const db = require('./db');
const router = express.Router();

// Adicionar fornecedor
router.post('/fornecedores', (req, res) => {
    const { nome, cnpj, endereco, telefone, email } = req.body;
    const query = `
        INSERT INTO fornecedores (nome, cnpj, endereco, telefone, email)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [nome, cnpj, endereco, telefone, email], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Listar fornecedores
router.get('/fornecedores', (req, res) => {
    const query = `SELECT * FROM fornecedores`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Rota para cadastrar um produto
router.post('/produtos', (req, res) => {
    const { nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem } = req.body;
    const query = `
        INSERT INTO produtos (nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Rota para listar produtos
router.get('/produtos', (req, res) => {
    const query = `SELECT * FROM produtos`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Rota para associar fornecedor a um produto
router.post('/fornecedores/:fornecedorId/produtos/:produtoId', (req, res) => {
    const { fornecedorId, produtoId } = req.params;
    const query = `
        INSERT INTO fornecedor_produto (id_fornecedor, id_produto)
        VALUES (?, ?)
    `;
    db.run(query, [fornecedorId, produtoId], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ message: 'Fornecedor associado ao produto com sucesso!' });
    });
});

// Rota para desassociar fornecedor de um produto
router.delete('/fornecedores/:fornecedorId/produtos/:produtoId', (req, res) => {
    const { fornecedorId, produtoId } = req.params;
    const query = `
        DELETE FROM fornecedor_produto
        WHERE id_fornecedor = ? AND id_produto = ?
    `;
    db.run(query, [fornecedorId, produtoId], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: 'Fornecedor desassociado do produto com sucesso!' });
    });
});

module.exports = router;
