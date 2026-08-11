import React from 'react';

const InfoRow = ({ label, value, className = '' }) => (
  <div className={`info-item ${className}`}>
    <span className="info-label">{label}</span>
    <span className="info-value">{value}</span>
  </div>
);

export default InfoRow;
