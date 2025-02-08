const express = require('express');
const db = require('./db');
const { fornecedorSchema, produtoSchema } = require('./validations'); // Importando validações
const { verificarToken } = require('./middleware'); // Importando middleware de autenticação
const router = express.Router();

// Criar um novo fornecedor (com validação e proteção JWT)
router.post('/fornecedores', verificarToken, (req, res) => {
    const { error } = fornecedorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }

    const { nome, cnpj, endereco, telefone, email } = req.body;
    const query = `
        INSERT INTO fornecedores (nome, cnpj, endereco, telefone, email)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [nome, cnpj, endereco, telefone, email], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ erro: 'Já existe um fornecedor com esse CNPJ.' });
            }
            return res.status(500).json({ erro: 'Erro ao cadastrar fornecedor.' });
        }
        res.status(201).json({ id: this.lastID, mensagem: 'Fornecedor cadastrado com sucesso!' });
    });
});

// Criar um novo produto (com validação e proteção JWT)
router.post('/produtos', verificarToken, (req, res) => {
    const { error } = produtoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }

    const { nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem } = req.body;

    // Verifica se já existe um produto com o mesmo código de barras
    const checkQuery = `SELECT * FROM produtos WHERE codigo_barras = ?`;
    db.get(checkQuery, [codigo_barras], (err, row) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao verificar o código de barras.' });
        }
        if (row) {
            return res.status(400).json({ erro: 'Já existe um produto com esse código de barras.' });
        }

        // Se não existir, insere o produto
        const insertQuery = `
            INSERT INTO produtos (nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertQuery, [nome, codigo_barras, descricao, quantidade, categoria, data_validade, imagem], function (err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao cadastrar o produto.' });
            }
            res.status(201).json({ id: this.lastID, mensagem: 'Produto cadastrado com sucesso!' });
        });
    });
});

// 🔒 Rotas protegidas para listar fornecedores e produtos
router.get('/fornecedores', verificarToken, (req, res) => {
    const query = `SELECT * FROM fornecedores`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

router.get('/produtos', verificarToken, (req, res) => {
    const { page = 1, limit = 10, categoria } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM produtos`;
    let params = [];

    // Se houver filtro por categoria
    if (categoria) {
        query += ` WHERE categoria LIKE ?`;
        params.push(`%${categoria}%`);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({
            total: rows.length,
            pagina: Number(page),
            produtos: rows
        });
    });
});

// 🔓 Rotas públicas para consultar um fornecedor/produto específico
router.get('/fornecedores/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM fornecedores WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Fornecedor não encontrado!" });
        }
        res.status(200).json(row);
    });
});

router.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM produtos WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Produto não encontrado!" });
        }
        res.status(200).json(row);
    });
});

// 🔒 Rotas protegidas para deletar fornecedores e produtos
router.delete('/fornecedores/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM fornecedores WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Fornecedor não encontrado!" });
        }
        res.status(200).json({ message: "Fornecedor removido com sucesso!" });
    });
});

router.delete('/produtos/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM produtos WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Produto não encontrado!" });
        }
        res.status(200).json({ message: "Produto removido com sucesso!" });
    });
});

// Exportação deve estar no final do arquivo
module.exports = router;
