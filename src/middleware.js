const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta';

function verificarToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ erro: 'Token inválido.' });

        req.usuario = decoded;
        next();
    });
}

module.exports = { verificarToken };
