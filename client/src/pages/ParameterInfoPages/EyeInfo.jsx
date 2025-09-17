import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EyeInfo.module.css';

const EyeInfo = () => {
  const navigate = useNavigate();

  const handleStartCheckup = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Eye Health Overview 👁️</h1>

        <p className={styles.text}>
          In today’s digital world, eye health is becoming increasingly important. With the rise of screen time, poor sleep,
          and environmental factors, individuals face higher risks of developing dry eye syndrome, eye strain, and other vision-related issues.
        </p>

        <h2 className={styles.subheading}>How We Evaluate Your Eye Health</h2>
        <p className={styles.text}>
          Our intelligent assessment analyzes a wide range of factors across three key categories:
        </p>

        <div>
          <h3 className={styles.subheading}>📊 Demographic & Physiological Factors</h3>
          <ul className={styles.list}>
            <li>Age, Gender</li>
            <li>Sleep duration & quality</li>
            <li>Stress level, Heart rate</li>
            <li>Daily steps, Physical activity</li>
            <li>Height, Weight (for BMI)</li>
            <li>Blood pressure (Systolic & Diastolic)</li>
            <li>Blood sugar level</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>🧠 Behavioral & Environmental Factors</h3>
          <ul className={styles.list}>
            <li>Average screen time per day</li>
            <li>Caffeine, alcohol & smoking habits</li>
            <li>Smart device usage before sleep</li>
            <li>Blue-light filter usage</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>🩺 Medical & Symptomatic Factors</h3>
          <ul className={styles.list}>
            <li>Existing medical conditions</li>
            <li>Ongoing medications</li>
            <li>Symptoms like discomfort, eye strain, redness, itchiness or irritation</li>
          </ul>
        </div>

        <div className={styles.alertBox}>
          Our system provides a personalized risk assessment to help you detect early signs of eye fatigue or dry eye issues.
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

export default EyeInfo;
