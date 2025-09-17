// src/pages/CardiacProgress.jsx

import React, { useState, useEffect, useRef } from "react";
import styles from "./cardiacProgress.module.css";
import cardiacBg from "../../assets/cardiacbg4.jpg";
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
  ResponsiveContainer,
} from "recharts";
import html2pdf from "html2pdf.js";
import axios from "axios";

const CardiacProgress = () => {
  const { patientId, token } = useAuth();
  const [cardiacReports, setCardiacReports] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("charts");
  const [aiInsights, setAiInsights] = useState("");
  const reportRef = useRef();

  useEffect(() => {
    const fetchCardiacHistory = async () => {
      try {
        const res = await axios.get(`/api/users/cardiac/history/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = (res.data.history || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        console.log("✅ Fetched cardiac history:", sorted);
        setCardiacReports(sorted);
      } catch (err) {
        console.error("❌ Error fetching cardiac history:", err);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(res.data.PatientInfo);
      } catch (err) {
        console.error("❌ Error fetching user info:", err);
      }
    };

    if (token && patientId) {
      fetchCardiacHistory();
      fetchUserInfo();
    }
  }, [token, patientId]);

  useEffect(() => {
    if (activeTab === "report") {
      axios
        .post(
          `/api/users/assistant/cardiac/${patientId}`,
          { type: "report insights", message: "Generate insights" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setAiInsights(res.data.message))
        .catch((err) => console.error("❌ Failed to fetch AI insights:", err));
    }
  }, [activeTab, patientId, token]);

  const exportPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.5,
      filename: "cardiac_health_report.pdf",
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
        filename: "cardiac_health_report.pdf",
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      const worker = html2pdf().set(opt).from(input);
      const pdfBlob = await worker.outputPdf("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, "cardiac_health_report.pdf");

      const res = await axios.post(
        `/api/users/cardiac/send-report/${patientId}`,
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
      console.error("❌ Failed to send report by email:", err);
      alert("Failed to send report via email.");
    } finally {
      input.classList.remove(styles.reportSectionExport);
    }
  };

  const renderCharts = () => {
    const probabilityData = cardiacReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      confidence: Math.round(Number(r.probability) * 100),
    }));

    const bpHeartRateData = cardiacReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      restingBP: r.restingBP,
      maxHeartRate: r.maxHeartRate,
    }));

    const cholesterolData = cardiacReports.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN"),
      cholesterol: r.cholesterol,
      oldpeak: r.oldpeak,
    }));

    return (
      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <h3>Prediction Confidence (%)</h3>
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={probabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="confidence" stroke="#dc2626" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Resting BP & Max Heart Rate</h3>
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpHeartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="restingBP" stroke="#2563eb" />
                <Line type="monotone" dataKey="maxHeartRate" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Cholesterol & Oldpeak</h3>
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cholesterolData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cholesterol" stroke="#f97316" />
                <Line type="monotone" dataKey="oldpeak" stroke="#7c3aed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const cardiacMenu = [
    { label: "Prediction", path: "/cardiac" },
    { label: "Prediction History", path: "/cardiac/history" },
    { label: "Progress Status", path: "/cardiac/progress" },
  ];

  return (
    <div className={styles.cardiacProgressWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${cardiacBg})` }}
      ></div>
      <Sidebar
        menuItems={cardiacMenu}
        className="sidebar-permanent sidebar-cardiac"
      />

      <div className={styles.cardiacProgressContent}>
        <h2 className={styles.title}>🫀 Cardiac Health Progress Dashboard</h2>

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
            <h3>📝 Cardiac Health Report Preview</h3>
            {userInfo && (
              <div className={styles.userInfoBox}>
                <p>
                  <strong>Name:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Patient ID:</strong> {userInfo.patientId}
                </p>
                <p>
                  <strong>Age:</strong> {userInfo.age}
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  {userInfo.gender === 1 ? "Female" : "Male"}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
              </div>
            )}
            <div className={styles.reportPlaceholder}>
              <h4>Latest Prediction</h4>
              <p>
                {cardiacReports.length > 0
                  ? (() => {
                      const latest = [...cardiacReports].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )[0];
                      const message =
                        latest.prediction === "1"
                          ? "More likely to have cardiac issue"
                          : "Less likely to have cardiac issue";
                      const confidence = Math.round(
                        Number(latest.probability) * 100
                      );
                      return `Most recent prediction: ${message} (Confidence: ${confidence}%)`;
                    })()
                  : "No prediction data available."}
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
              📧 Send Report by Email
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

export default CardiacProgress;
