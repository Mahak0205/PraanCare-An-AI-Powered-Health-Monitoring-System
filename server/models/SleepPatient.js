const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");

const SleepDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  occupation: Number,
  sleepDuration: Number,
  qualityOfSleep: Number,
  physicalActivity: Number,
  heartRate: Number,
  dailySteps: Number,
  systolicBP: Number,
  diastolicBP: Number,
  height: Number,
  weight: Number,
  stressLevel: Number,
  bmiCategory: Number,
  bmiNumeric: Number,
  prediction: String,
  createdAt: { type: Date, default: Date.now }
});

const SleepDataModel = mongoose.model("SleepData", SleepDataSchema);
module.exports = SleepDataModel;