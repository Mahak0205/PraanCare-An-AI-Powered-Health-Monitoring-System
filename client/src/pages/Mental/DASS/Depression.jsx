import React, { useState } from "react";
import styles from "./Depression.module.css";
import { useAuth } from "../../../context/authContext";
import Sidebar from "../../../components/Sidebar";
import mentalbg from "../../../assets/mentalbg4.jpg"; // Adjust the path as needed

const depressionQuestions = [
  "I couldn't seem to experience any positive feeling at all.",
  "I couldn't seem to get any enjoyment out of the things I did.",
  "I just couldn't seem to get going.",
  "I felt down-hearted and blue.",
  "I felt that I had nothing to look forward to.",
  "I was unable to become enthusiastic about anything.",
  "I felt sad and depressed.",
  "I felt I wasn't worth much as a person.",
  "I felt that I had lost interest in just about everything.",
  "I felt I was pretty worthless.",
  "I could see nothing in the future to be hopeful about.",
  "I felt that life was meaningless.",
  "I felt that life wasn't worthwhile.",
  "I found it difficult to work up the initiative to do things.",
];

const Depression = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(depressionQuestions.length).fill(null));
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
    if (currentQuestion < depressionQuestions.length - 1) {
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

      const res = await fetch("http://localhost:8080/api/users/predict/depression", {
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
    <div className={`${styles.depressionContainer} ${isSubmitting ? styles.submitting : ''}`}>
      {!isSubmitted ? (
        <>
          <h1 className={styles.heading}>Depression Self-Assessment</h1>
          <p className={styles.intro}>Answer with honesty, your journey matters.</p>

          <div className={styles.questionCard}>
            <div className={styles.questionNumber}>
              Question {currentQuestion + 1} / {depressionQuestions.length}
            </div>
            <p className={styles.questionText}>{depressionQuestions[currentQuestion]}</p>

            <div className={styles.options}>
              {[0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  className={`${styles.option} ${answers[currentQuestion] === val ? styles.selected : ''}`}
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
                {currentQuestion === depressionQuestions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>

            <div className={styles.progress}>
              {depressionQuestions.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === currentQuestion ? styles.active : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.submissionComplete}>
          <h2>Thank you 🩷</h2>
          <p>Your responses were submitted successfully.</p>
          <p>
            Based on your self-assessment, your depression level is:&nbsp;
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

export default Depression;
