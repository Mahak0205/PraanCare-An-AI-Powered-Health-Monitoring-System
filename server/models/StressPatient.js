const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");

const StressDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  stress: String,
  createdAt: { type: Date, default: Date.now }
});


const StressDataModel = mongoose.model("StressData", StressDataSchema);
module.exports = StressDataModel;
