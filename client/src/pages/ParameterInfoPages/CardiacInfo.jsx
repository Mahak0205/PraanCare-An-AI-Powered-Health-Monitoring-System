import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CardiacInfo.module.css';

const CardiacInfo = () => {
  const navigate = useNavigate();

  const handleStartCheckup = () => {
    navigate('/login');
  };
//ji
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Cardiac Health Overview ❤️</h1>

        <p className={styles.text}>
          Cardiovascular diseases (CVDs) are the leading cause of death globally. Early identification of cardiac issues
          can greatly reduce complications and improve quality of life. Our system helps assess your heart health by analyzing key health indicators.
        </p>

        <h2 className={styles.subheading}>How We Assess Your Risk</h2>
        <p className={styles.text}>
          Our AI model uses medically relevant data to predict whether you may be at risk of heart-related conditions.
          The features considered include:
        </p>

        <ul className={styles.list}>
          <li><strong>Age:</strong> Age is a major risk factor for heart diseases.</li>
          <li><strong>Sex:</strong> Males tend to have a higher risk earlier in life.</li>
          <li><strong>Chest Pain Type:</strong> Type of chest discomfort (e.g., typical angina, non-anginal).</li>
          <li><strong>Resting Blood Pressure:</strong> Higher values can signal hypertension.</li>
          <li><strong>Cholesterol:</strong> Total serum cholesterol in mg/dl.</li>
          <li><strong>Fasting Blood Sugar:</strong> Blood sugar levels over 120 mg/dl (Yes/No).</li>
          <li><strong>Resting ECG Results:</strong> Electrocardiographic readings at rest.</li>
          <li><strong>Max Heart Rate:</strong> Maximum heart rate achieved during activity.</li>
          <li><strong>Exercise Induced Angina:</strong> Presence of chest pain during exercise (Yes/No).</li>
          <li><strong>Oldpeak:</strong> ST depression induced by exercise relative to rest.</li>
          <li><strong>ST Slope:</strong> The slope of the peak exercise ST segment.</li>
        </ul>

        <div className={styles.alertBox}>
          This tool is not a substitute for medical diagnosis. It helps in <strong>early awareness and encourages timely checkups</strong>.
        </div>

        <div className={styles.buttonWrapper}>
          <button onClick={handleStartCheckup} className={styles.button}>
            Start with Health Checkup →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardiacInfo;
