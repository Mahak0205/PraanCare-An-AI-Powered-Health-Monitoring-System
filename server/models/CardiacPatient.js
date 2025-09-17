const mongoose = require('mongoose');

const CardiacPatientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
    },
    chestPainType: Number,
      restingBP: Number,
      cholesterol: Number,
      fastingBloodSugar: Number,
      restingECG: Number,
      maxHeartRate: Number,
      exerciseAngina: Number,
      oldpeak: Number,
      stSlope: Number,
      prediction: String,
      probability: Number,
      createdAt: { type: Date, default: Date.now }
});

const CardiacDataModel = mongoose.model('CardiacData', CardiacPatientSchema);
module.exports = CardiacDataModel;