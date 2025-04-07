const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper para generar JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expira en 30 días
  });
};

// Registrar nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({ username, password });

    // Generar token y responder
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token y responder
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};