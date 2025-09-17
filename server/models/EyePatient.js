const mongoose = require("mongoose");
const EyeDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  sleepDuration: Number,
  qualityOfSleep: Number,
  stressLevel: Number,
  heartRate: Number,
  dailySteps: Number,
  physicalActivity: Number,
  height: Number,
  weight: Number,
  screenTime: Number,
  systolicBP: Number,
  diastolicBP: Number,
  sleepDisorder: String,
  wakeupDuringNight: String,
  sleepyDuringDay: String,
  caffeineConsumption: String,
  alcoholConsumption: String,
  smoking: String,
  medicalIssue: String,
  ongoingMedication: String,
  smartDeviceBeforeBed: String,
  blueLightFilter: String,
  eyeStrain: String,
  eyeRedness: String,
  eyeIrritation: String,
  prediction: String,
  probability: Number,
  createdAt: { type: Date, default: Date.now },
});

const EyeDataModel = mongoose.model("EyeData", EyeDataSchema);
module.exports = EyeDataModel;