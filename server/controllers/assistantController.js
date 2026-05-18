const path = require("path");
const { spawn } = require("child_process");
const User = require("../models/User");
const SleepData = require("../models/SleepPatient");
const DepressionData = require("../models/DepressionPatient");
const AnxietyData = require("../models/AnxietyPatient");
const StressData = require("../models/StressPatient");
const EyeData = require("../models/EyePatient");
const CardiacData = require("../models/CardiacPatient");

// 🧠 Spawn Python Groq Assistant Script
const runAssistantPython = ({ message, context, prompt }) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.resolve(__dirname, "..", "python_codes", "venv", "Scripts", "python.exe");
    const assistantPath = path.resolve(__dirname, "..", "python_codes", "assistant.py");
    const py = spawn(pythonPath, [assistantPath], {
      cwd: path.resolve(__dirname, ".."),
    });

    const input = JSON.stringify({ message, context, prompt });
    let result = "";

    py.stdin.write(input);
    py.stdin.end();

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {
      console.error("🐍 Python error:", err.toString());
    });

    py.on("close", () => {
      resolve(result.trim());
    });
  });
};

// 🧠 Mental Assistant (Talk & Report Insights)
exports.mentalAssistant = async (req, res) => {
  const { patientId } = req.params;
  const { type, message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message input." });
  }
  if (!["report insights", "talk"].includes(type)) {
    return res.status(400).json({ error: "Invalid assistant type." });
  }

  try {
    const user = await User.findOne({ patientId });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Fetch last 5 entries from each dataset
    const depressionRecords = await DepressionData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);
    const anxietyRecords = await AnxietyData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);
    const stressRecords = await StressData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Merge all records
    const mergedHistory = [];

    depressionRecords.forEach((entry) => {
      mergedHistory.push({
        type: "depression",
        value: entry.depression,
        createdAt: entry.createdAt,
      });
    });
    anxietyRecords.forEach((entry) => {
      mergedHistory.push({
        type: "anxiety",
        value: entry.anxiety,
        createdAt: entry.createdAt,
      });
    });
    stressRecords.forEach((entry) => {
      mergedHistory.push({
        type: "stress",
        value: entry.stress,
        createdAt: entry.createdAt,
      });
    });

    mergedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const grouped = {};
    mergedHistory.forEach((entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString("en-IN");
      if (!grouped[date]) grouped[date] = {};
      grouped[date][entry.type] = entry.value;
    });

    const finalHistory = Object.entries(grouped).map(([date, values]) => ({
      date,
      depression: values.depression || "N/A",
      anxiety: values.anxiety || "N/A",
      stress: values.stress || "N/A",
    }));

    // Context passed to Groq
    let context = {
      name: user.name,
      age: user.age,
      gender: user.gender,
      history: finalHistory,
    };

    let prompt = "";

    if (type === "report insights") {
      prompt = `
You are an AI assistant analyzing mental health score data (depression, anxiety, stress). Your input will be a list of scores over time.

Instructions:
- Analyze patterns and trends in data across all report entries.
- Provide 3 clear insights based on these patterns with interpreted meaning, possible implications and non-diagnostic suggestions.
- You may indicate possible risk factors or recommend lifestyle considerations if patterns suggested.
- Avoid using personal words like "you", "your", etc.
- Each insight must be concise and no longer than 30 words.
- Do not give any medical diagnosis but you may use phrases like "may indicate", "suggest increased risk", or "consider discussing with a healthcare provider".
- Focus on meaningfull observations rather than numerical differences.

Respond only with 4 bullet points. No introduction, no conclusion, no extra text.
`;

      context = {
        history: finalHistory,
      };
    } else if (type === "talk") {
      prompt = `
You are a friendly, emotionally aware mental health AI assistant. 
Engage in casual conversation with the user to support their mood.

Guidelines:
- Avoid giving any medical advice or diagnosis.
- If user expresses sadness, respond with empathy.
- Suggest seeking help if they mention distress.
- Do NOT mention suicide, medication, or mental illness by name.
- Avoid complex terms — keep it light, safe, and human-like.
`;

      context = {
        name: user.name,
        age: user.age,
        gender: user.gender,
        history: finalHistory,
      };
    }
    console.log("🧠 MENTAL ASSISTANT REQUEST");
    console.log("🆔 Patient ID:", patientId);
    console.log("📨 Type:", type);
    console.log("💬 Message:", message);
    console.log("🧾 Final History:", finalHistory);
    console.log("📄 Prompt Preview:\n", prompt);
    console.log("🧠 Context Sent:", context);

    const response = await runAssistantPython({ message, context, prompt });
    res.json({ message: response });
  } catch (err) {
    console.error("🧠 Mental Assistant Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process mental assistant request." });
  }
};

