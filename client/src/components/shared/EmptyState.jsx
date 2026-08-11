import React from 'react';

const EmptyState = ({ message, children }) => (
  <div className="empty-state">
    {message && <p>{message}</p>}
    {children}
  </div>
);

export default EmptyState;
