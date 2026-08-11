import React from 'react';

const WorkAssignmentRow = ({ complaint, onView, onStartWork, onResolve, statusColors, statusLabels }) => (
  <div className="officer-work-row">
    <div className="owr-info" onClick={() => onView(complaint._id)} style={{ cursor: 'pointer' }}>
      <div className="owr-top">
        <h4>{complaint.title}</h4>
        <span className="status-badge" style={{ background: `${statusColors[complaint.status]}15`, color: statusColors[complaint.status] }}>
          {statusLabels[complaint.status]}
        </span>
      </div>
      <p className="owr-desc">{complaint.description?.substring(0, 100)}...</p>
      <div className="cc-meta">
        <span className="cc-category">{complaint.category}</span>
        <span className="cc-date">By: {complaint.citizen?.name} · {new Date(complaint.createdAt).toLocaleDateString()}</span>
        <span className="cc-date" style={{ fontWeight: 600 }}>Priority: {complaint.priority}</span>
      </div>
    </div>
    <div className="owr-actions">
      {complaint.status === 'assigned' && (
        <button className="action-btn primary small" onClick={() => onStartWork(complaint._id)}>
          Start Work
        </button>
      )}
      {complaint.status === 'in_progress' && (
        <button className="action-btn success small" onClick={() => onResolve(complaint._id)}>
          Mark Resolved
        </button>
      )}
      {['resolved', 'closed'].includes(complaint.status) && (
        <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>✓ Completed</span>
      )}
    </div>
  </div>
);

export default WorkAssignmentRow;