// 😴 Sleep Assistant (Talk & Insights)
exports.sleepAssistant = async (req, res) => {
  const { patientId } = req.params;
  const { type, message } = req.body;

  console.log("🛠️ Incoming Request:");
  console.log("🆔 patientId:", patientId);
  console.log("📩 type:", type);
  console.log("💬 message:", message);

  if (!message || typeof message !== "string") {
    console.log("❌ Invalid or missing message.");
    return res.status(400).json({ error: "Invalid message input." });
  }

  if (!["talk", "report insights"].includes(type)) {
    console.log("❌ Invalid assistant type:", type);
    return res.status(400).json({ error: "Invalid assistant type." });
  }

  try {
    const user = await User.findOne({ patientId });
    if (!user) {
      console.log("❌ User not found for patientId:", patientId);
      return res.status(404).json({ error: "User not found." });
    }

    console.log("✅ User found:", user.name);

    const sleepRecords = await SleepData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (sleepRecords.length === 0) {
      console.log("❌ No sleep records found for patientId:", patientId);
      return res.status(404).json({ error: "No sleep data found." });
    }

    console.log(`📊 Fetched ${sleepRecords.length} sleep records.`);
    console.log(
      "🗂️ Records:",
      sleepRecords.map((r) => ({
        createdAt: r.createdAt,
        prediction: r.prediction,
        quality: r.qualityOfSleep,
        duration: r.sleepDuration,
      })),
    );

    const formattedHistory = sleepRecords.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("en-IN"),
      sleepDuration: entry.sleepDuration,
      qualityOfSleep: entry.qualityOfSleep,
      stressLevel: entry.stressLevel,
      heartRate: entry.heartRate,
      bmiCategory: entry.bmiCategory,
      prediction: entry.prediction,
    }));

    let context = {};
    let prompt = "";

    if (type === "report insights") {
      console.log("🧠 Preparing sleep insights prompt...");
      prompt = `
You are a medical AI assistant specializing in sleep health.

You will receive a user's last 5 sleep health records including:
- sleep duration
- sleep quality
- heart rate
- stress level
- BMI category
- prediction (e.g., Poor / Good)

Instructions:
- Analyze patterns and trends in data across all report entries.
- Provide 3 clear insights based on these patterns with interpreted meaning, possible implications and non-diagnostic suggestions.
- You may indicate possible risk factors or recommend lifestyle considerations if patterns suggested.
- Avoid using personal words like "you", "your", etc.
- Each insight must be concise and no longer than 30 words.
- Do not give any medical diagnosis but you may use phrases like "may indicate", "suggest increased risk", or "consider discussing with a healthcare provider".
- Focus on meaningfull observations rather than numerical differences.

Return only 3 bullet points. No intro, no conclusion.
      `;
      context = { history: formattedHistory };
    } else if (type === "talk") {
      console.log("💬 Preparing casual chatbot prompt...");
      prompt = `
You are a friendly AI chatbot supporting sleep wellness.
Engage in gentle conversation.

Rules:
- Avoid medical advice, diagnoses, or treatments.
- Be warm and casual.
- If the user seems tired or stressed, encourage gentle self-care.
- Avoid technical or alarming language.
- Respond simply, human-like, and kindly.
      `;
      context = {
        name: user.name,
        age: user.age,
        gender: user.gender,
        history: formattedHistory,
      };
    }

    console.log("📤 Sending to runAssistantPython:");
    console.log("Context:", context);
    console.log("Prompt Preview:", prompt.substring(0, 100) + "...");

    const response = await runAssistantPython({ message, context, prompt });

    console.log("✅ Assistant response received.");
    res.json({ message: response });
  } catch (err) {
    console.error("💤 Sleep Assistant Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process sleep assistant request." });
  }
};

