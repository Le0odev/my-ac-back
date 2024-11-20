const jwt = require('jsonwebtoken');

module.exports = (rolesPermitidos) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!rolesPermitidos.includes(decoded.role)) {
        return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
      }

      req.userId = decoded.id; 
      req.userRole = decoded.role;

      next();
    } catch (error) {
      return res.status(400).json({ error: 'Token inválido ou expirado', details: error.message });
    }
  };
};
