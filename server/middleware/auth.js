// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Obtener token del header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('Acceso denegado. Token no proporcionado');
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token inválido:', err.message);
    return res.status(403).json({ error: 'Token no válido' });
  }
};