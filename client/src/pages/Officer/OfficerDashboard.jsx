import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { officerAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import ComplaintCard from '../../components/shared/ComplaintCard';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';
import './Officer.css';

const statusColors = { assigned: '#8b5cf6', in_progress: '#ff7426', resolved: '#10b981', closed: '#6b7280' };
const statusLabels = { assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await officerAPI.getStats();
      setStats(data);
    } catch (e) {} finally { setLoading(false); }
  };

  if (loading) return <DashboardLayout><LoadingState /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="officer-page">
        <div className="welcome-section">
          <h2>Welcome, <span className="text-gradient">{user?.name}</span></h2>
          <p>Manage your assigned civic complaints</p>
        </div>

        <div className="stats-grid">
          <StatCard icon={<FileText size={24} />} value={stats?.total || 0} label="Total Assigned" borderColor="var(--primary)" />
          <StatCard icon={<Clock size={24} />} value={stats?.assigned || 0} label="Pending Start" borderColor="#8b5cf6" />
          <StatCard icon={<PlayCircle size={24} />} value={stats?.inProgress || 0} label="In Progress" borderColor="var(--accent)" />
          <StatCard icon={<CheckCircle size={24} />} value={(stats?.resolved || 0) + (stats?.closed || 0)} label="Resolved" borderColor="var(--success)" />
        </div>

        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => navigate('/officer/work')}>
            <FileText size={18} /> View Assignments
          </button>
        </div>

        <div className="recent-section">
          <h3>Recent Assignments</h3>
          {(stats?.recentComplaints || []).length === 0 ? (
            <EmptyState message="No assignments yet. Check back later." />
          ) : (
            <div className="complaints-list">
              {(stats?.recentComplaints || []).map(c => (
                <ComplaintCard
                  key={c._id}
                  complaint={c}
                  onClick={() => navigate(`/complaint/${c._id}`)}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                  showUpvotes={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfficerDashboard;
