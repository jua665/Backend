const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
        username: { type: String, required: true, unique: true },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Suscription", SubscriptionSchema);
