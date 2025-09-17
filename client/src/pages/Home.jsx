import React from "react";
import styles from "./Home.module.css";
import { FaHeartbeat, FaBed, FaBrain, FaEye } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Glowing Icons Row */}
      <div className={styles.iconScroller}>
        <FaHeartbeat className={`${styles.glowIcon} ${styles.cardiacIcon}`} />
        <FaBed className={`${styles.glowIcon} ${styles.sleepIcon}`} />
        <FaBrain className={`${styles.glowIcon} ${styles.mentalIcon}`} />
        <FaEye className={`${styles.glowIcon} ${styles.eyeIcon}`} />
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Track Your Health Effortlessly</h1>
        <p className={styles.subtitle}>
          Empowering your wellness journey with cardiac, sleep, vision, and
          mental health tracking.
        </p>
        <div className={styles.ctaButtons}>
          <a href="/signup" className={styles.primaryButton}>
            Get Started
          </a>
          <a href="/login" className={styles.secondaryButton}>
            Login
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className={styles.featuresSection}>
  <div
    className={styles.featureCard}
    style={{
      borderLeft: '4px solid #ef4444',
      background: 'linear-gradient(135deg, #ffe5e5, #ef4444)',
    }}
  >
    <h3>Cardiac Health</h3>
    <p>Monitor your heart's condition with intelligent analysis.</p>
    <a href="/cardiac" className={styles.learnMore} style={{ color: '#000' }}>
      Learn More →
    </a>
  </div>

  <div
    className={styles.featureCard}
    style={{
      borderLeft: '4px solid #1e2097ff',
      background: 'linear-gradient(135deg, #c7d2fe, #1e3a8a)',
    }}
  >
    <h3>Sleep Tracker</h3>
    <p>Understand your sleep patterns and improve rest quality.</p>
    <a href="/sleep" className={styles.learnMore} style={{ color: '#000' }}>
      Learn More →
    </a>
  </div>

  <div
    className={styles.featureCard}
    style={{
      borderLeft: '4px solid #ffed49ff',
      background: 'linear-gradient(135deg, #fff9c4, #fde047)',
    }}
  >
    <h3>Mental Wellbeing</h3>
    <p>Stay in tune with your emotions and psychological wellness.</p>
    <a href="/mental" className={styles.learnMore} style={{ color: '#000' }}>
      Learn More →
    </a>
  </div>

  <div
    className={styles.featureCard}
    style={{
      borderLeft: '4px solid #22c55e',
      background: 'linear-gradient(135deg, #d1fae5, #22c55e)',
    }}
  >
    <h3>Vision Check</h3>
    <p>Track eye health and detect early signs of vision issues.</p>
    <a href="/eye" className={styles.learnMore} style={{ color: '#000' }}>
      Learn More →
    </a>
  </div>
</section>


      {/* Vision Statement */}
      <section className={styles.visionSection}>
        <h2>Our Vision</h2>
        <p>
          PraanCare aims to simplify health monitoring for the elderly and
          working professionals. By tracking core health parameters like sleep,
          mental wellbeing, vision, and cardiac health, we empower individuals
          to take control of their wellness.
        </p>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>
              "I sleep better and feel more in control of my heart health!"
            </p>
            <p className={styles.user}>— Rajeev, Bangalore</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>
              "My mom loves how easy PraanCare makes health tracking for her."
            </p>
            <p className={styles.user}>— Anjali, Mumbai</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>
              "As a software engineer, PraanCare fits perfectly into my hectic
              life."
            </p>
            <p className={styles.user}>— Vivek, Pune</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <h3>Contact Us</h3>
        <p>Email: support@praancare.com</p>
        <p>Phone: +91 9876543210</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© PraanCare 2025</p>
        {/* <div className={styles.footerLinks}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/faq">FAQ</a>
        </div> */}
      </footer>
    </div>
  );
};

export default HomePage;
