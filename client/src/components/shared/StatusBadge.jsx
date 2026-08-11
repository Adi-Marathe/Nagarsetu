import React from 'react';

const StatusBadge = ({ status, colors = {}, label, className = '' }) => {
  const color = colors[status] || '#6b7280';
  return (
    <span className={`status-badge ${className}`} style={{ background: `${color}15`, color }}>
      {label || status}
    </span>
  );
};

export default StatusBadge;
