import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { complaintAPI, commentAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ThumbsUp, ArrowLeft, Send, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StatusBadge from '../../components/shared/StatusBadge';
import CommentItem from '../../components/shared/CommentItem';
import InfoRow from '../../components/shared/InfoRow';
import TimelineItem from '../../components/shared/TimelineItem';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';
import './Citizen.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusColors = { submitted: '#f59e0b', verified: '#3b82f6', assigned: '#8b5cf6', in_progress: '#ff7426', resolved: '#10b981', closed: '#6b7280' };
const statusLabels = { submitted: 'Submitted', verified: 'Verified', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [compRes, commRes] = await Promise.all([
        complaintAPI.getById(id),
        commentAPI.getAll(id)
      ]);
      setComplaint(compRes.data);
      setComments(commRes.data);
    } catch (e) { toast.error('Failed to load complaint'); }
    finally { setLoading(false); }
  };

  const handleUpvote = async () => {
    try {
      const { data } = await complaintAPI.upvote(id);
      setComplaint(prev => ({
        ...prev,
        upvotes: data.hasUpvoted
          ? [...(prev.upvotes || []), user._id]
          : (prev.upvotes || []).filter(u => u !== user._id)
      }));
    } catch (e) {}
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await commentAPI.add(id, { text: newComment });
      setComments(prev => [...prev, data]);
      setNewComment('');
    } catch (e) { toast.error('Failed to add comment'); }
  };

  const handleFeedback = async () => {
    if (!feedbackRating) { toast.error('Please select a rating'); return; }
    try {
      await complaintAPI.addFeedback(id, { rating: feedbackRating, comment: feedbackComment });
      toast.success('Feedback submitted! Thank you.');
      fetchData();
    } catch (e) { toast.error('Failed to submit feedback'); }
  };

  if (loading) return <DashboardLayout><LoadingState /></DashboardLayout>;
  if (!complaint) return <DashboardLayout><EmptyState message="Complaint not found" /></DashboardLayout>;

  const hasUpvoted = complaint.upvotes?.includes(user?._id);
  const hasLocation = complaint.location?.lat && complaint.location?.lng;

  return (
    <DashboardLayout>
      <div className="citizen-page">
        <button onClick={() => navigate(-1)} className="action-btn outline" style={{ marginBottom: 20, padding: '8px 16px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-grid">
          <div className="detail-main">
            {/* Header */}
            <div className="detail-card">
              <div className="cc-top" style={{ marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>{complaint.title}</h2>
                  <span className="cc-category">{complaint.category}</span>
                </div>
                <span className="status-badge" style={{ background: `${statusColors[complaint.status]}15`, color: statusColors[complaint.status], fontSize: '0.85rem', padding: '6px 16px' }}>
                  {statusLabels[complaint.status]}
                </span>
              </div>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '0.92rem' }}>{complaint.description}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
                <button className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`} onClick={handleUpvote}>
                  <ThumbsUp size={16} /> {complaint.upvotes?.length || 0} Upvotes
                </button>
              </div>
            </div>

            {/* Images */}
            {complaint.images?.length > 0 && (
              <div className="detail-card">
                <h3>Attached Photos</h3>
                <div className="image-previews" style={{ gap: 16 }}>
                  {complaint.images.map((img, i) => (
                    <div key={i} style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden' }}>
                      <img src={img} alt={`Issue ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {hasLocation && (
              <div className="detail-card">
                <h3>Issue Location</h3>
                <div className="map-container" style={{ height: 250 }}>
                  <MapContainer center={[complaint.location.lat, complaint.location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <Marker position={[complaint.location.lat, complaint.location.lng]} />
                  </MapContainer>
                </div>
                {complaint.location.address && <p className="map-hint" style={{ marginTop: 10 }}>📍 {complaint.location.address}</p>}
              </div>
            )}

            {/* Comments */}
            <div className="detail-card comments-section">
              <h3>Comments ({comments.length})</h3>
              <div className="comment-list">
                {comments.map(c => (
                  <CommentItem key={c._id} comment={c} />
                ))}
              </div>
              <div className="comment-input">
                <input placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleComment()} />
                <button className="action-btn primary" onClick={handleComment}><Send size={16} /></button>
              </div>
            </div>

            {/* Feedback - only for citizen on resolved complaints */}
            {complaint.status === 'resolved' && user?.role === 'citizen' && complaint.citizen?._id === user?._id && !complaint.feedback?.rating && (
              <div className="feedback-card">
                <h3>Rate the Resolution</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 12 }}>Your feedback helps us improve service quality</p>
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`star ${feedbackRating >= s ? 'filled' : ''}`} onClick={() => setFeedbackRating(s)}>★</span>
                  ))}
                </div>
                <textarea placeholder="Optional: Share your experience..." value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)} rows={2}
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--gray-200)', borderRadius: 'var(--radius-md)', marginBottom: 12, fontFamily: 'inherit' }} />
                <button className="action-btn primary" onClick={handleFeedback}>Submit Feedback</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="detail-card">
              <h3>Complaint Info</h3>
              <div className="info-list">
                <InfoRow label="Status" value={<span style={{ color: statusColors[complaint.status] }}>{statusLabels[complaint.status]}</span>} />
                <InfoRow label="Priority" value={<span style={{ textTransform: 'capitalize' }}>{complaint.priority}</span>} />
                <InfoRow label="Filed By" value={complaint.citizen?.name} />
                <InfoRow label="Filed On" value={new Date(complaint.createdAt).toLocaleDateString()} />
                {complaint.department && <InfoRow label="Department" value={complaint.department.name} />}
                {complaint.assignedOfficer && <InfoRow label="Officer" value={complaint.assignedOfficer.name} />}
                {complaint.resolvedAt && <InfoRow label="Resolved" value={new Date(complaint.resolvedAt).toLocaleDateString()} />}
              </div>
            </div>

            <div className="detail-card">
              <h3>Timeline</h3>
              <div className="timeline">
                {complaint.timeline?.map((t, i) => (
                  <TimelineItem
                    key={i}
                    event={t}
                    isActive={i === complaint.timeline.length - 1}
                  />
                ))}
              </div>
            </div>

            {complaint.feedback?.rating && (
              <div className="detail-card">
                <h3>Citizen Feedback</h3>
                <div className="stars" style={{ marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <span key={s} className={`star ${complaint.feedback.rating >= s ? 'filled' : ''}`} style={{ cursor: 'default' }}>★</span>)}
                </div>
                {complaint.feedback.comment && <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{complaint.feedback.comment}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetails;
