// src/pages/Mental.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mental.module.css";
import { useAuth } from "../../context/authContext";
import Sidebar from "../../components/Sidebar";
import mentalbg from "../../assets/mentalbg4.jpg";

const Mental = () => {
  const { token, patientId } = useAuth();
  const navigate = useNavigate();

  const mentalMenu = [
    { label: "Prediction", path: "/mental" },
    { label: "Prediction History", path: "/mental/history" },
    { label: "Progress Status", path: "/mental/progress" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgOverlay} style={{ backgroundImage: `url(${mentalbg})` }} />
      <Sidebar menuItems={mentalMenu} className="sidebar-permanent sidebar-mental" />

      <div className={styles.mentalContainer}>
        <h1 className={styles.heading}>🧠 Mental Health Self-Check</h1>
        <p className={styles.intro}>Choose an area to assess your mental wellbeing.</p>

        <div className={styles.cardsWrapper}>
          <MentalCard
            title="Depression"
            emoji="😔"
            description="Understand your mood and energy levels."
            color="depression"
            onClick={() => navigate("/mental/depression")}
          />
          <MentalCard
            title="Anxiety"
            emoji="😟"
            description="Check how worry and nervousness affect you."
            color="anxiety"
            onClick={() => navigate("/mental/anxiety")}
          />
          <MentalCard
            title="Stress"
            emoji="😩"
            description="Evaluate the impact of daily pressure on you."
            color="stress"
            onClick={() => navigate("/mental/stress")}
          />
        </div>
      </div>
    </div>
  );
};

const MentalCard = ({ title, emoji, description, color, onClick }) => (
  <div className={`${styles.mentalCard} ${styles[color]}`} onClick={onClick}>
    <div className={styles.cardHeader}>
      {emoji} {title}
    </div>
    <div className={styles.cardBody}>
      <p>{description}</p>
    </div>
  </div>
);

export default Mental;
