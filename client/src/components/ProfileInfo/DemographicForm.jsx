import React, { useState } from "react";
import axios from "axios";

import styles from "./DemographicForm.module.css";

const DemographicForm = ({ onNext }) => {
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
    race: "",
    religion: "",
    education: "",
    urban: "",
    familysize: "",
    married: "",
    major: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <div className={styles.formBgOverlay}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2 className={styles.heading}>Let's Build Your Profile 🎯</h2>
        <p className={styles.statement}>
          Tell us about yourself — every detail helps us serve you better!
        </p>

        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            name="name"
            type="text"
            placeholder="Your user name"
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Age</label>
          <input
            name="age"
            type="number"
            placeholder="Your age"
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Ethnicity</label>
          <select name="race" onChange={handleChange} required>
            <option value="">Select race</option>
            <option value="10">Asian</option>
            <option value="20">Arab</option>
            <option value="30">Black</option>
            <option value="40">Indigenous Australian</option>
            <option value="50">Native American</option>
            <option value="60">White</option>
            <option value="70">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Religion</label>
          <select name="religion" onChange={handleChange} required>
            <option value="">Select religion</option>
            <option value="1">Agnostic</option>
            <option value="2">Atheist</option>
            <option value="3">Buddhist</option>
            <option value="4">Christian (Catholic)</option>
            <option value="5">Christian (Mormon)</option>
            <option value="6">Christian (Protestant)</option>
            <option value="7">Christian (Other)</option>
            <option value="8">Hindu</option>
            <option value="9">Jewish</option>
            <option value="10">Muslim</option>
            <option value="11">Sikh</option>
            <option value="12">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Education</label>
          <select name="education" onChange={handleChange} required>
            <option value="">Select education level</option>
            <option value="1">Less than high school</option>
            <option value="2">High school</option>
            <option value="3">University degree</option>
            <option value="4">Graduate degree</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Childhood Living Area</label>
          <select name="urban" onChange={handleChange} required>
            <option value="">Select area</option>
            <option value="1">Rural</option>
            <option value="2">Suburban</option>
            <option value="3">Urban</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Number of siblings you have (including yourself):</label>
          <input
            name="familysize"
            type="number"
            placeholder="Enter number"
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Marital Status</label>
          <select name="married" onChange={handleChange} required>
            <option value="">Select marital status</option>
            <option value="1">Never married</option>
            <option value="2">Currently married</option>
            <option value="3">Previously married</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Major</label>
          <select name="major" onChange={handleChange} required>
            <option value="">Select your major</option>
            <option value="0">Arts & Humanities</option>
            <option value="1">Aviation & Aerospace</option>
            <option value="2">Business & Management</option>
            <option value="3">Computer Science & IT</option>
            <option value="4">Creative Arts & Design</option>
            <option value="5">Education & Teaching</option>
            <option value="6">Engineering & Technology</option>
            <option value="7">Entertainment</option>
            <option value="8">Environmental & Agricultural Sciences</option>
            <option value="9">Finance & Accounting</option>
            <option value="10">Higher Education / Research</option>
            <option value="11">Hospitality & Culinary Arts</option>
            <option value="12">Languages & Linguistics</option>
            <option value="13">Library & Information Science</option>
            <option value="14">Mathematics & Statistics</option>
            <option value="15">Media & Communication</option>
            <option value="16">Medical Sciences</option>
            <option value="17">Meteorology & Measurement Sciences</option>
            <option value="18">Military & Security</option>
            <option value="19">Missionary & Religious Studies</option>
            <option value="20">Natural Sciences</option>
            <option value="23">Psychology & Behavioral Sciences</option>
            <option value="24">Real Estate & Valuation</option>
            <option value="25">Social Sciences</option>
            <option value="26">Sports & Physical Education</option>
            <option value="27">Therapy & Wellness</option>
            <option value="21">No Formal Education</option>
            <option value="22">Other / Unknown</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Next
        </button>
      </form>
    </div>
  );
};

export default DemographicForm;
