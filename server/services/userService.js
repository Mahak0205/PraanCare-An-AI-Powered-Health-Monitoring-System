const UserModel = require("../models/User");

// Helper function to fetch patient info internally
exports.fetchUserInfoByPatientId = async (patientId) => {
  try {
    const user = await UserModel.findOne({ patientId }).lean();
    return user;
  } catch (err) {
    console.error("Error in fetchUserInfoByPatientId:", err);
    return null;
  }
};
