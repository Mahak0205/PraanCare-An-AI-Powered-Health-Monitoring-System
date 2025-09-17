const SleepDataModel = require("../models/SleepPatient");

// Helper function to fetch patient info internally
exports.fetchSleepHistoryByPatientId = async (patientId) => {
  try {
    const user = await SleepDataModel.find({ patientId }).sort({ createdAt: -1 }).lean();
    return user;
  } catch (err) {
    console.error("Error in fetchUserInfoByPatientId:", err);
    return null;
  }
};
