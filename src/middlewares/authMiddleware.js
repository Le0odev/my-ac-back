const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.clientId = decode.id;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });

    }
}