import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI, complaintAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield } from 'lucide-react';
import VerifyComplaintRow from '../../components/admin/VerifyComplaintRow';
import './Admin.css';

const VerifyIssues = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getAllAdmin({ status: 'submitted' });
      setComplaints(data);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleVerify = async (id, priority) => {
    try {
      await adminAPI.verify(id, { priority, message: 'Complaint verified by municipal admin' });
      toast.success('Complaint verified successfully!');
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch (e) { toast.error('Failed to verify complaint'); }
  };

  return (
    <DashboardLayout>
      <div className="admin-page">
        <div className="welcome-section">
          <h2><Shield size={24} style={{ verticalAlign: 'middle' }} /> Verify <span className="text-gradient">Complaints</span></h2>
          <p>Review and verify submitted complaints from citizens</p>
        </div>

        {loading ? <div className="loading-state"><div className="loading-spinner"></div></div> :
          complaints.length === 0 ? (
            <div className="empty-state"><p>🎉 All complaints have been verified! No pending items.</p></div>
          ) : (
            <div>
              <p style={{ marginBottom: 16, fontSize: '0.88rem', color: 'var(--gray-500)' }}>{complaints.length} complaints pending verification</p>
              {complaints.map(c => (
                <VerifyComplaintRow key={c._id} complaint={c} onVerify={handleVerify} onView={(complaintId) => navigate(`/complaint/${complaintId}`)} />
              ))}
            </div>
          )
        }
      </div>
    </DashboardLayout>
  );
};

export default VerifyIssues;
