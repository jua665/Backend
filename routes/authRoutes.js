const express = require('express');
const bcrypt = require('bcrypt');
const { sendPush,sends } = require('./SendPush.js');  // Usar require en lugar de import
const suscription = require('../models/suscription.js')
const webpush = require('web-push');
const User = require('../models/User');


const router = express.Router();

// Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    res.json({ message: 'Login exitoso', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

// Ruta para obtener la lista de usuarios
router.get('/users', async (req, res) => {
  try {
    const userList = await User.find({}, 'id email suscripcion'); // Obtener solo id, email y suscripción
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
});

// Ruta para actualizar la suscripción del usuario
router.post('/suscripcion', async (req, res) => {
  const { userId, suscripcion } = req.body;

  try {
    // Buscar y actualizar el usuario
    const user = await User.findByIdAndUpdate(
      userId, // Buscar por ID
      { suscripcion }, // Actualizar el campo suscripción
      { new: true } // Devolver el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar notificación de prueba
    await sendPush(suscripcion, user.email); // Cambiado `user.nombre` por `user.email`

    res.status(200).json({ message: 'Suscripción actualizada en el usuario', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para enviar notificación con la suscripción del usuario
router.post('/suscripcionMod', async (req, res) => {
  const { suscripcion, mensaje } = req.body;

  try {
    // Enviar notificación de prueba
    await sends(suscripcion, mensaje);

    res.status(200).json({ message: 'Mensaje enviado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
