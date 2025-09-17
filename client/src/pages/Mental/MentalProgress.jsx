// src/pages/ProgressStatus.jsx

import React, { useState, useEffect, useRef } from "react";
import mentalBg from "../../assets/mentalbg4.jpg";
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
import styles from "./MentalProgress.module.css";

const ProgressStatus = () => {
  const { patientId, token } = useAuth();

  const [depressionData, setDepressionData] = useState([]);
  const [anxietyData, setAnxietyData] = useState([]);
  const [stressData, setStressData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("charts");
  const [aiInsights, setAiInsights] = useState(""); // 🧠 Groq assistant response

  const reportRef = useRef();

  useEffect(() => {
    const fetchMentalHistory = async () => {
      try {
        const res = await axios.get(`/api/users/mental/history/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { depressionHistory, anxietyHistory, stressHistory } = res.data;
        setDepressionData(depressionHistory || []);
        setAnxietyData(anxietyHistory || []);
        setStressData(stressHistory || []);
      } catch (err) {
        console.error("❌ Error fetching mental history:", err);
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
      fetchMentalHistory();
      fetchUserInfo();
    }
  }, [token, patientId]); // Fetch mental health data and user info

  useEffect(() => {
    if (activeTab === "report") {
      axios
        .post(
          `/api/users/assistant/mental/${patientId}`,
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
  }, [activeTab, patientId, token]); // Fetch AI insights when report tab is active

  const formatGraphData = (data, key) => {
    const severityMap = {
      Normal: 0,
      Mild: 1,
      Moderate: 2,
      Severe: 3,
      "Extremely Severe": 4,
    };

    return data.map((entry) => {
      const raw = entry[key];
      const numericValue = severityMap[raw] ?? null;
      return {
        date: new Date(entry.createdAt).toLocaleDateString(),
        value: numericValue,
      };
    });
  };

  const exportPDF = () => {
    const element = reportRef.current;
    html2pdf().from(element).save("MentalHealthReport.pdf");
  };

  const sendByEmail = async () => {
    const input = reportRef.current;
    if (!input) {
      alert("❌ Report section not found.");
      return;
    }

    input.classList.add(styles.reportSectionExport);

    try {
      const opt = {
        margin: 0.5,
        filename: "mental_health_report.pdf",
        image: { type: "jpeg", quality: 0.75 },
        html2canvas: { scale: 1.5, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      const worker = html2pdf().set(opt).from(input);
      const pdfBlob = await worker.outputPdf("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, "mental_health_report.pdf");

      const res = await axios.post(
        `/api/users/mental/send-report/${patientId}`,
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

  const renderCharts = () => (
    <div className={styles.chartSection}>
      <div className={styles.chartCard}>
        <h3>Depression Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatGraphData(depressionData, "depression")}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(val) => {
                const reverseMap = [
                  "Normal (0)",
                  "Mild (1)",
                  "Moderate (2)",
                  "Severe (3)",
                  "Extreme Severe (4)",
                ];
                return reverseMap[val] ?? "";
              }}
              domain={[0, 4]}
              tick={{ fontSize: 10 }} // smaller labels
              width={120} // more space for long labels
            />

            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartCard}>
        <h3>Anxiety Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatGraphData(anxietyData, "anxiety")}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(val) => {
                const reverseMap = [
                  "Normal (0)",
                  "Mild (1)",
                  "Moderate (2)",
                  "Severe (3)",
                  "Extreme Severe (4)",
                ];
                return reverseMap[val] ?? "";
              }}
              domain={[0, 4]}
              tick={{ fontSize: 10 }} // smaller labels
              width={120} // more space for long labels
            />

            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartCard}>
        <h3>Stress Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatGraphData(stressData, "stress")}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(val) => {
                const reverseMap = [
                  "Normal (0)",
                  "Mild (1)",
                  "Moderate (2)",
                  "Severe (3)",
                  "Extreme Severe (4)",
                ];
                return reverseMap[val] ?? "";
              }}
              domain={[0, 4]}
              tick={{ fontSize: 10 }} // smaller labels
              width={120} // more space for long labels
            />

            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  const mentalMenu = [
    { label: "Prediction", path: "/mental" },
    { label: "Prediction History", path: "/mental/history" },
    { label: "Progress Status", path: "/mental/progress" },
  ];

  return (
    <div className={styles.mentalProgressWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${mentalBg})` }}
      ></div>
      <Sidebar
        menuItems={mentalMenu}
        className="sidebar-permanent sidebar-mental"
      />
      <div className={styles.mentalProgressContent}>
        <h2 className={styles.title}>🧠 Mental Health Progress Dashboard</h2>

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
            <h3>📝 Mental Health Report Preview</h3>
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
              <h4>🧠 Latest Predictions</h4>
              <p>
                <strong>Depression:</strong>{" "}
                {depressionData[0]?.depression || "N/A"}
              </p>
              <p>
                <strong>Anxiety:</strong> {anxietyData[0]?.anxiety || "N/A"}
              </p>
              <p>
                <strong>Stress:</strong> {stressData[0]?.stress || "N/A"}
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
