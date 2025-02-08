const Joi = require('joi');

// Validação para Fornecedores
const fornecedorSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'O campo Nome é obrigatório.',
        'string.min': 'O Nome deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O Nome pode ter no máximo {#limit} caracteres.'
    }),
    cnpj: Joi.string().length(18).required().pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).messages({
        'string.empty': 'O CNPJ é obrigatório.',
        'string.length': 'O CNPJ deve ter exatamente 18 caracteres.',
        'string.pattern.base': 'O formato do CNPJ é inválido. Use XX.XXX.XXX/XXXX-XX.'
    }),
    endereco: Joi.string().min(5).max(200).required().messages({
        'string.empty': 'O Endereço é obrigatório.',
        'string.min': 'O Endereço deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O Endereço pode ter no máximo {#limit} caracteres.'
    }),
    telefone: Joi.string().length(14).required().pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/).messages({
        'string.empty': 'O Telefone é obrigatório.',
        'string.length': 'O Telefone deve ter exatamente 14 caracteres.',
        'string.pattern.base': 'O formato do Telefone é inválido. Use (XX) XXXXX-XXXX.'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'O E-mail é obrigatório.',
        'string.email': 'O E-mail informado é inválido.'
    })
});

// Validação para Produtos
const produtoSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'O campo Nome do Produto é obrigatório.',
        'string.min': 'O Nome do Produto deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O Nome do Produto pode ter no máximo {#limit} caracteres.'
    }),
    codigo_barras: Joi.string().length(13).required().pattern(/^\d{13}$/).messages({
        'string.empty': 'O Código de Barras é obrigatório.',
        'string.length': 'O Código de Barras deve ter exatamente 13 dígitos.',
        'string.pattern.base': 'O Código de Barras deve conter apenas números.'
    }),
    descricao: Joi.string().min(10).max(500).required().messages({
        'string.empty': 'A Descrição do Produto é obrigatória.',
        'string.min': 'A Descrição deve ter pelo menos {#limit} caracteres.',
        'string.max': 'A Descrição pode ter no máximo {#limit} caracteres.'
    }),
    quantidade: Joi.number().integer().min(0).required().messages({
        'number.base': 'A Quantidade deve ser um número.',
        'number.min': 'A Quantidade não pode ser negativa.'
    }),
    categoria: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'A Categoria é obrigatória.',
        'string.min': 'A Categoria deve ter pelo menos {#limit} caracteres.',
        'string.max': 'A Categoria pode ter no máximo {#limit} caracteres.'
    }),
    data_validade: Joi.string().optional().allow(null),
    imagem: Joi.string().optional().allow(null)
});

module.exports = { fornecedorSchema, produtoSchema };
