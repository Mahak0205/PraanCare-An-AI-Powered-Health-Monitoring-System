const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");

const AnxietyDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  anxiety: String,
  createdAt: { type: Date, default: Date.now }
});


const AnxietyDataModel = mongoose.model("AnxietyData", AnxietyDataSchema);
module.exports = AnxietyDataModel;
