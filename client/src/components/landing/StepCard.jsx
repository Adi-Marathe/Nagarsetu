import React from 'react';

const StepCard = ({ number, title, description, showConnector }) => (
  <div className="step-card">
    <div className="step-number">{number}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {showConnector && <div className="step-connector" />}
  </div>
);

export default StepCard;
