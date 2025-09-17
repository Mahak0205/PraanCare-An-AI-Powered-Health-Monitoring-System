import React, { useState } from "react";
import styles from "./PersonalityForm.module.css";

const items = [
  "Extraverted - enthusiastic",
  "Critical - quarrelsome",
  "Dependable - self-disciplined",
  "Anxious - easily upset",
  "Open to new experiences - complex",
  "Reserved - quiet",
  "Sympathetic - warm",
  "Disorganized - careless",
  "Calm - emotionally stable",
  "Conventional - uncreative",
];

const PersonalityForm = ({ onBack, onSubmit }) => {
  const [traits, setTraits] = useState(Array(10).fill(""));

  const handleChange = (index, value) => {
    const updated = [...traits];
    updated[index] = value;
    setTraits(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const traitData = {};
    items.forEach((trait, i) => {
      traitData[`item${i + 1}`] = parseInt(traits[i]);
    });
    onSubmit(traitData); // Only send data to parent
  };

  return (
    <div className={styles.formBgOverlay}>
      <form onSubmit={handleSubmit} className={styles.personalityContainer}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`${styles.personalityItem} ${
              traits[i] !== "" || i === 0 || traits[i - 1] !== ""
                ? styles.active
                : ""
            }`}
          >
            <label className={styles.question}>
              I see myself as: <span>{item}</span>
            </label>
            <div className={styles.radioGroup}>
              {[
                { value: 1, label: "Disagree Strongly" },
                { value: 2, label: "Disagree Moderately" },
                { value: 3, label: "Slightly Disagree" },
                { value: 4, label: "Neutral" },
                { value: 5, label: "Slightly Agree" },
                { value: 6, label: "Agree Moderately" },
                { value: 7, label: "Agree Strongly" },
              ].map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`trait-${i}`}
                    value={option.value}
                    checked={traits[i] === String(option.value)}
                    onChange={(e) => handleChange(i, e.target.value)}
                    disabled={i !== 0 && traits[i - 1] === ""}
                    required
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.navButtons}>
          {onBack && (
            <button type="button" className={styles.backBtn} onClick={onBack}>
              Back
            </button>
          )}
          <button type="submit" className={styles.submitBtn}>
            Finish & Go to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalityForm;
