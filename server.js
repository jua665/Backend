require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes'); // 🔹 Importar rutas de suscripción
const webpush = require('web-push');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const path = require('path');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir sw.js
app.use('/sw.js', express.static(path.join(__dirname, 'public', 'sw.js')));




// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/auth', authRoutes);
app.use('/auth', subscriptionRoutes); // 🔹 Agregando rutas de suscripción

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en el puerto ${PORT}`);
});
