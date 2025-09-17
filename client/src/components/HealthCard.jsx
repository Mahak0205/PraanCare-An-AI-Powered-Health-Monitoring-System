import React from 'react';
import { Link } from 'react-router-dom';
import './HealthCard.css';

const HealthCard = ({ title, icon, image, link, color, description }) => {
  return (
    <Link to={link} className="health-card-link">
      <div className="health-card-horizontal" style={{ borderLeft: `6px solid ${color}` }}>
        <img src={image} alt={title} className="health-card-image" />
        <div className="health-card-content">
          <h3>{icon} {title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default HealthCard;