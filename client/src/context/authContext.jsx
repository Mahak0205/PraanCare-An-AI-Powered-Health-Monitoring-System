// Import React tools and hooks
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context object
const AuthContext = createContext();

// Provider component that wraps your app
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // For handling redirects
  const [token, setToken] = useState(null); // Local auth state
  const [patientId, setPatientId] = useState(null); // Local patient ID state
  //const [user, setUser] = useState(null); // Holds current user's profile
  const[isnew, setnew] = useState(true);

  // const [isBasicInfoReq, setNeedsBasicInfo] = useState(false);
  // const [isPersonalityReq, setNeedsPersonality] = useState(false);

  // Load token from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("user-info"); // Get raw JSON string
    if (stored) {
      try {
        const parsed = JSON.parse(stored); // Parse the string into an object
        setToken(parsed.token || null); // Save token in state if it exists
        setPatientId(parsed.patientId || null); // Save patientId in state if it exists
      } catch (e) {
        console.error("Invalid user-info JSON:", e); // Catch bad formatting or parsing errors
        setToken(null); // Clear token state
      }
    }
  }, []);

  // Login function: saves token to localStorage and sets state
  const login = async (tokenFromAPI, userInfo = {}) => {
    if (!tokenFromAPI) return;
    const payload = { ...userInfo, token: tokenFromAPI }; // ✅ store token + user together
    localStorage.setItem("user-info", JSON.stringify(payload));
    setToken(tokenFromAPI);
    try {
      // 2. Fetch user profile to check what's missing
      const res = await axios.get(
        "http://localhost:8080/api/users/checkInfoComplete",
        {
          headers: {
            Authorization: `Bearer ${tokenFromAPI}`,
          },
        }
      );

      console.log("res.data: ", res.data);

      //setUser({ ...userInfo, ...res.data });

      const { needsBasicInfo, needsPersonality } = res.data;
      console.log("needs Basic Info: ", needsBasicInfo);
      console.log("needs Personality Info: ", needsPersonality);

      // setNeedsBasicInfo(needsBasicInfo);
      // setNeedsPersonality(needsPersonality);

      // 3. Redirect logic
      if (needsBasicInfo) {
        navigate("/basicinfo");
      }
      else if (needsPersonality) {
        navigate("/personality");
      }
      else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error fetching user profile after login:", err);
      navigate("/dashboard"); // fallback in case of failure
    }
  };

  // Logout: clear localStorage, state, and redirect
  const logout = () => {
    localStorage.removeItem("user-info");
    setToken(null);
    setPatientId(null);
    navigate("/login");
  };

  // Boolean flag: true if user is logged in
  const isAuthenticated = !!token;

  // Provide all values to components below
  return (
    <AuthContext.Provider value={{ token, patientId,isAuthenticated, isnew, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to context values
export const useAuth = () => useContext(AuthContext);
