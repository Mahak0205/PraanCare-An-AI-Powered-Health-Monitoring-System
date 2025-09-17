import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";  // ⬅️ new context import

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();  // ⬅️ pull from context

  const handleLogout = () => {
    logout();  // ⬅️ no need to pass navigate, context handles it
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        PraanCare
      </div>

      {isAuthenticated ? (
        <ul className="navbar-right">
          <li onClick={() => navigate("/profile")}>User Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      ) : (
        <ul className="navbar-right">
          <li onClick={() => navigate("/cardiac-info")}>Cardiac</li>
          <li onClick={() => navigate("/eye-info")}>Eye</li>
          <li onClick={() => navigate("/mental-info")}>Mental Wellbeing</li>
          <li onClick={() => navigate("/sleep-info")}>Sleep</li>
          <button className="try-btn" onClick={() => navigate("/signup")}>
            Try Us
          </button>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;