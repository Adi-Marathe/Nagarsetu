import React from 'react';

const SectionHeader = ({ badge, title, description }) => (
  <div className="section-header">
    {badge && <span className="section-badge">{badge}</span>}
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>
);

export default SectionHeader;
