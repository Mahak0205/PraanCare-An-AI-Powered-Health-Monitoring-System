const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");

const DepressionDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  depression: String,
  createdAt: { type: Date, default: Date.now }
});


const DepressionDataModel = mongoose.model("DepressionData", DepressionDataSchema);
module.exports = DepressionDataModel;
