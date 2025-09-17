import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import styles from "./SleepProgress.module.css";
import { useAuth } from "../../context/authContext";
import Sidebar from "../../components/Sidebar";
import sleepBg from "../../assets/sleepbg3.jpg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import html2pdf from "html2pdf.js";

const SleepProgress = () => {
  const { patientId, token } = useAuth();
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("charts");
  const [aiInsights, setAiInsights] = useState("");

  // PDF export function
  const reportRef = useRef(); // 🔁 Use this to target the DOM node reliably

  const exportReportToPDF = () => {
    const input = document.querySelector(`.${styles.reportSection}`);
    if (!input) {
      alert("❌ Report section not found.");
      return;
    }

    input.classList.add(styles.reportSectionExport); // ensure visibility & layout

    const opt = {
      margin: 0.5,
      filename: "Sleep_Health_Report.pdf",
      image: { type: "jpeg", quality: 0.75 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(input)
      .save()
      .then(() => {
        input.classList.remove(styles.reportSectionExport);
      });
  };

  const sendReportByEmail = async () => {
    if (!patientId || !token) {
      alert("You must be logged in to send a report.");
      return;
    }

    if (activeTab !== "report") {
      setActiveTab("report");
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    const input = reportRef.current;
    if (!input) {
      console.error("❌ Report section not found.");
      alert("Report section not found.");
      return;
    }

    input.classList.add(styles.reportSectionExport);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      const opt = {
        margin: 0.5,
        filename: "sleep_health_report.pdf",
        image: { type: "jpeg", quality: 0.6 },
        html2canvas: {
          scale: 1.2,
          useCORS: true,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      // 🧠 Trick: Intercept the Blob using `html2pdf().outputPdf('blob')`
      const worker = html2pdf().set(opt).from(input);

      const pdfBlob = await worker.outputPdf("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, "sleep_health_report.pdf");

      const res = await axios.post(
        `/api/users/sleep/send-report/${patientId}`,
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

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/api/users/sleep/history/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data.history || []);
      } catch (err) {
        console.error("Error fetching sleep history:", err);
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
        console.log("User info fetched:", res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    if (patientId) {
      fetchProgress();
      fetchUserInfo();
    }
  }, [patientId]);

  useEffect(() => {
    if (activeTab === "report") {
      axios
        .post(
          `/api/users/assistant/sleep/${patientId}`,
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
  const sleepMenu = [
    { label: "Prediction", path: "/sleep" },
    { label: "Prediction History", path: "/sleep/predictionHistory" },
    { label: "Progress Status", path: "/sleep/progress" },
  ];

  const bmiLabels = ["Underweight", "Normal", "Overweight", "Obese"];
  const COLORS = ["#60a5fa", "#34d399", "#facc15", "#f87171"];

  const bmiPieData = bmiLabels.map((label, i) => ({
    name: label,
    value: data.filter((d) => d.bmiCategory === i).length,
  }));

  const predictionCounts = {};
  data.forEach((d) => {
    predictionCounts[d.prediction] = (predictionCounts[d.prediction] || 0) + 1;
  });
  const predictionBarData = Object.keys(predictionCounts).map((pred) => ({
    name: pred,
    count: predictionCounts[pred],
  }));

  const formatDate = (tick) => new Date(tick).toLocaleDateString();

  return (
    <div className={styles.sleepProgressWrapper}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${sleepBg})` }}
      ></div>
      <Sidebar
        menuItems={sleepMenu}
        className="sidebar-permanent sidebar-sleep"
      />

      <div className={styles.sleepProgressContent}>
        <h2 className={styles.title}>📈 Sleep Progress Dashboard</h2>

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

        {activeTab === "charts" && data.length > 0 && (
          <div className={styles.chartGrid}>
            <div className={styles.chartBoxWide}>
              <h3>Sleep Duration (Recommended: 7-9 hrs)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" tickFormatter={formatDate} />
                  <YAxis
                    label={{
                      value: "Hours",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sleepDuration"
                    stroke="#60a5fa"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>Quality of Sleep (Scale: 1-10)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" tickFormatter={formatDate} />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="qualityOfSleep"
                    stroke="#9333ea"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>Stress Level (Scale: 1-5)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" tickFormatter={formatDate} />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="stressLevel"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>Heart Rate (Safe: 60-100 bpm)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" tickFormatter={formatDate} />
                  <YAxis domain={[40, 140]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>BMI Progress (Safe: 18.5–24.9)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" tickFormatter={formatDate} />
                  <YAxis domain={[10, 40]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bmiNumeric"
                    stroke="#34d399"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>BMI Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bmiPieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {bmiPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBoxWide}>
              <h3>Sleep Disorder Prediction Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictionBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6d28d9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className={styles.reportSection} ref={reportRef}>
            <h3>📝 Sleep Health Report Preview</h3>

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
                  {["Male", "Female", "Other"][userInfo.gender]}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
              </div>
            )}

            <div className={styles.reportPlaceholder}>
              <h4>🌙 Latest Sleep Prediction</h4>
              <p>
                {data.length > 0
                  ? `Most recent sleep disorder prediction (Sleep apnea/Insomnia/None): ${
                      [...data].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )[0].prediction
                    }`
                  : "No prediction data available."}
              </p>
            </div>

            <div className={styles.chartGridExport}>
              <div className={styles.chartBoxWide}>
                <h3>Sleep Duration</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis
                      label={{
                        value: "Hours",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sleepDuration"
                      stroke="#60a5fa"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>Quality of Sleep</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="qualityOfSleep"
                      stroke="#9333ea"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>Stress Level</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="stressLevel"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>Heart Rate</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis domain={[40, 140]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>BMI Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis domain={[10, 40]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bmiNumeric"
                      stroke="#34d399"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>BMI Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bmiPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {bmiPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#60a5fa", "#34d399", "#facc15", "#f87171"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBoxWide}>
                <h3>Sleep Prediction Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictionBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6d28d9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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

            <button className={styles.exportBtn} onClick={exportReportToPDF}>
              📄 Export to PDF
            </button>
            <button className={styles.emailBtn} onClick={sendReportByEmail}>
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

export default SleepProgress;
