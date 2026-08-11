import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Building2, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import ComplaintCard from '../../components/shared/ComplaintCard';
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch (e) {} finally { setLoading(false); }
  };

  const statusColors = { submitted: '#f59e0b', verified: '#3b82f6', assigned: '#8b5cf6', in_progress: '#ff7426', resolved: '#10b981', closed: '#6b7280' };
  const statusLabels = { submitted: 'Submitted', verified: 'Verified', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

  if (loading) return <DashboardLayout><div className="loading-state"><div className="loading-spinner"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="admin-page">
        <div className="welcome-section">
          <h2>Admin <span className="text-gradient">Dashboard</span></h2>
          <p>Overview of all civic complaints and system metrics</p>
        </div>

        {/* Main Stats */}
        <div className="admin-stats-grid">
          <StatCard icon={<FileText size={24} />} value={stats?.totalComplaints || 0} label="Total Complaints" className="admin-stat-card primary" />
          <StatCard icon={<Clock size={24} />} value={stats?.statusStats?.submitted || 0} label="Pending Verification" className="admin-stat-card warning" />
          <StatCard icon={<AlertTriangle size={24} />} value={(stats?.statusStats?.assigned || 0) + (stats?.statusStats?.inProgress || 0)} label="Being Worked On" className="admin-stat-card info" />
          <StatCard icon={<CheckCircle size={24} />} value={(stats?.statusStats?.resolved || 0) + (stats?.statusStats?.closed || 0)} label="Resolved" className="admin-stat-card success" />
          <StatCard icon={<Users size={24} />} value={stats?.totalCitizens || 0} label="Citizens" className="admin-stat-card accent" />
          <StatCard icon={<Building2 size={24} />} value={stats?.totalOfficers || 0} label="Officers" className="admin-stat-card purple" />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions" style={{ marginBottom: 28 }}>
          <button className="action-btn primary" onClick={() => navigate('/admin/verify')}>Verify Complaints</button>
          <button className="action-btn outline" onClick={() => navigate('/admin/assign')}>Assign Officers</button>
        </div>

        <div className="admin-content-grid">
          {/* Status Breakdown */}
          <div className="admin-card">
            <h3><TrendingUp size={18} /> Status Breakdown</h3>
            <div className="status-breakdown">
              {Object.entries(stats?.statusStats || {}).map(([key, val]) => (
                <div key={key} className="sb-item">
                  <div className="sb-header">
                    <span className="sb-label" style={{ color: statusColors[key] }}>{statusLabels[key] || key}</span>
                    <span className="sb-count">{val}</span>
                  </div>
                  <div className="sb-bar">
                    <div className="sb-fill" style={{
                      width: `${stats?.totalComplaints > 0 ? (val / stats.totalComplaints) * 100 : 0}%`,
                      background: statusColors[key]
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Stats */}
          <div className="admin-card">
            <h3>📊 Top Categories</h3>
            <div className="category-stats">
              {(stats?.categoryStats || []).slice(0, 8).map((c, i) => (
                <div key={i} className="cs-item">
                  <span className="cs-name">{c._id}</span>
                  <span className="cs-count">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="admin-card" style={{ marginTop: 24 }}>
          <h3>🕐 Recent Complaints</h3>
          <div className="complaints-list">
            {(stats?.recentComplaints || []).slice(0, 5).map(c => (
              <div key={c._id} className="complaint-card" onClick={() => navigate(`/complaint/${c._id}`)}>
                <div className="cc-top">
                  <h4>{c.title}</h4>
                  <span className="status-badge" style={{ background: `${statusColors[c.status]}15`, color: statusColors[c.status] }}>
                    {statusLabels[c.status]}
                  </span>
                </div>
                <div className="cc-meta">
                  <span className="cc-category">{c.category}</span>
                  <span className="cc-date">{c.citizen?.name} · {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
