// src/pages/Dashboard.jsx

import React from 'react';
import styles from './Dashboard.module.css';
import { FaHeartbeat, FaBed, FaBrain, FaEye } from 'react-icons/fa';
import HealthCard from '../components/HealthCard';

import cardiacImg from '../assets/dashboard/Heart.png';
import sleepImg from '../assets/dashboard/Sleep.png';
import mentalImg from '../assets/dashboard/Mental.png';
import eyeImg from '../assets/dashboard/Eye.png';

const Dashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const name = userInfo?.name || 'User';
  const email = userInfo?.email || '';
  const quote = 'Your health is your greatest wealth 🌿';

  return (
    <div className={styles.wrapper}>
      <div className={styles.dashboardContainer}>
        {/* 🌟 Icon Strip */}
        <div className={styles.iconStrip}>
          <FaHeartbeat className={`${styles.glowIcon} ${styles.cardiacIcon}`} />
          <FaBed className={`${styles.glowIcon} ${styles.sleepIcon}`} />
          <FaBrain className={`${styles.glowIcon} ${styles.mentalIcon}`} />
          <FaEye className={`${styles.glowIcon} ${styles.eyeIcon}`} />
        </div>

        {/* 👋 Greeting */}
        <header className={styles.dashboardHeader}>
          <h2>Hi, {name} 👋</h2>
          <p>Welcome back to PraanCare</p>
          <small>{email}</small>
        </header>

        {/* 💠 Health Grid */}
        <section className={styles.healthGrid}>
          <HealthCard
            title="Heart Health"
            image={cardiacImg}
            link="/cardiac"
            icon={<FaHeartbeat className={styles.cardiacIcon} />}
            color="#ef4444"
            description="Check your cardiovascular fitness and alerts."
          />
          <HealthCard
            title="Sleep Tracker"
            image={sleepImg}
            link="/sleep"
            icon={<FaBed className={styles.sleepIcon} />}
            color="#60a5fa"
            description="Track your sleep quality and duration."
          />
          <HealthCard
            title="Mental Wellbeing"
            image={mentalImg}
            link="/mental"
            icon={<FaBrain className={styles.mentalIcon} />}
            color="#dfbe00ff"
            description="Assess your stress, anxiety, and mood."
          />
          <HealthCard
            title="Vision Care"
            image={eyeImg}
            link="/eye"
            icon={<FaEye className={styles.eyeIcon} />}
            color="#22c55e"
            description="Get regular updates on your eye health."
          />
        </section>

        {/* 🌿 Health Tip */}
        <section className={styles.dashboardTip}>
          <blockquote>{quote}</blockquote>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
