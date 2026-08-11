import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { officerAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlayCircle, CheckCircle, Filter } from 'lucide-react';
import WorkAssignmentRow from '../../components/officer/WorkAssignmentRow';
import './Officer.css';

const statusColors = { assigned: '#8b5cf6', in_progress: '#ff7426', resolved: '#10b981', closed: '#6b7280' };
const statusLabels = { assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

const OfficerWork = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaints(); }, [statusFilter]);

  const fetchComplaints = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await officerAPI.getComplaints(params);
      setComplaints(data);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleStartWork = async (id) => {
    try {
      await officerAPI.updateProgress(id, { message: 'Work started on the complaint' });
      toast.success('Work started!');
      fetchComplaints();
    } catch (e) { toast.error('Failed to update'); }
  };

  const handleResolve = async (id) => {
    try {
      await officerAPI.resolve(id, { message: 'Issue has been resolved on-ground' });
      toast.success('Complaint resolved!');
      fetchComplaints();
    } catch (e) { toast.error('Failed to resolve'); }
  };

  return (
    <DashboardLayout>
      <div className="officer-page">
        <div className="welcome-section">
          <h2>My <span className="text-gradient">Assignments</span></h2>
          <p>Manage and resolve your assigned complaints</p>
        </div>

        <div className="filter-bar">
          <Filter size={18} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? <div className="loading-state"><div className="loading-spinner"></div></div> :
          complaints.length === 0 ? (
            <div className="empty-state"><p>No assignments found. {statusFilter ? 'Try a different filter.' : ''}</p></div>
          ) : (
            <div>
              {complaints.map(c => (
                <WorkAssignmentRow
                  key={c._id}
                  complaint={c}
                  onView={(complaintId) => navigate(`/complaint/${complaintId}`)}
                  onStartWork={handleStartWork}
                  onResolve={handleResolve}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                />
              ))}
            </div>
          )
        }
      </div>
    </DashboardLayout>
  );
};

export default OfficerWork;
