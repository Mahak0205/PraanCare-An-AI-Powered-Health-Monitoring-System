import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SleepInfo.module.css';

const SleepInfo = () => {
  const navigate = useNavigate();

  const handleStartCheckup = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sleep Health Overview 🌙</h1>

        <p className={styles.text}>
          Sleep is the foundation of physical and mental health. Inadequate or poor-quality sleep can lead to fatigue,
          emotional distress, heart issues, and even chronic illness. Our tool evaluates your sleep profile to help improve rest.
        </p>

        <h2 className={styles.subheading}>How We Monitor Your Sleep</h2>
        <p className={styles.text}>
          We use key health metrics and behavioral data to assess your sleep quality and lifestyle patterns.
        </p>

        <div>
          <h3 className={styles.subheading}>🌙 Sleep & Lifestyle</h3>
          <ul className={styles.list}>
            <li>Sleep duration</li>
            <li>Quality of sleep</li>
            <li>Physical activity level</li>
            <li>Stress level</li>
            <li>Occupation</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>🫀 Vital Signs & Body Metrics</h3>
          <ul className={styles.list}>
            <li>Heart rate</li>
            <li>Daily steps</li>
            <li>Blood pressure (systolic & diastolic)</li>
            <li>Height & weight (BMI)</li>
          </ul>
        </div>

        <div className={styles.alertBox}>
          Our model analyzes these inputs to help identify patterns that may indicate sleep issues — so you can take early action for better rest.
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

export default SleepInfo;
