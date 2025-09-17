// src/pages/MentalHistory.jsx

import React, { useEffect, useState } from "react";
import styles from "./MentalHistory.module.css";
import { useAuth } from "../../context/authContext";
import Sidebar from "../../components/Sidebar";
import mentalBg from "../../assets/mentalbg4.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const MentalHistory = () => {
  const { token, patientId } = useAuth(); // ✅ patientId from context
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const mentalMenu = [
    { label: "Prediction", path: "/mental" },
    { label: "Prediction History", path: "/mental/history" },
    { label: "Progress Status", path: "/mental/progress" },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId || !token) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/mental/history/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Mental history fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId, token]);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const userName = userInfo?.name || "Patient";
    const email = userInfo?.email || "N/A";
    const id = patientId || "Unknown";

    doc.setFontSize(20);
    doc.setTextColor(255, 115, 0); // orange
    doc.setFont("helvetica", "bold");
    doc.text("🧠 PraanCare Mental Health Report", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${userName}`, 14, 30);
    doc.text(`Email: ${email}`, 14, 36);
    doc.text(`Patient ID: ${id}`, 14, 42);

    const addTable = (title, records, key, startY) => {
      const tableRows = records.map((entry) => [
        new Date(entry.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        entry[key],
      ]);

      autoTable(doc, {
        startY,
        head: [[`${title} Date`, `${title} Result`]],
        body: tableRows,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [255, 115, 0], textColor: 255 }, // orange
        alternateRowStyles: { fillColor: [255, 243, 224] }, // light beige
        margin: { left: 14, right: 14 },
      });
    };

    let currentY = 50;
    if (history?.depressionHistory?.length) {
      addTable("Depression", history.depressionHistory, "depression", currentY);
      currentY = doc.lastAutoTable.finalY + 10;
    }
    if (history?.anxietyHistory?.length) {
      addTable("Anxiety", history.anxietyHistory, "anxiety", currentY);
      currentY = doc.lastAutoTable.finalY + 10;
    }
    if (history?.stressHistory?.length) {
      addTable("Stress", history.stressHistory, "stress", currentY);
      currentY = doc.lastAutoTable.finalY + 10;
    } 

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "“Your mental health is a priority. PraanCare is here for you.”",
      14,
      currentY + 10
    );
    doc.save(`PraanCare_Mental_Report_${userName}.pdf`);
  };

  const clearHistory = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to delete your mental health history?"
    );
    if (!confirmClear) return;

    try {
      await axios.delete(`/api/users/mental/history/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory({
        depressionHistory: [],
        anxietyHistory: [],
        stressHistory: [],
      });
      alert("✅ Mental health history cleared!");
    } catch (err) {
      console.error("❌ Error clearing mental history:", err);
      alert("Failed to clear mental history.");
    }
  };

  const renderTable = (title, records, key) => (
  <div className={styles.tableSection}>
    <h2 className={`${styles.sectionTitle} ${styles[key]}`}>{title} History</h2>
    {records && records.length > 0 ? (
      <>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, idx) => (
              <tr key={idx}>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <span
                    className={`${styles.tag} ${
                      styles[item[key]?.toLowerCase()]
                    }`}
                  >
                    {item[key]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <p className={styles.noData}>No records found.</p>
    )}
  </div>
);


  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.mentalHistorycontainer}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${mentalBg})` }}
      ></div>

      <Sidebar
        menuItems={mentalMenu}
        className="sidebar-permanent sidebar-mental"
      />

      <h1 className={styles.pageTitle}>🧾 Mental Health History</h1>
      <div className={styles.actionButtons}>
            <button onClick={exportToPDF} className={styles.btnExport}>
              📄 Export to PDF
            </button>
            <button onClick={clearHistory} className={styles.btnClear}>
              🗑️ Clear History
            </button>
          </div>
      {renderTable("Depression", history?.depressionHistory, "depression")}
      {renderTable("Anxiety", history?.anxietyHistory, "anxiety")}
      {renderTable("Stress", history?.stressHistory, "stress")}
    </div>
  );
};

export default MentalHistory;
