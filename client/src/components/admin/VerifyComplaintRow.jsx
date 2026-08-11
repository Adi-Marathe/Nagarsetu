import React, { useState } from 'react';

const VerifyComplaintRow = ({ complaint, onVerify, onView }) => {
  const [priority, setPriority] = useState(complaint.priority || 'medium');

  return (
    <div className="admin-complaint-row">
      <div className="acr-info" onClick={() => onView?.(complaint._id)} style={{ cursor: 'pointer' }}>
        <h4>{complaint.title}</h4>
        <p>{complaint.category} · {complaint.citizen?.name} · {new Date(complaint.createdAt).toLocaleDateString()}</p>
        <p style={{ marginTop: 4 }}>{complaint.description?.substring(0, 100)}...</p>
      </div>
      <div className="acr-actions">
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="critical">Critical</option>
        </select>
        <button className="action-btn success small" onClick={() => onVerify(complaint._id, priority)}>
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyComplaintRow;
