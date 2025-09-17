const { spawn } = require('child_process');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SleepDataModel = require('../models/SleepPatient');


function runPythonSleepPrediction(inputArray) {
  return new Promise((resolve, reject) => {
    // Correct path to Python script
    const scriptPath = path.join(__dirname, "../python_codes/Sleep/sleep_pred.py");

    // Use venv's Python interpreter
    const pythonPath = path.join(__dirname, "../python_codes/venv/Scripts/python.exe");

    // Convert all inputs to strings
    const args = inputArray.map(String);

    const python = spawn(pythonPath, [scriptPath, ...args]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
      console.error("🐍 stderr (sleep):", data.toString());
    });

    python.on("close", (code) => {
      if (code !== 0 || error) {
        reject(error || `Python sleep predictor exited with code ${code}`);
      } else {
        resolve(result.trim());
      }
    });
  });
}

exports.predictSleep = async (req, res) => {
  try {
    const {
      sleepDuration,
      qualityOfSleep,
      physicalActivity,
      stressLevel,
      bmiCategory,
      heartRate,
      dailySteps,
      systolicBP,
      diastolicBP,
      occupation
    } = req.body;

    const user = req.user;

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }


    const inputArray = [
      user.gender,
      user.age,
      occupation,
      sleepDuration,
      qualityOfSleep,
      physicalActivity,
      stressLevel,
      bmiCategory,
      heartRate,
      dailySteps,
      systolicBP,
      diastolicBP
    ];

    console.log("📤 Sleep prediction input:", inputArray);

    const prediction = await runPythonSleepPrediction(inputArray);

    const h = req.body.height;
    const w = req.body.weight;

    //saving this instance to the sleepData collection
    const newEntry = new SleepDataModel({
      patientId: user.patientId,
      occupation: req.body.occupation,
      sleepDuration: req.body.sleepDuration,
      qualityOfSleep: req.body.qualityOfSleep,
      physicalActivity: req.body.physicalActivity,
      heartRate: req.body.heartRate,
      dailySteps: req.body.dailySteps,
      systolicBP: req.body.systolicBP,
      diastolicBP: req.body.diastolicBP,
      height: req.body.height,
      weight: req.body.weight,
      stressLevel: req.body.stressLevel,
      bmiCategory: req.body.bmiCategory,
      bmiNumeric: w / ((h / 100) ** 2),
      prediction: prediction,
    });
    await newEntry.save();

    res.json({ prediction });
  } catch (err) {
    console.error("❌ Sleep Prediction Error:", err);
    res.status(500).json({ error: err.toString() });
  }
};

exports.getSleepHistory = async (req, res) => {
  const { patientId } = req.params;

  try {
    console.log("Fetching sleep history for patientId:", patientId);
    const history = await SleepDataModel.find({ patientId }).sort({ createdAt: -1 });
    console.log("Sleep history found:", history);

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No sleep history found for this patient.' });
    }

    res.status(200).json({ history });
  } catch (err) {
    console.error('Error fetching sleep history:', err);
    res.status(500).json({ message: 'Internal server error while fetching sleep history.' });
  }
};

exports.deleteSleepHistory = async (req, res) => {
  const { patientId } = req.params;

  try {
    await SleepDataModel.deleteMany({ patientId });
    res.status(200).json({ message: 'Sleep history cleared successfully' });
  } catch (error) {
    console.error('Error deleting sleep history:', error);
    res.status(500).json({ message: 'Failed to delete sleep history' });
  }
};
