//'http://localhost:8080/api/users/predict/anxiety', {
import React, { useState } from "react";
import { useAuth } from '../../../context/authContext'; 
import styles from "./Anxiety.module.css";
import Sidebar from "../../../components/Sidebar";
import mentalbg from "../../../assets/mentalbg4.jpg"; // Adjust the path as needed

const questions = [
  "I was aware of dryness of my mouth.",
  "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).",
  "I experienced trembling (e.g., in the hands).",
  "I was worried about situations in which I might panic and make a fool of myself.",
  "I felt I was close to panic.",
  "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat).",
  "I felt scared without any good reason.",
  "I felt that I was using a lot of nervous energy.",
  "I found myself in situations that made me so anxious I was most relieved when they ended.",
  "I was worried about my physical health.",
  "I was concerned about the possibility of losing control of my bodily functions.",
  "I found it difficult to relax.",
  "I had a feeling of shakiness (e.g., legs going to give way).",
  "I felt I was going to faint in a public place.",
];

const Anxiety = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const mentalMenu = [
    { label: "Prediction", path: "/mental" },
    { label: "Prediction History", path: "/mental/history" },
    { label: "Progress Status", path: "/mental/progress" },
  ];

  const {token} = useAuth();
  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const next = () => {
    if (currentQuestion < questions.length - 1) {
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

      console.log("Anxiety data is: ", payload);

      const res = await fetch(
        "http://localhost:8080/api/users/predict/anxiety",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach the token
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      console.log("Prediction:", result);
      setPredictionResult(result.prediction); // Capture the prediction text
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  //ji

  return (
  <>
  <div className={styles.bgOverlay} style={{ backgroundImage: `url(${mentalbg})` }} />
  <Sidebar menuItems={mentalMenu} className="sidebar-permanent sidebar-mental" />

  <div className={styles.pageWrapper}>
    <div className={`${styles.anxietyContainer} ${isSubmitting ? styles.submitting : ''}`}>
      {!isSubmitted ? (
        <>
          <h1 className={styles.heading}>Anxiety Self-Assessment</h1>
          <p className={styles.intro}>Take a moment to reflect and respond calmly.</p>

          <div className={styles.questionCard}>
            <div className={styles.questionNumber}>
              Question {currentQuestion + 1} / {questions.length}
            </div>
            <p className={styles.questionText}>{questions[currentQuestion]}</p>

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
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>

            <div className={styles.progress}>
              {questions.map((_, i) => (
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
          <h2>Thank you 💙</h2>
          <p>Your responses were submitted successfully.</p>
          <p>
            Based on your self-assessment, your anxiety level is:&nbsp;
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

export default Anxiety;
