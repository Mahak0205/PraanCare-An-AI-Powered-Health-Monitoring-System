// src/App.jsx
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Home";
import Refresh from "./pages/RefreshHandler";
import CardiacInfo from "./pages/ParameterInfoPages/CardiacInfo";
import SleepInfo from "./pages/ParameterInfoPages/SleepInfo";
import MentalInfo from "./pages/ParameterInfoPages/MentalInfo";
import EyeInfo from "./pages/ParameterInfoPages/EyeInfo";
import ProfilePage from "./pages/UserProfile/Profile";

import Cardiac from "./pages/Cardiac/Cardiac";
import CardiacHistory from "./pages/Cardiac/CardiacHistory";
import CardiacProgress from "./pages/Cardiac/CardiacProgress";

import Sleep from "./pages/Sleep/Sleep";
import SleepHistory from "./pages/Sleep/SleepHistory";
import SleepProgress from "./pages/Sleep/SleepProgress";

import Mental from "./pages/Mental/Mental";
import MentalHistory from "./pages/Mental/MentalHistory";
import MentalProgress from "./pages/Mental/MentalProgress";
import Depression from "./pages/Mental/DASS/Depression";
import Anxiety from "./pages/Mental/DASS/Anxiety";
import Stress from "./pages/Mental/DASS/Stress";

import Eye from "./pages/Eye/Eye";
import EyeHistory from "./pages/Eye/EyeHistory";
import EyeProgress from "./pages/Eye/EyeProgress";


import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import BasicInfo from "./pages/BasicInfo";
import PersonalityInfo from "./pages/PersonalityInfo";

import "./App.css"; // Import your CSS file for global styles

const App = () => {
  const navigate = useNavigate(); // <-- This will now work correctly

  // useEffect(() => {
  //   const isFirstLoadInSession = sessionStorage.getItem("isFirstLoadOfApp");
  //   const currentPath = window.location.pathname;

  //   if (
  //     !isFirstLoadInSession &&
  //     currentPath !== "/login" &&
  //     currentPath !== "/signup"
  //   ) {
  //     console.log("New client-side session detected. Clearing localStorage.");
  //     localStorage.removeItem("userInfo");
  //     sessionStorage.setItem("isFirstLoadOfApp", "true");
  //     navigate("/login");
  //   } else {
  //     console.log(
  //       "Page refreshed within the same session. localStorage remains."
  //     );
  //   }
  // }, []); // ✅ empty dependency array prevents reruns

  const cId = import.meta.env.VITE_CLIENT_ID;
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const token = userInfo?.token;

  const location = useLocation();
  // Only show sidebar on /mental, /mental/*, /sleep, /sleep/*
  const showSidebarOnRoute =
    token &&
    (location.pathname.startsWith("/mental") ||
      location.pathname.startsWith("/sleep"));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <GoogleOAuthProvider clientId={cId}>
      <Navbar />
      {showSidebarOnRoute && <Sidebar />}
      <Refresh>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cardiac-info" element={<CardiacInfo />} />
            <Route path="/sleep-info" element={<SleepInfo />} />
            <Route path="/mental-info" element={<MentalInfo />} />
            <Route path="/eye-info" element={<EyeInfo />} />

            <Route
              path="/basicinfo"
              element={
                <PrivateRoute>
                  <BasicInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/personality"
              element={
                <PrivateRoute>
                  <PersonalityInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/cardiac"
              element={
                <PrivateRoute>
                  <Cardiac />
                </PrivateRoute>
              }
            />

            <Route
              path="/cardiac/history"
              element={
                <PrivateRoute>
                  <CardiacHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/cardiac/progress"
              element={
                <PrivateRoute>
                  <CardiacProgress />
                </PrivateRoute>
              }
            />

            <Route
              path="/sleep"
              element={
                <PrivateRoute>
                  <Sleep />
                </PrivateRoute>
              }
            />
            <Route
              path="/sleep/predictionHistory"
              element={
                <PrivateRoute>
                  <SleepHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/sleep/progress"
              element={
                <PrivateRoute>
                  <SleepProgress />
                </PrivateRoute>
              }
            />

            <Route
              path="/mental"
              element={
                <PrivateRoute>
                  <Mental />
                </PrivateRoute>
              }
            />
            <Route
              path="/mental/history"
              element={
                <PrivateRoute>
                  <MentalHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/mental/progress"
              element={
                <PrivateRoute>
                  <MentalProgress />
                </PrivateRoute>
              }
            />
            <Route
              path="/mental/depression"
              element={
                <PrivateRoute>
                  <Depression />
                </PrivateRoute>
              }
            />
            <Route
              path="/mental/anxiety"
              element={
                <PrivateRoute>
                  <Anxiety />
                </PrivateRoute>
              }
            />
            <Route
              path="/mental/stress"
              element={
                <PrivateRoute>
                  <Stress />
                </PrivateRoute>
              }
            />

            <Route
              path="/eye"
              element={
                <PrivateRoute>
                  <Eye />
                </PrivateRoute>
              }
            />
            <Route
              path="/eye/history"
              element={
                <PrivateRoute>
                  <EyeHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/eye/progress"
              element={
                <PrivateRoute>
                  <EyeProgress />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Refresh>
    </GoogleOAuthProvider>
  );
};

export default App;
