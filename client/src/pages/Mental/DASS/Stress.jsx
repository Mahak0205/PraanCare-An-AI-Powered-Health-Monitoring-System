import React, { useState } from "react";
import styles from "./Stress.module.css";
import { useAuth } from "../../../context/authContext";
import Sidebar from "../../../components/Sidebar";
import mentalbg from "../../../assets/mentalbg4.jpg"; // Adjust the path as needed

const stressQuestions = [
  "I found it hard to wind down.",
  "I tended to over-react to situations.",
  "I felt that I was using a lot of nervous energy.",
  "I found myself getting agitated.",
  "I found it difficult to relax.",
  "I was intolerant of anything that kept me from getting on with what I was doing.",
  "I felt that I was rather touchy.",
  "I found it hard to calm down after something upset me.",
  "I was unable to become enthusiastic about anything.",
  "I felt that I was not worth much as a person.",
  "I found that I was very irritable.",
  "I felt scared without any good reason.",
  "I felt that life was meaningless.",
  "I found it difficult to tolerate interruptions to what I was doing.",
];

const Stress = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(stressQuestions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const { token } = useAuth();

  const mentalMenu = [
    { label: "Prediction", path: "/mental" },
    { label: "Prediction History", path: "/mental/history" },
    { label: "Progress Status", path: "/mental/progress" },
  ];

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const next = () => {
    if (currentQuestion < stressQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAnswers();
    }
  };

  const prev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        responses: answers,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:8080/api/users/predict/stress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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

  return (
    <>
  <div className={styles.bgOverlay} style={{ backgroundImage: `url(${mentalbg})` }} />
  <Sidebar menuItems={mentalMenu} className="sidebar-permanent sidebar-mental" />

  <div className={styles.pageWrapper}>
    <div className={`${styles.stressContainer} ${isSubmitting ? styles.submitting : ""}`}>
      {!isSubmitted ? (
        <>
          <h1 className={styles.heading}>Stress Self-Assessment</h1>
          <p className={styles.intro}>Tune into your feelings with a gentle check-in.</p>

          <div className={styles.questionCard}>
            <div className={styles.questionNumber}>
              Question {currentQuestion + 1} / {stressQuestions.length}
            </div>
            <p className={styles.questionText}>{stressQuestions[currentQuestion]}</p>

            <div className={styles.options}>
              {[0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  className={`${styles.option} ${answers[currentQuestion] === val ? styles.selected : ""}`}
                  onClick={() => handleAnswer(val)}
                >
                  {[
                    "Did not apply to me at all",
                    "Applied to me to some degree / some of the time",
                    "Applied to me to a considerable degree / a good part of the time",
                    "Applied to me very much / most of the time",
                  ][val]}
                </button>
              ))}
            </div>

            <div className={styles.navigation}>
              <button onClick={prev} disabled={currentQuestion === 0}>Back</button>
              <button onClick={next} disabled={answers[currentQuestion] === null}>
                {currentQuestion === stressQuestions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>

            <div className={styles.progress}>
              {stressQuestions.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === currentQuestion ? styles.active : ""}`}
                ></span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.submissionComplete}>
          <h2>Thank you 🌸</h2>
          <p>Your responses were submitted with care.</p>
          <p>
            Based on your self-assessment, your stress level is:&nbsp;
            <strong
              className={`${styles.severityTag} ${predictionResult?.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {predictionResult || "Loading..."}
            </strong>
          </p>
        </div>
      )}
    </div>
  </div>
</>

  );
};

export default Stress;