exports.eyeAssistant = async (req, res) => {
  const { patientId } = req.params;
  const { type, message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message input." });
  }

  if (!["report insights", "talk"].includes(type)) {
    return res.status(400).json({ error: "Invalid assistant type." });
  }

  try {
    const user = await User.findOne({ patientId });
    if (!user) return res.status(404).json({ error: "User not found." });

    const eyeRecords = await EyeData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedHistory = eyeRecords.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("en-IN"),
      prediction:
        entry.prediction === "1" ? "Dry eye likely" : "Dry eye unlikely",
      probability: `${Math.round(Number(entry.probability) * 100)}%`,
      screenTime: entry.screenTime,
      eyeStrain: entry.eyeStrain,
      eyeRedness: entry.eyeRedness,
      eyeIrritation: entry.eyeIrritation,
    }));

    let prompt = "";
    let context = { history: formattedHistory };

    if (type === "report insights") {
      prompt = `
You are an AI assistant analyzing eye health report data.

Instructions:
- Analyze patterns and trends in data across all report entries.
- Provide 3 clear insights based on these patterns with interpreted meaning, possible implications and non-diagnostic suggestions.
- You may indicate possible risk factors or recommend lifestyle considerations if patterns suggested.
- Avoid using personal words like "you", "your", etc.
- Each insight must be concise and no longer than 30 words.
- Do not give any medical diagnosis but you may use phrases like "may indicate", "suggest increased risk", or "consider discussing with a healthcare provider".
- Focus on meaningfull observations rather than numerical differences.

Respond only with 3 bullet points. No introduction or conclusion.
`;
    } else if (type === "talk") {
      prompt = `
You are a polite, helpful AI assistant supporting users with eye strain.

Guidelines:
- Keep tone friendly and helpful.
- Never give medical advice.
- Avoid diagnosing or naming conditions.
- Use non-emotional, supportive language.
- Don't mention treatments, medications, or suicide.

Respond conversationally, based on user messages and screen time/symptoms history.
`;
      context = {
        name: user.name,
        gender: user.gender,
        age: user.age,
        history: formattedHistory,
      };
    }

    console.log("🧠 EYE ASSISTANT REQUEST");
    console.log("🆔 Patient ID:", patientId);
    console.log("📨 Type:", type);
    console.log("💬 Message:", message);
    console.log("📄 Prompt:\n", prompt);
    console.log("🧾 Context:\n", context);

    const response = await runAssistantPython({ message, context, prompt });
    res.json({ message: response });
  } catch (err) {
    console.error("❌ Eye Assistant Error:", err);
    res.status(500).json({ error: "Failed to process eye assistant request." });
  }
};

exports.cardiacAssistant = async (req, res) => {
  const { patientId } = req.params;
  const { type, message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message input." });
  }

  if (!["report insights", "talk"].includes(type)) {
    return res.status(400).json({ error: "Invalid assistant type." });
  }

  try {
    const user = await User.findOne({ patientId });
    if (!user) return res.status(404).json({ error: "User not found." });

    const records = await CardiacData.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Map enums to readable values
    const formatChestPain = (v) =>
      ["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"][
        v
      ] || "Unknown";
    const formatRestingECG = (v) =>
      ["Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"][v] ||
      "Unknown";
    const formatSlope = (v) =>
      ["Upsloping", "Flat", "Downsloping"][v] || "Unknown";
    const formatBinary = (v) => (v === 1 ? "Yes" : "No");

    const formattedHistory = records.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("en-IN"),
      prediction:
        entry.prediction === "1" ? "Cardiac issue likely" : "Less likely",
      confidence: `${Math.round(Number(entry.probability) * 100)}%`,
      restingBP: entry.restingBP,
      cholesterol: entry.cholesterol,
      maxHeartRate: entry.maxHeartRate,
      oldpeak: entry.oldpeak,
      chestPainType: formatChestPain(entry.chestPainType),
      fastingBloodSugar: formatBinary(entry.fastingBloodSugar),
      restingECG: formatRestingECG(entry.restingECG),
      exerciseAngina: formatBinary(entry.exerciseAngina),
      stSlope: formatSlope(entry.stSlope),
    }));

    let prompt = "";
    let context = { history: formattedHistory };

    if (type === "report insights") {
      prompt = `
You are an AI assistant analyzing cardiac health report data.

Instructions:
- Analyze patterns and trends in data across all report entries.
- Provide 3 clear insights based on these patterns with interpreted meaning, possible implications and non-diagnostic suggestions.
- You may indicate possible risk factors or recommend lifestyle considerations if patterns suggested.
- Avoid using personal words like "you", "your", etc.
- Each insight must be concise and no longer than 30 words.
- Do not give any medical diagnosis but you may use phrases like "may indicate", "suggest increased risk", or "consider discussing with a healthcare provider".
- Focus on meaningfull observations rather than numerical differences.


Output should be only 3 bullet points. No intro or closing statements.
`;
    } else if (type === "talk") {
      prompt = `
You are a friendly but neutral AI assistant supporting users about cardiac health concerns.

Guidelines:
- Respond to user questions based on history only.
- NEVER offer diagnosis or medical suggestions.
- Be helpful, but professional.
- Avoid emotion-driven or alarmist language.
- No medication or treatment advice.

Use the patient's previous data to answer as informatively as possible.
`;
      context = {
        name: user.name,
        gender: user.gender,
        age: user.age,
        history: formattedHistory,
      };
    }

    console.log("🧠 CARDIAC ASSISTANT REQUEST");
    console.log("🆔 Patient ID:", patientId);
    console.log("📨 Type:", type);
    console.log("💬 Message:", message);
    console.log("📄 Prompt:\n", prompt);
    console.log("🧾 Context:\n", context);

    const response = await runAssistantPython({ message, context, prompt });
    res.json({ message: response });
  } catch (err) {
    console.error("❌ Cardiac Assistant Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process cardiac assistant request." });
  }
};
