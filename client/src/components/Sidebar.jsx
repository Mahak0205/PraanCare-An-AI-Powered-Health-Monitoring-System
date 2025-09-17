import React from "react";
import './Sidebar.css';

const Sidebar = ({ menuItems = [], className = "sidebar-permanent" }) => (
  <aside className={className}>
    <div className="sidebar-nav">
      <button onClick={() => window.location.href = '/'}>Home</button>
      <button onClick={() => window.location.href = '/dashboard'}>Dashboard</button>
      {menuItems.map((item) => (
        <button key={item.label} onClick={() => window.location.href = item.path}>
          {item.label}
        </button>
      ))}
    </div>
    <div className="sidebar-footer">
      &copy; {new Date().getFullYear()} PraanCare
    </div>
  </aside>
);

export default Sidebar;
