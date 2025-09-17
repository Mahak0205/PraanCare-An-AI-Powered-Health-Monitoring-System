import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import {
  genderMap,
  raceMap,
  religionMap,
  educationMap,
  urbanMap,
  maritalMap,
  majorMap,
} from "./labelMaps";
import PersonalityForm from "../../components/ProfileInfo/PersonalityForm";

import styles from "./Profile.module.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { token, patientId, isnew } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPersonalityForm, setShowPersonalityForm] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setUserInfo(null); // Reset if user logs out
    }
  }, [patientId]);

  useEffect(() => {
  const fetchUserInfo = async () => {
    console.log("🟡 Inside fetchUserInfo");

    if (!token || !patientId) {
      console.warn("🔴 Missing token or patientId");
      return;
    }

    console.log("🟢 Fetching with token:", token.slice(0, 10), "...", "and patientId:", patientId);

    setLoading(true);
    setUserInfo(null);
    setFormData({});

    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/profile/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data?.PatientInfo;
      console.log("✅ Response received:", data);

      if (data) {
        setUserInfo(data);
        setFormData(data);
      } else {
        console.warn("⚠️ No PatientInfo found in response");
      }

    } catch (err) {
      console.error("❌ Error while fetching user info:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("📌 useEffect running with token:", token?.slice(0, 10), "... patientId:", patientId);
  console.log("📌 userInfo is:", userInfo);

  if (token && patientId) {
    fetchUserInfo();
  } else {
    console.log("⏭️ Skipping fetch: token or patientId not ready.");
  }

}, [token, patientId]); // <-- removed userInfo from dependency list



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/update/${patientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully!");
      setUserInfo(formData); // update UI
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      alert("Failed to update profile.");
    }
  };

  const {
    name,
    email,
    age,
    gender,
    occupation,
    education,
    religion,
    race,
    urban,
    married,
    familysize,
    major,
    personality,
    image,
  } = formData;

  if (loading || !userInfo) {
    console.log("loading = ", loading);
    console.log("user data = ", userInfo);
    return <div className={styles.container}>Loading user data...</div>;
  }

  const handlePersonalitySubmit = async (traitData) => {
    try {
      console.log("sending data to backend....", traitData);
      const response = await axios.put(
        `http://localhost:8080/api/users/update/retake-personality-test/${patientId}`,
        traitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Personality traits updated successfully!");
      setUserInfo((prev) => ({ ...prev, ...traitData }));
      setShowPersonalityForm(false);
    } catch (error) {
      console.error("Error updating personality:", error);
      alert("An error occurred while updating personality traits.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.backWrapper}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className={styles.heading}>User Profile</h2>

      <div className={styles.card}>
        {image && <img src={image} alt="Profile" className={styles.avatar} />}
        {patientId && <strong className={styles.patientId}>Patient ID: {patientId}</strong>}

        {/* EDIT / SAVE Toggle */}
        <div className={styles.editWrapper}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSave} className={styles.editButton}>
              Save
            </button>
          )}
        </div>

        <div className={styles.section}>
          <h3>Basic Details</h3>
          {isEditing ? (
            <>
              <p>
                <strong>Name:</strong>{" "}
                <input name="name" value={name} onChange={handleInputChange} />
              </p>
              {/* <p>
                <strong>Occupation:</strong>{" "}
                <input
                  name="occupation"
                  value={occupation}
                  onChange={handleInputChange}
                />
              </p> */}
              <p>
                <strong>Age:</strong>{" "}
                <input
                  name="age"
                  type="number"
                  value={age}
                  onChange={handleInputChange}
                />
              </p>
              <p>
                <strong>Gender:</strong>
                <select
                  name="gender"
                  value={gender}
                  onChange={handleInputChange}
                >
                  {Object.keys(genderMap).map((key) => (
                    <option key={key} value={key}>
                      {genderMap[key]}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Urban/Rural:</strong>
                <select name="urban" value={urban} onChange={handleInputChange}>
                  {Object.keys(urbanMap).map((key) => (
                    <option key={key} value={key}>
                      {urbanMap[key]}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Marital Status:</strong>
                <select
                  name="married"
                  value={married}
                  onChange={handleInputChange}
                >
                  {Object.keys(maritalMap).map((key) => (
                    <option key={key} value={key}>
                      {maritalMap[key]}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Family Size:</strong>{" "}
                <input
                  name="familysize"
                  value={familysize}
                  onChange={handleInputChange}
                />
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Age:</strong> {age}
              </p>
              <p>
                <strong>Gender:</strong> {genderMap[gender]}
              </p>
              <p>
                <strong>Urban/Rural:</strong> {urbanMap[urban]}
              </p>
              <p>
                <strong>Marital Status:</strong> {maritalMap[married]}
              </p>
              <p>
                <strong>Family Size:</strong> {familysize}
              </p>
            </>
          )}
        </div>

        <div className={styles.section}>
          <h3>Education Details</h3>
          {isEditing ? (
            <>
              <p>
                <strong>Education:</strong>
                <select
                  name="education"
                  value={education}
                  onChange={handleInputChange}
                >
                  {Object.keys(educationMap).map((key) => (
                    <option key={key} value={key}>
                      {educationMap[key]}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Major Field:</strong>
                <select name="major" value={major} onChange={handleInputChange}>
                  {Object.keys(majorMap).map((key) => (
                    <option key={key} value={key}>
                      {majorMap[key]}
                    </option>
                  ))}
                </select>
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Education:</strong> {educationMap[education]}
              </p>
              <p>
                <strong>Major Field:</strong> {majorMap[major]}
              </p>
            </>
          )}
        </div>

        <div className={styles.section}>
          <h3>Demographics</h3>
          {isEditing ? (
            <>
              <p>
                <strong>Ethnicity:</strong>
                <select name="race" value={race} onChange={handleInputChange}>
                  {Object.keys(raceMap).map((key) => (
                    <option key={key} value={key}>
                      {raceMap[key]}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Religion:</strong>
                <select
                  name="religion"
                  value={religion}
                  onChange={handleInputChange}
                >
                  {Object.keys(religionMap).map((key) => (
                    <option key={key} value={key}>
                      {religionMap[key]}
                    </option>
                  ))}
                </select>
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Ethnicity:</strong> {raceMap[race]}
              </p>
              <p>
                <strong>Religion:</strong> {religionMap[religion]}
              </p>
            </>
          )}
        </div>

        {/* Retake Personality Test (unchanged) */}
        <div className={styles.editWrapper}>
          <button
            className={styles.retakeButton}
            onClick={() => {
              console.log("Retake Personality clicked");
              setShowPersonalityForm(true);
            }}
          >
            Retake Personality Test
          </button>
        </div>
      </div>
      {showPersonalityForm && (
        <PersonalityForm
          onSubmit={handlePersonalitySubmit}
          onBack={() => setShowPersonalityForm(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
