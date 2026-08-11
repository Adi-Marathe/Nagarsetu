import React from 'react';

const StatCard = ({ icon, value, label, borderColor, className = '' }) => (
  <div className={`stat-card ${className}`} style={{ borderLeftColor: borderColor || 'var(--primary)' }}>
    {icon}
    <div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default StatCard;
