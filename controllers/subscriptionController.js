const Suscription = require('../models/suscription');

// Guardar suscripción en la base de datos
const saveSubscription = async (req, res) => {
    try {
        const { subscription, userId, username } = req.body;
        console.log('📥 Datos recibidos en el backend:', req.body);

        // Validar si los datos son null o undefined
        if (!subscription || !userId || !username) {
            console.warn('❌ Datos faltantes:', { subscription, userId, username });
            return res.status(400).json({ message: '❌ Faltan datos requeridos' });
        }

        let existingSubscription = await Suscription.findOne({ endpoint: subscription.endpoint });
        if (existingSubscription) {
            return res.status(409).json({ message: '❌ La suscripción ya existe' });
        }

        const newSubscription = new Suscription({
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            keys: subscription.keys,
            userId: userId,
            username: username // 👈 Agregar username aquí
        });

        await newSubscription.save();
        res.status(201).json({ message: '✅ Suscripción guardada correctamente' });

    } catch (error) {
        console.error('❌ Error en el backend:', error.message);
        res.status(500).json({ message: '❌ Error al guardar la suscripción', error: error.message });
    }
};


module.exports = { saveSubscription };
