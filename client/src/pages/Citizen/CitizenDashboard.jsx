import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { complaintAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import ComplaintCard from '../../components/shared/ComplaintCard';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';
import './Citizen.css';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getAll();
      setComplaints(data.complaints || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => ['verified', 'assigned', 'in_progress'].includes(c.status)).length,
    resolved: complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length
  };

  const statusColors = { submitted: '#f59e0b', verified: '#3b82f6', assigned: '#8b5cf6', in_progress: '#ff7426', resolved: '#10b981', closed: '#6b7280' };
  const statusLabels = { submitted: 'Submitted', verified: 'Verified', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

  return (
    <DashboardLayout>
      <div className="citizen-page">
        <div className="welcome-section">
          <h2>Welcome back, <span className="text-gradient">{user?.name}!</span></h2>
          <p>Track your civic complaints and report new issues</p>
        </div>

        <div className="stats-grid">
          <StatCard icon={<FileText size={24} />} value={stats.total} label="Total Complaints" borderColor="var(--primary)" />
          <StatCard icon={<Clock size={24} />} value={stats.submitted} label="Pending Review" borderColor="var(--warning)" />
          <StatCard icon={<AlertTriangle size={24} />} value={stats.inProgress} label="In Progress" borderColor="var(--accent)" />
          <StatCard icon={<CheckCircle size={24} />} value={stats.resolved} label="Resolved" borderColor="var(--success)" />
        </div>

        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => navigate('/citizen/report')}>
            <PlusCircle size={20} /> Report New Issue
          </button>
          <button className="action-btn outline" onClick={() => navigate('/citizen/complaints')}>
            <FileText size={20} /> View All Complaints
          </button>
        </div>

        <div className="recent-section">
          <h3>Recent Complaints</h3>
          {loading ? (
            <LoadingState />
          ) : complaints.length === 0 ? (
            <EmptyState message="No complaints yet. Start by reporting a civic issue!">
              <button onClick={() => navigate('/citizen/report')} className="action-btn primary">Report Issue</button>
            </EmptyState>
          ) : (
            <div className="complaints-list">
              {complaints.slice(0, 5).map(c => (
                <ComplaintCard
                  key={c._id}
                  complaint={c}
                  onClick={() => navigate(`/complaint/${c._id}`)}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
