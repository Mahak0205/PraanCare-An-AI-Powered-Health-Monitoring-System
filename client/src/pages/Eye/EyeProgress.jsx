// src/pages/ProgressStatus.jsx

import React, { useState, useEffect, useRef } from "react";
import styles from "./eyeProgress.module.css";
import eyeBg from "../../assets/eyebg2.jpg";
import { useAuth } from "../../context/authContext";
import Sidebar from "../../components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import html2pdf from "html2pdf.js";
import axios from "axios";

const ProgressStatus = () => {
  const { patientId, token } = useAuth();
  const [eyeReports, setEyeReports] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("charts");
  const [aiInsights, setAiInsights] = useState("");
  const reportRef = useRef();

  useEffect(() => {
    const fetchEyeHistory = async () => {
      try {
        const res = await axios.get(`/api/users/eye/history/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sorted = (res.data.history || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setEyeReports(sorted);
      } catch (err) {
        console.error("❌ Error fetching eye history:", err);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(res.data.PatientInfo);
      } catch (err) {
        console.error("❌ Error fetching user info:", err);
      }
    };

    if (token && patientId) {
      fetchEyeHistory();
      fetchUserInfo();
    }
  }, [token, patientId]);

  useEffect(() => {
    if (activeTab === "report") {
      axios
        .post(
          `/api/users/assistant/eye/${patientId}`,
          {
            type: "report insights",
            message: "Generate insights",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setAiInsights(res.data.message);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch AI insights:", err);
        });
    }
  }, [activeTab, patientId, token]);

  const exportPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: "eye_health_report.pdf",
      image: { type: "jpeg", quality: 0.75 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf().set(opt).from(element).save();
  };

  const sendByEmail = async () => {
    const input = reportRef.current;
    if (!input) return alert("❌ Report section not found.");
    input.classList.add(styles.reportSectionExport);

    try {
      const opt = {
        margin: 0.5,
        filename: "eye_health_report.pdf",
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      const worker = html2pdf().set(opt).from(input);
      const pdfBlob = await worker.outputPdf("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, "eye_health_report.pdf");

      const res = await axios.post(
        `/api/users/eye/send-report/${patientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message || "Report emailed successfully!");
    } catch (err) {
      console.error("❌ Failed to send report:", err);
      alert("Failed to send report via email.");
    } finally {
      input.classList.remove(styles.reportSectionExport);
    }
  };

  const ChartWrapper = ({ children }) => (
    <div style={{ width: "650px", height: "300px", margin: "0 auto" }}>{children}</div>
  );

  const renderCharts = () => {
    const probabilityData = eyeReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      probability: Math.round(Number(r.probability) * 100),
    }));

    const screenTimeData = eyeReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      screenTime: r.screenTime,
    }));

    const symptomsData = eyeReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      eyeStrain: r.eyeStrain.toLowerCase() === "yes" ? 1 : 0,
      eyeRedness: r.eyeRedness.toLowerCase() === "yes" ? 1 : 0,
      eyeIrritation: r.eyeIrritation.toLowerCase() === "yes" ? 1 : 0,
    }));

    return (
      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <h3>Dry Eye Prediction Confidence (%)</h3>
          <ChartWrapper>
            <LineChart data={probabilityData} width={650} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="probability" stroke="#3b82f6" />
            </LineChart>
          </ChartWrapper>
        </div>

        <div className={styles.chartCard}>
          <h3>Screen Time Over Time</h3>
          <ChartWrapper>
            <LineChart data={screenTimeData} width={650} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="screenTime" stroke="#10b981" />
            </LineChart>
          </ChartWrapper>
        </div>

        <div className={styles.chartCard}>
          <h3>Eye Symptoms Over Time</h3>
          <ChartWrapper>
            <LineChart data={symptomsData} width={650} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(v) => (v ? "Yes" : "No")} />
              <Tooltip formatter={(value, name) => [value ? "Yes" : "No", name]} />
              <Legend />
              <Line type="monotone" dataKey="eyeStrain" stroke="#f59e0b" />
              <Line type="monotone" dataKey="eyeRedness" stroke="#ef4444" />
              <Line type="monotone" dataKey="eyeIrritation" stroke="#9333ea" />
            </LineChart>
          </ChartWrapper>
        </div>
      </div>
    );
  };

  const eyeMenu = [
    { label: "Prediction", path: "/eye" },
    { label: "Prediction History", path: "/eye/history" },
    { label: "Progress Status", path: "/eye/progress" },
  ];

  return (
    <div className={styles.eyeProgressWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${eyeBg})` }}
      ></div>
      <Sidebar menuItems={eyeMenu} className="sidebar-permanent sidebar-eye" />

      <div className={styles.eyeProgressContent}>
        <h2 className={styles.title}>👁️ Eye Health Progress Dashboard</h2>

        <div className={styles.tabButtons}>
          <button
            className={activeTab === "charts" ? styles.activeTab : ""}
            onClick={() => setActiveTab("charts")}
          >
            📊 Charts & Graphs
          </button>
          <button
            className={activeTab === "report" ? styles.activeTab : ""}
            onClick={() => setActiveTab("report")}
          >
            📝 Generate Report
          </button>
          {/* <button
            className={activeTab === "ai" ? styles.activeTab : ""}
            onClick={() => setActiveTab("ai")}
          >
            🤖 Talk to AI
          </button> */}
        </div>

        {activeTab === "charts" && renderCharts()}

        {activeTab === "report" && (
          <div className={styles.reportSection} ref={reportRef}>
            <h3>📝 Eye Health Report Preview</h3>
            {userInfo && (
              <div className={styles.userInfoBox}>
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Patient ID:</strong> {userInfo.patientId}</p>
                <p><strong>Age:</strong> {userInfo.age}</p>
                <p><strong>Gender:</strong> {userInfo.gender === 1 ? "Female" : "Male"}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
              </div>
            )}
            <div className={styles.reportPlaceholder}>
              <h4>Latest Prediction</h4>
              <p>
                {eyeReports.length > 0 ? (() => {
                  const latest = [...eyeReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                  const message = latest.prediction === "1" ? "More likely to have dry eye" : "Less likely to have dry eye";
                  const confidence = Math.round(Number(latest.probability) * 100);
                  return `Most recent prediction: ${message} (Confidence: ${confidence}%)`;
                })() : "No prediction data available."}
              </p>
            </div>
            {renderCharts()}
            <div className={styles.reportPlaceholder}>
              <h4>🤖 AI Insights</h4>
              {aiInsights ? (
                aiInsights
                  .replace(/�/g, "") // Remove unwanted characters
                  .split(/[•\-–\n]/) // Split on bullets, dashes, or line breaks
                  .filter((line) => line.trim() !== "") // Remove empty lines
                  .map((line, index) => <p key={index}>👉 {line.trim()}</p>)
              ) : (
                <p>Generating insights... Please wait ⏳</p>
              )}
            </div>
            <button className={styles.exportBtn} onClick={exportPDF}>
              📄 Export to PDF
            </button>
            <button className={styles.emailBtn} onClick={sendByEmail}>
              ✉️ Send by Email
            </button>
          </div>
        )}

        {/* {activeTab === "ai" && (
          <div className={styles.aiAssistant}>
            <h3>🤖 Ask the Virtual Health Assistant</h3>
            <p>[Chat UI goes here]</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProgressStatus;
