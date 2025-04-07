require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configuración del JWT Secret (agregar justo después de las constantes)
process.env.JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_dev'; // Usa variable de entorno en producción

// 2. Configuración de CORS (tu configuración actual, solo verifica que incluya Authorization)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Asegúrate que esté Authorization aquí
}));

// Middlewares (tus middlewares existentes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Conexión a MongoDB (tu código actual permanece igual)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crud-next-node';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });

// 4. Rutas (modificar esta sección)
// Primero importa las rutas de autenticación al inicio del archivo (junto con itemRoutes)
const authRoutes = require('./routes/auth');

// Luego configura las rutas:
app.use('/api/auth', authRoutes); // Nuevas rutas de autenticación
app.use('/api/items', itemRoutes); // Tus rutas existentes de items

// 5. Middlewares de errores (tu código actual permanece igual)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 6. Inicio del servidor (tu código actual)
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('⛔ Conexión a MongoDB cerrada');
    server.close(() => {
      console.log('⛔ Servidor detenido');
      process.exit(0);
    });
  });
});
