const path = require("path");
const { spawn } = require("child_process");
const EyeDataModel = require("../models/EyePatient"); // Adjust the path as necessary

function runPythonEyePrediction(inputData) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(
      __dirname,
      "../python_codes/venv/Scripts/python.exe"
    ); // shared venv
    const scriptPath = path.join(__dirname, "../python_codes/Eye/eye.py"); // correct case

    const pyProcess = spawn(pythonPath, [scriptPath]);

    let result = "";
    let error = "";

    pyProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        return reject({
          msg: "Python prediction failed",
          code,
          error,
          raw: result,
        });
      }

      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (e) {
        reject({
          msg: "Failed to parse Python output",
          raw: result,
          error: error || e.message,
        });
      }
    });

    // Send JSON input to Python stdin
    pyProcess.stdin.write(JSON.stringify(inputData));
    pyProcess.stdin.end();
  });
}

exports.predictEye = async (req, res) => {
  try {
    const {
      sleepDuration,
      qualityOfSleep,
      stressLevel,
      heartRate,
      dailySteps,
      physicalActivity,
      height,
      weight,
      screenTime,
      systolicBP,
      diastolicBP,
      sleepDisorder,
      wakeupDuringNight,
      sleepyDuringDay,
      caffeineConsumption,
      alcoholConsumption,
      smoking,
      medicalIssue,
      ongoingMedication,
      smartDeviceBeforeBed,
      blueLightFilter,
      eyeStrain,
      eyeRedness,
      eyeIrritation,
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    let gender = "Male";

    if (user.gender == 0) {
      gender = "Male";
    } else {
      gender = "Female";
    }

    // const inputArray = [
    //   user.age,
    //   sleepDuration,
    //   qualityOfSleep,
    //   stressLevel,
    //   heartRate,
    //   dailySteps,
    //   physicalActivity,
    //   height,
    //   weight,
    //   screenTime,
    //   systolicBP,
    //   diastolicBP,
    //   gender,
    //   sleepDisorder,
    //   wakeupDuringNight,
    //   sleepyDuringDay,
    //   caffeineConsumption,
    //   alcoholConsumption,
    //   smoking,
    //   medicalIssue,
    //   ongoingMedication,
    //   smartDeviceBeforeBed,
    //   blueLightFilter,
    //   eyeStrain,
    //   eyeRedness,
    //   eyeIrritation,
    // ];

    const inputDict = {
      Age: user.age,
      Sleep_duration: sleepDuration,
      Sleep_quality: qualityOfSleep,
      Stress_level: stressLevel,
      Heart_rate: heartRate,
      Daily_steps: dailySteps,
      Physical_activity: physicalActivity,
      Height: height,
      Weight: weight,
      Average_screen_time: screenTime,
      Systolic_BP: systolicBP,
      Diastolic_BP: diastolicBP,
      Gender: gender,
      Sleep_disorder: sleepDisorder,
      Wake_up_during_night: wakeupDuringNight,
      Feel_sleepy_during_day: sleepyDuringDay,
      Caffeine_consumption: caffeineConsumption,
      Alcohol_consumption: alcoholConsumption,
      Smoking: smoking,
      Medical_issue: medicalIssue,
      Ongoing_medication: ongoingMedication,
      Smart_device_before_bed: smartDeviceBeforeBed,
      Blue_light_filter: blueLightFilter,
      Discomfort_Eye_strain: eyeStrain,
      Redness_in_eye: eyeRedness,
      Itchiness_Irritation_in_eye: eyeIrritation,
    };

    console.log("📤 Eye prediction input:", inputDict);

    const { prediction, probability } = await runPythonEyePrediction(inputDict);
    console.log("📥 Eye prediction result:", prediction);
    console.log("📊 Eye prediction probability:", probability);

    const newEntry = new EyeDataModel({
      patientId: user.patientId,
      sleepDuration,
      qualityOfSleep,
      stressLevel,
      heartRate,
      dailySteps,
      physicalActivity,
      height,
      weight,
      screenTime,
      systolicBP,
      diastolicBP,
      sleepDisorder,
      wakeupDuringNight,
      sleepyDuringDay,
      caffeineConsumption,
      alcoholConsumption,
      smoking,
      medicalIssue,
      ongoingMedication,
      smartDeviceBeforeBed,
      blueLightFilter,
      eyeStrain,
      eyeRedness,
      eyeIrritation,
      prediction,
      probability,
    });

    await newEntry.save();
    res.status(200).json({ prediction, probability });
  } catch (error) {
    console.error("Error in eye prediction:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      details: error.message || "Unknown error",
    });
  }
};

exports.getEyeHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    console.log("Fetching eye history for patient:", patientId);
    if (!patientId) {
      return res.status(400).json({ msg: "Patient ID is required" });
    }
    const history = await EyeDataModel.find({ patientId }).sort({
      createdAt: -1,
    });
    if (!history || history.length === 0) {
      console.log("No eye health history found for patient:", patientId);
      return res
        .status(404)
        .json({ msg: "No eye health history found for this patient" });
    }
    console.log("Eye history fetched successfully:", history);
    res.status(200).json({ history: history });
  } catch (error) {
    console.error("Error fetching eye history:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      details: error.message || "Unknown error",
    });
  }
};

exports.deleteEyeHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!patientId) {
      return res.status(400).json({ msg: "Patient ID is required" });
    }
    const result = await EyeDataModel.deleteMany({ patientId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: "No eye health history found for this patient" });
    }
    res.status(200).json({ msg: "Eye health history cleared successfully" });
  } catch (error) {
    console.error("Error deleting eye history:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      details: error.message || "Unknown error",
    });
  }
};
