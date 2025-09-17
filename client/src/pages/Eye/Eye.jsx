import React, { useState } from 'react';
import styles from './Eye.module.css';
import Sidebar from '../../components/Sidebar';
import eyeBg from '../../assets/eyebg2.jpg'; // Replace with actual background
import axios from 'axios'; // Adjust the import based on your axios setup
import { useAuth } from '../../context/authContext'; // Assuming you have a context or hook for auth

const yesNoOptions = ["Yes", "No"];

const Eye = () => {
  const [formData, setFormData] = useState({
    sleepDuration: '',
    qualityOfSleep: '',
    stressLevel: '',
    heartRate: '',
    dailySteps: '',
    physicalActivity: '',
    height: '',
    weight: '',
    screenTime: '',
    systolicBP: '',
    diastolicBP: '',
    sleepDisorder: '',
    wakeupDuringNight: '',
    sleepyDuringDay: '',
    caffeineConsumption: '',
    alcoholConsumption: '',
    smoking: '',
    medicalIssue: '',
    ongoingMedication: '',
    smartDeviceBeforeBed: '',
    blueLightFilter: '',
    eyeStrain: '',
    eyeRedness: '',
    eyeIrritation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState('');
  const [probability, setProbability] = useState(null);
  const { token } = useAuth(); // Assuming you have a context or hook for auth

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEyeData = async () => {
    setIsSubmitting(true);
    try {
      // Replace with actual backend call
      const res = await axios.post('http://localhost:8080/api/users/predict/eye',formData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPredictionResult(res.data.prediction);
      setProbability(res.data.probability);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eyeMenu = [
    { label: "Prediction", path: "/eye" },
    { label: "Prediction History", path: "/eye/history" },
    { label: "Progress Status", path: "/eye/progress" },
  ];

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${eyeBg})` }}
      />
      <Sidebar menuItems={eyeMenu} className="sidebar-permanent sidebar-eye" />

      <div className={`${styles.eyeContainer} ${isSubmitting ? styles.submitting : ""}`}>
        {!isSubmitted ? (
          <div className={styles.formCard}>
            <h1 className={styles.heading}>Eye Health Self-Check</h1>
            <p className={styles.intro}>Tell us about your daily screen habits and eye comfort.</p>

            {/* Number fields with validation */}
            {[
              { label: "Sleep Duration (hrs)", name: "sleepDuration", min: 0, max: 24 },
              { label: "Quality of Sleep (1–10)", name: "qualityOfSleep", min: 1, max: 10 },
              { label: "Stress Level (1–10)", name: "stressLevel", min: 1, max: 10 },
              { label: "Heart Rate (bpm)", name: "heartRate", min: 30, max: 180 },
              { label: "Daily Steps", name: "dailySteps", min: 0, max: 50000 },
              { label: "Physical Activity (mins/day)", name: "physicalActivity", min: 0, max: 600 },
              { label: "Height (cm)", name: "height", min: 50, max: 250 },
              { label: "Weight (kg)", name: "weight", min: 20, max: 200 },
              { label: "Average Screen Time (hrs)", name: "screenTime", min: 0, max: 24 },
              { label: "Systolic BP", name: "systolicBP", min: 80, max: 200 },
              { label: "Diastolic BP", name: "diastolicBP", min: 40, max: 130 },
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
                  step="any"
                />
              </div>
            ))}

            {/* Yes/No dropdowns */}
            {[
              { label: "Sleep Disorder", name: "sleepDisorder" },
              { label: "Wakeup During Night", name: "wakeupDuringNight" },
              { label: "Feel Sleepy During Day", name: "sleepyDuringDay" },
              { label: "Caffeine Consumption", name: "caffeineConsumption" },
              { label: "Alcohol Consumption", name: "alcoholConsumption" },
              { label: "Smoking", name: "smoking" },
              { label: "Medical Issue", name: "medicalIssue" },
              { label: "Ongoing Medication", name: "ongoingMedication" },
              { label: "Smart Device Before Bed", name: "smartDeviceBeforeBed" },
              { label: "Blue Light Filter Usage", name: "blueLightFilter" },
              { label: "Discomfort / Eye Strain", name: "eyeStrain" },
              { label: "Redness in Eye", name: "eyeRedness" },
              { label: "Itchiness / Irritation in Eye", name: "eyeIrritation" },
            ].map((field) => (
              <div className={styles.formGroup} key={field.name}>
                <label>{field.label}</label>
                <select
                  className={styles.input}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {yesNoOptions.map((option) => (
                    <option key={option.toLowerCase()} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

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
                          <button className={styles.submitBtn} onClick={submitEyeData}>
                            Submit
                          </button>
                        )}
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2>Eye Health Insight</h2>
            <p>Based on your responses, our predictions are:</p>
            <strong className={styles.prediction}>
              Prediction: {predictionResult === 0 ? "No Eye Issue Detected" :
             predictionResult === 1 ? "Eye Issue Detected" :
             "Loading..."}
             <br />

              Confidence: {probability ? `${(probability * 100).toFixed(2)}%` : "Loading..."}
            </strong>
            <p className={styles.footer}>Take care of your eyes 💙</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Eye;
