const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const CardiacData = require("../models/CardiacPatient"); // ✅ correct model name

function runPythonPrediction(inputData) {
  console.log("🔍 Running Python cardiac prediction...");

  return new Promise((resolve, reject) => {
    // Correct script path and virtualenv Python path
    const scriptPath = path.join(
      __dirname,
      "../python_codes/Cardiac/cardiac.py"
    );
    const pythonPath = path.join(
      __dirname,
      "../python_codes/venv/Scripts/python.exe"
    );

    // Temporary input file
    const tmpFile = path.join(
      __dirname,
      "../python_codes/Cardiac/input_tmp.json"
    );
    try {
      fs.writeFileSync(tmpFile, JSON.stringify(inputData));
      console.log("📁 TEMP FILE CONTENT:");
      console.log(fs.readFileSync(tmpFile, "utf-8"));
    } catch (err) {
      return reject(`❌ Failed to write input JSON: ${err}`);
    }
    console.log("🐍 Python path:", pythonPath);
    console.log("📜 Script path:", scriptPath);

    if (!fs.existsSync(pythonPath)) {
      return reject(`❌ Python executable not found at: ${pythonPath}`);
    }
    if (!fs.existsSync(scriptPath)) {
      return reject(`❌ Python script not found at: ${scriptPath}`);
    }

    console.log("🧪 TRYING TO RUN:");
    console.log(`${pythonPath} ${scriptPath} ${tmpFile}`);

    const python = spawn(pythonPath, [scriptPath, tmpFile]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
      console.error("🐍 stderr (cardiac):", data.toString());
    });

    python.on("close", (code) => {
      fs.unlinkSync(tmpFile); // ✅ Always delete the temp file

      console.log("🐍 Python stdout (raw):", result);

      const lines = result
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const lastLine = lines.length > 0 ? lines[lines.length - 1] : "";

      if (code !== 0 || error) {
        reject(
          `❌ Python exited with code ${code}\n${error}\nSTDOUT: ${result}`
        );
      } else {
        resolve(lastLine);
      }
    });
  });
}

exports.predictCardiac = async (req, res) => {
  try {
    const {
      chestPainType,
      restingBP,
      cholesterol,
      fastingBloodSugar,
      restingECG,
      maxHeartRate,
      exerciseAngina,
      oldpeak,
      stSlope,
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const inputData = {
      age: user.age,
      sex: user?.gender === 1 ? 1 : 0,
      "chest pain type": chestPainType,
      "resting bp s": restingBP,
      cholesterol: cholesterol,
      "fasting blood sugar": fastingBloodSugar,
      "resting ecg": restingECG,
      "max heart rate": maxHeartRate,
      "exercise angina": exerciseAngina,
      oldpeak: oldpeak,
      "ST slope": stSlope,
    };

    console.log("📤 Sending input to Python:", inputData);

    const predictionRaw = await runPythonPrediction(inputData);

    let prediction, probability;
    try {
      const parsed = JSON.parse(predictionRaw);
      prediction = parsed.prediction;
      probability = parsed.probability;
    } catch (e) {
      console.error("❌ JSON parse error:", e, predictionRaw);
      return res.status(500).json({
        success: false,
        error: "Invalid response from Python script",
        details: predictionRaw,
      });
    }

    const newEntry = new CardiacData({
      patientId: user.patientId,
      chestPainType,
      restingBP,
      cholesterol,
      fastingBloodSugar,
      restingECG,
      maxHeartRate,
      exerciseAngina,
      oldpeak,
      stSlope,
      prediction,
      probability,
    });

    await newEntry.save();

    console.log("✅ Cardiac prediction saved:", {
      patientId: user.patientId,
      prediction,
      probability,
    });

    res.json({ success: true, prediction, probability });
  } catch (err) {
    console.error("❌ Cardiac Prediction Error:", err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

exports.getCardiacHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    console.log("📋 Fetching cardiac history for patient:", patientId);

    if (!patientId) {
      return res.status(400).json({ msg: "Patient ID is required" });
    }

    const history = await CardiacData.find({ patientId }).sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      console.log("⚠️ No cardiac health history found for patient:", patientId);
      return res.status(404).json({ msg: "No cardiac health history found for this patient" });
    }

    console.log("✅ Cardiac history fetched successfully:", history);
    res.status(200).json({ history: history });

  } catch (error) {
    console.error("❌ Error fetching cardiac history:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      details: error.message || "Unknown error"
    });
  }
};

exports.deleteCardiacHistory = async (req, res) => {
  try{
    const patientId = req.params.patientId;
    console.log("🗑️ Deleting cardiac history for patient:", patientId);
    if (!patientId) {
      return res.status(400).json({ msg: "Patient ID is required" });
    }
    const result = await CardiacData.deleteMany({ patientId });
    if (result.deletedCount === 0) {
      console.log("⚠️ No cardiac history found for patient:", patientId);
      return res.status(404).json({ msg: "No cardiac health history found for this patient" });
    }
    console.log("✅ Cardiac history deleted successfully for patient:", patientId);
    res.status(200).json({ msg: "Cardiac health history deleted successfully" });

  }catch{
    console.error("❌ Error deleting cardiac history:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      details: error.message || "Unknown error"
    });

  }
};
