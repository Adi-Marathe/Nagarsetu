import React from 'react';

const TimelineItem = ({ event, isActive }) => (
  <div className={`timeline-item ${isActive ? 'active' : ''}`}>
    <div className="tl-status">{event.status?.replace('_', ' ')}</div>
    <div className="tl-message">{event.message}</div>
    {event.updatedBy?.name && <div className="tl-user">by {event.updatedBy.name}</div>}
    <div className="tl-time">{new Date(event.timestamp).toLocaleString()}</div>
  </div>
);

export default TimelineItem;
