import React, { useState } from 'react';

const AssignOfficerRow = ({ complaint, officers, departments, onAssign, onView }) => {
  const [departmentId, setDepartmentId] = useState('');
  const [officerId, setOfficerId] = useState('');

  return (
    <div className="admin-complaint-row">
      <div className="acr-info" onClick={() => onView(complaint._id)} style={{ cursor: 'pointer' }}>
        <h4>{complaint.title}</h4>
        <p>{complaint.category} · {complaint.citizen?.name} · Priority: {complaint.priority}</p>
        {complaint.department && <p style={{ marginTop: 2 }}>Suggested Dept: <strong>{complaint.department.name}</strong></p>}
      </div>
      <div className="acr-actions">
        <select value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
          <option value="">Department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select value={officerId} onChange={e => setOfficerId(e.target.value)}>
          <option value="">Select Officer</option>
          {officers.map(o => <option key={o._id} value={o._id}>{o.name} ({o.email})</option>)}
        </select>
        <button className="action-btn primary small" onClick={() => onAssign(complaint._id, officerId, departmentId)}>
          Assign
        </button>
      </div>
    </div>
  );
};

export default AssignOfficerRow;
