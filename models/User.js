const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: Object }, // Campo para almacenar la suscripción de notificaciones
});

module.exports = mongoose.model('User', userSchema);

