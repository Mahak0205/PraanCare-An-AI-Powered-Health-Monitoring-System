import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleAuth, manualAuth } from '../api/auth';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/authContext';  // 🚀 NEW: AuthContext
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Pull login from context

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(form.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format.' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }

    if (!form.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }

    if (!valid) return;

    try {
      const res = await manualAuth(form);
      const { token, user } = res.data;
      login(token, user);  // ✅ Update context & redirect
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          password: 'Invalid email or password.',
        }));
      } else {
        console.log('Manual login error:', err);
      }
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const res = await googleAuth(authResult.code);
        const { token, user } = res.data;
        login(token, user);  // ✅ Same logic for Google login
      }
    } catch (err) {
      console.log('Google login error:', err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code',
  });

  return (
    <div className={styles.formBgOverlay}>
      <div className={styles.loginContainer}>
        <h2 className={styles.heading}>Login</h2>

        <form onSubmit={handleManualLogin} className={styles.loginForm}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.inputField}
          />
          {errors.email && <small className={styles.errorText}>{errors.email}</small>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.inputField}
          />
          {errors.password && <small className={styles.errorText}>{errors.password}</small>}

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        <hr className={styles.separator} />

        <p className={styles.signupText}>
          Don’t have an account?
          <button
            onClick={() => navigate('/signup')}
            className={styles.createAccountBtn}
          >
            Create Account
          </button>
        </p>

        <button className={styles.googleBtn} onClick={googleLogin}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;