import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signupUser } from '../api/auth';
import styles from './SignUp.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let valid = true;

    // Email validation
    if (!validateEmail(form.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format.' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }

    // Password validation
    if (!validatePasswordStrength(form.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }

    if (!valid) return;

    try {
      const res = await signupUser(form);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed. Email may already be registered.');
    }
  };

  return (
    <div className={styles.formBgOverlay}>
      <div className={styles.authBox}>
        <h2 className={styles.heading}>Create Account</h2>

        <form onSubmit={handleSignup} className={styles.signupForm}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.inputField}
            required
          />
          {errors.email && <small className={styles.errorText}>{errors.email}</small>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.inputField}
            required
          />
          {errors.password && (
            <small className={styles.errorText}>{errors.password}</small>
          )}

          <button type="submit" className={styles.signupBtn}>
            Sign Up
          </button>

          <p className={styles.loginPrompt}>
            Already have an account?
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={styles.loginBtn}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
