import React from 'react';

const LoadingState = ({ message = 'Loading...' }) => (
  <div className="loading-state">
    <div className="loading-spinner"></div>
    {message && <p style={{ marginTop: 12, color: 'var(--gray-600)' }}>{message}</p>}
  </div>
);

export default LoadingState;
