const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");
const UserSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
  },
  age: Number,
  gender: Number,
  race: Number,
  religion: Number,
  education: Number,
  urban: Number,
  familysize: Number,
  married: Number,
  major: Number,

  personality: {
    "Extraverted - enthusiastic": Number,
    "Critical - quarrelsome": Number,
    "Dependable - self-disciplined": Number,
    "Anxious - easily upset": Number,
    "Open to new experiences - complex": Number,
    "Reserved - quiet": Number,
    "Sympathetic - warm": Number,
    "Disorganized - careless": Number,
    "Calm - emotionally stable": Number,
    "Conventional - uncreative": Number,
  }
});

const UserModel = mongoose.model("PatientData", UserSchema);
module.exports = UserModel;
