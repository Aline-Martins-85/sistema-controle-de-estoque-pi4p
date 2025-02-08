const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./estoque.db');

// Criar tabela de fornecedores
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT NOT NULL UNIQUE,
            endereco TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `);

    console.log('Tabela de fornecedores configurada!');
});

module.exports = db;

// Criando tabela de produtos
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigo_barras TEXT NOT NULL UNIQUE,
            descricao TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            categoria TEXT NOT NULL,
            data_validade TEXT,
            imagem TEXT
        )
    `);
    console.log('Tabela de produtos configurada!');
});

// Criando tabela de associação entre fornecedores e produtos
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedor_produto (
            id_fornecedor INTEGER,
            id_produto INTEGER,
            PRIMARY KEY (id_fornecedor, id_produto),
            FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id),
            FOREIGN KEY (id_produto) REFERENCES produtos(id)
        )
    `);
    console.log('Tabela de associação entre fornecedores e produtos configurada!');
});
// Criar tabela de usuários
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        )
    `);
    console.log('Tabela de usuários configurada!');
});
