import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MentalInfo.module.css';

const MentalInfo = () => {
  const navigate = useNavigate();

  const handleStartCheckup = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Mental Health Overview 🧠</h1>

        <p className={styles.text}>
          Mental wellbeing is essential to our overall health. Emotional stress, anxiety, and depression can affect focus,
          sleep, relationships, and productivity. Our system helps you reflect on your mental health using psychological tools and personal context.
        </p>

        <h2 className={styles.subheading}>Our Assessment Approach</h2>
        <p className={styles.text}>
          We combine clinically validated tools and basic personal information to help you monitor your mental state. The components include:
        </p>

        <div>
          <h3 className={styles.subheading}>📋 DASS-42 Questionnaire</h3>
          <ul className={styles.list}>
            <li>42 questions measuring levels of <strong>Depression</strong>, <strong>Anxiety</strong>, and <strong>Stress</strong></li>
            <li>Each question uses a 4-point scale based on how often you've experienced symptoms</li>
            <li>Designed to assess emotional states over the past week</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>🧬 Ten-Item Personality Inventory (TIPI)</h3>
          <ul className={styles.list}>
            <li>Captures personality traits using just 10 statements</li>
            <li>Measures traits like openness, conscientiousness, extraversion, agreeableness, and emotional stability</li>
            <li>Helps understand how personality may relate to mental health</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>🌍 Demographic & Personal Details</h3>
          <ul className={styles.list}>
            <li>Includes your <strong>age</strong>, <strong>gender</strong>, and <strong>location</strong></li>
            <li>Other contextual information like marital status, education, and family background</li>
            <li>These help personalize insights and track progress over time</li>
          </ul>
        </div>

        <div className={styles.alertBox}>
          This self-check is designed for awareness and personal reflection. If you're struggling, please consider reaching out to a mental health professional.
        </div>

        <div className={styles.buttonWrapper}>
          <button
            onClick={handleStartCheckup}
            className={styles.button}
          >
            Start with Health Checkup →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentalInfo;
