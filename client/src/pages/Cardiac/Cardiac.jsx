import React, { useState } from "react";
import styles from "./Cardiac.module.css";
import Sidebar from "../../components/Sidebar";
import cardiacBg from "../../assets/cardiacbg4.jpg";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const Cardiac = () => {
  const [formData, setFormData] = useState({
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBloodSugar: "",
    restingECG: "",
    maxHeartRate: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState("");
  const [probability, setProbability] = useState("");
  const { token, patientId } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitCardiacData = async () => {
    setIsSubmitting(true);
    try {
      // Mapping to numerical values for backend
      const mappedData = {
        chestPainType: {
          "typical angina": 0,
          "atypical angina": 1,
          "non-anginal pain": 2,
          asymptomatic: 3,
        }[formData.chestPainType.toLowerCase()],
        restingBP: Number(formData.restingBP),
        cholesterol: Number(formData.cholesterol),
        fastingBloodSugar: {
          yes: 1,
          no: 0,
        }[formData.fastingBloodSugar.toLowerCase()],
        restingECG: {
          normal: 0,
          "st-t wave abnormality": 1,
          "left ventricular hypertrophy": 2,
        }[formData.restingECG.toLowerCase()],
        maxHeartRate: Number(formData.maxHeartRate),
        exerciseAngina: {
          yes: 1,
          no: 0,
        }[formData.exerciseAngina.toLowerCase()],
        oldpeak: parseFloat(formData.oldpeak),
        stSlope: {
          upsloping: 0,
          flat: 1,
          downsloping: 2,
        }[formData.stSlope.toLowerCase()],
      };

      console.log("Submitting cardiac data:", mappedData);

      const res = await axios.post(
        `http://localhost:8080/api/users/predict/cardiac`,
        mappedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPredictionResult(res.data.prediction);
      setProbability(res.data.probability);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardiacMenu = [
    { label: "Prediction", path: "/cardiac" },
    { label: "Prediction History", path: "/cardiac/history" },
    { label: "Progress Status", path: "/cardiac/progress" },
  ];

  const cardiacFields = [
    {
      label: "Chest Pain Type",
      name: "chestPainType",
      type: "select",
      options: [
        "Typical Angina",
        "Atypical Angina",
        "Non-anginal Pain",
        "Asymptomatic",
      ],
    },
    {
      label: "Resting BP (mmHg)",
      name: "restingBP",
      type: "number",
      min: 50,
      max: 250,
      placeholder: "e.g., 120",
    },
    {
      label: "Cholesterol (mg/dL)",
      name: "cholesterol",
      type: "number",
      min: 50,
      max: 600,
      placeholder: "e.g., 200",
    },
    {
      label: "Fasting Blood Sugar > 120 mg/dL",
      name: "fastingBloodSugar",
      type: "select",
      options: ["Yes", "No"],
    },
    {
      label: "Resting ECG",
      name: "restingECG",
      type: "select",
      options: [
        "Normal",
        "ST-T Wave Abnormality",
        "Left Ventricular Hypertrophy",
      ],
    },
    {
      label: "Max Heart Rate",
      name: "maxHeartRate",
      type: "number",
      min: 40,
      max: 250,
      placeholder: "e.g., 150",
    },
    {
      label: "Exercise Induced Angina",
      name: "exerciseAngina",
      type: "select",
      options: ["Yes", "No"],
    },
    {
      label: "Oldpeak (ST depression)",
      name: "oldpeak",
      type: "number",
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: "e.g., 1.2",
    },
    {
      label: "ST Slope",
      name: "stSlope",
      type: "select",
      options: ["Upsloping", "Flat", "Downsloping"],
    },
  ];

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );
  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${cardiacBg})` }}
      />
      <Sidebar
        menuItems={cardiacMenu}
        className="sidebar-permanent sidebar-cardiac"
      />

      <div
        className={`${styles.cardiacContainer} ${
          isSubmitting ? styles.submitting : ""
        }`}
      >
        {!isSubmitted ? (
          <div className={styles.formCard}>
            <h1 className={styles.heading}>Cardiac Health Self-Check</h1>
            <p className={styles.intro}>
              Fill in your heart-related metrics to assess your risk.
            </p>

            {cardiacFields.map((field) => (
              <div className={styles.formGroup} key={field.name}>
                <label>{field.label}</label>
                {field.type === "number" ? (
                  <input
                    className={styles.input}
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    min={field.min}
                    max={field.max}
                    step={field.step || "any"}
                  />
                ) : (
                  <select
                    className={styles.input}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt.toLowerCase()} value={opt.toLowerCase()}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <>
              {!isFormComplete ? (
                <>
                  <p style={{ color: "white", marginTop: "8px" }}>
                    Please fill in all required fields to enable the submit
                    button.
                  </p>
                  <button disabled className={styles.submitBtn}>
                    Submit
                  </button>
                </>
              ) : (
                <button className={styles.submitBtn} onClick={submitCardiacData}>Submit</button>
              )}
            </>

            {/* {isFormComplete?(
              <button className={styles.submitBtn} onClick={submitCardiacData}>
              Submit
            </button>

            ):(

            )}

            <button className={styles.submitBtn} onClick={submitCardiacData} disabled={!isFormComplete}>
              Submit
            </button> */}
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2>Cardiac Health Insight</h2>
            <p>Based on your responses, we suggest:</p>

            <strong className={styles.prediction}>
              {predictionResult === 1
                ? "⚠️ Likely risk of Heart Disease"
                : predictionResult === 0
                ? "✅ No significant risk detected"
                : "Loading..."}
            </strong>

            {probability !== undefined && (
              <p className={styles.probability}>
                Probablity: {(probability * 100).toFixed(2)}%
              </p>
            )}

            <p className={styles.footer}>Take care of your heart 💙</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cardiac;
