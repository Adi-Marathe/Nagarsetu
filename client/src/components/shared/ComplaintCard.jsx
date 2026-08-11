import React from 'react';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint, onClick, statusColors = {}, statusLabels = {}, showUpvotes = true, showCitizen = true }) => (
  <div className="complaint-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="cc-top">
      <h4>{complaint.title}</h4>
      <StatusBadge
        status={complaint.status}
        colors={statusColors}
        label={statusLabels[complaint.status] || complaint.status}
      />
    </div>
    <p className="cc-desc">{complaint.description?.substring(0, 100)}...</p>
    <div className="cc-meta">
      <span className="cc-category">{complaint.category}</span>
      <span className="cc-date">{complaint.citizen?.name ? `${complaint.citizen.name} · ${new Date(complaint.createdAt).toLocaleDateString()}` : new Date(complaint.createdAt).toLocaleDateString()}</span>
      {showUpvotes && <span className="cc-upvotes">👍 {complaint.upvotes?.length || 0}</span>}
    </div>
  </div>
);

export default ComplaintCard;
