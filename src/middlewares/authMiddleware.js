const jwt = require('jsonwebtoken');

module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        // Verifica se o Authorization header está presente
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
        }

        try {
            // Decodifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verifica se o role do usuário está nos roles permitidos
            if (!rolesPermitidos.includes(decoded.role)) {
                return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
            }

            // Atribui as informações do usuário à requisição
            req.userId = decoded.id;  // Exemplo: id do usuário
            req.userRole = decoded.role; // Exemplo: role do usuário

            next(); // Prosegue para a próxima middleware ou rota
        } catch (error) {
            return res.status(400).json({ error: 'Token inválido ou expirado', details: error.message });
        }
    };
};
