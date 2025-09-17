import React, { useState } from "react";
import styles from "./Sleep.module.css";
import { useAuth } from "../../context/authContext";
import Sidebar from "../../components/Sidebar";
import { Home, BarChart2, User, History } from "lucide-react";
import sleepbg from "../../assets/sleepbg3.jpg";

const occupations = [
  "Software Engineer",
  "Doctor",
  "Sales Representative",
  "Teacher",
  "Nurse",
  "Engineer",
  "Accountant",
  "Scientist",
  "Lawyer",
  "Salesperson",
  "Manager",
];

const stressLevels = [
  "Mild",
  "Normal",
  "Moderate",
  "Severe",
  "Extremely Severe",
];

const Sleep = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    sleepDuration: "",
    qualityOfSleep: "",
    physicalActivity: "",
    stressLevel: "",
    heartRate: "",
    dailySteps: "",
    systolicBP: "",
    diastolicBP: "",
    height: "",
    weight: "",
    occupation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const { token } = useAuth();

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBMIcode = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    if (!height || !weight) return null;
    const bmi = weight / (height / 100) ** 2;
    if (bmi < 18.5) return 0;
    if (bmi < 25) return 1;
    if (bmi < 30) return 2;
    return 3;
  };

  const submitSleepData = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        occupation: occupations.indexOf(formData.occupation),
        stressLevel: stressLevels.indexOf(formData.stressLevel) + 1,
        bmiCategory: calculateBMIcode(),
        timestamp: new Date().toISOString(),
      };
      const res = await fetch("http://localhost:8080/api/users/predict/sleep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setPredictionResult(result.prediction);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sidebar menu for Sleep section
  const sleepMenu = [
    { label: "Prediction", path: "/sleep" },
    { label: "Prediction History", path: "/sleep/predictionHistory" },
    { label: "Progress Status", path: "/sleep/progress" },
  ];
  //prediction = /sleep because we get to do a new prediction here.

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );
  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${sleepbg})` }}
      />
      <Sidebar
        menuItems={sleepMenu}
        className="sidebar-permanent sidebar-sleep"
      />

      {/* Main content */}
      <div
        className={`${styles.sleepContainer} ${
          isSubmitting ? styles.submitting : ""
        }`}
      >
        {!isSubmitted ? (
          <div className={styles.formCard}>
            <h1 className={styles.heading}>Sleep Health Self-Check 🌙</h1>
            <p className={styles.intro}>
              Help us understand your sleep routine and wellness markers.
            </p>

            <div className={styles.formGroup}>
              <label>Occupation</label>
              <select
                className={styles.input}
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              >
                <option value="">Select your occupation</option>
                {occupations.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Input fields */}
            {[
              { label: "Sleep Duration (hrs)", name: "sleepDuration" },
              {
                label: "Quality of Sleep (1–10)",
                name: "qualityOfSleep",
                min: 1,
                max: 10,
              },
              {
                label: "Physical Activity (mins/day)",
                name: "physicalActivity",
              },
              { label: "Heart Rate (bpm)", name: "heartRate" },
              { label: "Daily Steps", name: "dailySteps" },
              { label: "Systolic BP", name: "systolicBP" },
              { label: "Diastolic BP", name: "diastolicBP" },
              { label: "Height (cm)", name: "height" },
              { label: "Weight (kg)", name: "weight" },
            ].map((field) => (
              <div className={styles.formGroup} key={field.name}>
                <label>{field.label}</label>
                <input
                  className={styles.input}
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  min={field.min}
                  max={field.max}
                />
              </div>
            ))}

            <div className={styles.formGroup}>
              <label>Stress Level</label>
              <select
                className={styles.input}
                name="stressLevel"
                value={formData.stressLevel}
                onChange={handleChange}
              >
                <option value="">Select your stress level</option>
                {stressLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

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
              <button className={styles.submitBtn} onClick={submitSleepData}>
                Submit
              </button>
            )}
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2>Sleep Prediction</h2>
            <p>Based on your inputs, our system suggests:</p>
            <strong className={styles.prediction}>
              {predictionResult || "Loading..."}
            </strong>
            <p className={styles.footer}>Keep prioritizing your rest 💙</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sleep;
