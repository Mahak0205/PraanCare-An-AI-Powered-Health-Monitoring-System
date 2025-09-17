const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');
const DepressionData = require('../models/DepressionPatient');
const AnxietyData = require('../models/AnxietyPatient');
const StressData = require('../models/StressPatient');


function runPythonPrediction(inputArray, type) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../python_codes/Mental/mental_pred.py"); // Correct path
    const pythonPath = path.join(__dirname, "../python_codes/venv/Scripts/python.exe"); // Use venv

    console.log(`📤 Running Python script for "${type}"`);
    console.log("📥 Input data:", inputArray);

    // Call: python mental_pred.py <type> <json_array_string>
    const python = spawn(pythonPath, [scriptPath, type, JSON.stringify(inputArray)]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
      console.error("🐍 stderr:", data.toString());
    });

    python.on("close", (code) => {
      if (code !== 0 || error) {
        console.error(`❌ Python ${type} exited with code ${code}`);
        reject(error || `Exited with code ${code}`);
      } else {
        console.log(`✅ Python ${type} result:`, result.trim());
        resolve(result.trim());
      }
    });
  });
}
//building input data for mental wellbeing
async function buildInputData(req, res) {
  const fourteenResponses = req.body.responses;
  if (!fourteenResponses || fourteenResponses.length !== 14) {
    return res.status(400).json({ msg: 'Invalid response format' });
  }

  const userId = req.user.id; // 🧠 comes from auth middleware
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const traits = [
    user.personality["Extraverted - enthusiastic"],
    user.personality["Critical - quarrelsome"],
    user.personality["Dependable - self-disciplined"],
    user.personality["Anxious - easily upset"],
    user.personality["Open to new experiences - complex"],
    user.personality["Reserved - quiet"],
    user.personality["Sympathetic - warm"],
    user.personality["Disorganized - careless"],
    user.personality["Calm - emotionally stable"],
    user.personality["Conventional - uncreative"]
  ];

  const demographics = [
    user.education,
    user.urban,
    user.gender,
    user.age,
    user.religion,
    user.race,
    user.married,
    user.familysize,
    user.major
  ];

  const fullData = [...fourteenResponses, ...traits, ...demographics];
  return fullData;
}

exports.predictDepression = async (req, res) => {
  try {
    const inputData = await buildInputData(req, res);
    if (!inputData) return;
    const prediction = await runPythonPrediction(inputData, 'depression');
    const newEntry = new DepressionData({
      patientId: req.user.patientId,
      depression: prediction,
    })
    await newEntry.save();
  
    res.json({ prediction });
  } catch (err) {
    console.error("❌ Depression Prediction Error:", err);
    res.status(500).json({ error: err.toString() });
  }
};

exports.predictAnxiety = async (req, res) => {
  try {
    const inputData = await buildInputData(req, res);
    if (!inputData) return; // Prevent further processing on failure

    const prediction = await runPythonPrediction(inputData, 'anxiety');
    const newEntry = new AnxietyData({
      patientId: req.user.patientId,
      anxiety: prediction,
    })
    await newEntry.save();

    res.json({ prediction });
  } catch (err) {
    console.error("❌ AnxietyData Prediction Error:", err);
    res.status(500).json({ error: err.toString() });
  }
};
exports.predictStress = async (req, res) => {
  try {
    const inputData = await buildInputData(req, res);
    if(!inputData) return;
    const prediction = await runPythonPrediction(inputData, 'stress');
    const newEntry = new StressData({
      patientId: req.user.patientId,
      stress: prediction,
    })
    await newEntry.save();
    res.json({ prediction });
  } catch (err) {
    console.error("❌ StressData Prediction Error:", err);
    res.status(500).json({ error: err.toString() });
  }
};

// GET /api/users/mental/history/:patientId
exports.getMentalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(`📥 Fetching mental health history for patientId: ${patientId}`);

    const [depressionHistory, anxietyHistory, stressHistory] = await Promise.all([
      DepressionData.find({ patientId }).sort({ createdAt: -1 }),
      AnxietyData.find({ patientId }).sort({ createdAt: -1 }),
      StressData.find({ patientId }).sort({ createdAt: -1 }),
    ]);

    console.log("📊 Depression history :", depressionHistory);
    console.log("📊 Anxiety history :", anxietyHistory);
    console.log("📊 Stress history :", stressHistory);
    res.status(200).json({
      depressionHistory,
      anxietyHistory,
      stressHistory,
    });
  } catch (error) {
    console.error('Error fetching mental health history:', error);
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

exports.deleteMentalHistory = async (req, res) => {
  const { patientId } = req.params;

  try {
    await DepressionData.deleteMany({ patientId });
    await AnxietyData.deleteMany({ patientId });
    await StressData.deleteMany({ patientId });
    res.status(200).json({ message: 'DASS history cleared successfully' });
  } catch (error) {
    console.error('Error deleting sleep history:', error);
    res.status(500).json({ message: 'Failed to delete sleep history' });
  }
};
