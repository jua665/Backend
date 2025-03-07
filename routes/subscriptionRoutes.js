const express = require('express');
const router = express.Router();
const { saveSubscription } = require('../controllers/subscriptionController');

router.post('/subscribe', saveSubscription); // ✅ Ruta definida correctamente

module.exports = router;
