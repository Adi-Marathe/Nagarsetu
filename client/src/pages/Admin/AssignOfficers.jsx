import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI, complaintAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import AssignOfficerRow from '../../components/admin/AssignOfficerRow';
import './Admin.css';

const statusColors = { verified: '#3b82f6', assigned: '#8b5cf6', in_progress: '#ff7426' };
const statusLabels = { verified: 'Verified', assigned: 'Assigned', in_progress: 'In Progress' };

const AssignOfficers = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [compRes, offRes, deptRes] = await Promise.all([
        complaintAPI.getAllAdmin({ status: 'verified' }),
        adminAPI.getOfficers(),
        adminAPI.getDepartments()
      ]);
      setComplaints(compRes.data);
      setOfficers(offRes.data);
      setDepartments(deptRes.data);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleAssign = async (complaintId, officerId, departmentId) => {
    if (!officerId) { toast.error('Please select an officer'); return; }
    try {
      await adminAPI.assign(complaintId, {
        officerId,
        departmentId: departmentId || undefined,
        message: 'Complaint assigned by admin'
      });
      toast.success('Officer assigned successfully!');
      setComplaints(prev => prev.filter(c => c._id !== complaintId));
    } catch (e) { toast.error('Failed to assign officer'); }
  };

  return (
    <DashboardLayout>
      <div className="admin-page">
        <div className="welcome-section">
          <h2><UserPlus size={24} style={{ verticalAlign: 'middle' }} /> Assign <span className="text-gradient">Officers</span></h2>
          <p>Assign verified complaints to department officers</p>
        </div>

        {loading ? <div className="loading-state"><div className="loading-spinner"></div></div> :
          complaints.length === 0 ? (
            <div className="empty-state"><p>No verified complaints to assign. Verify complaints first.</p></div>
          ) : (
            <div>
              <p style={{ marginBottom: 16, fontSize: '0.88rem', color: 'var(--gray-500)' }}>{complaints.length} complaints ready for assignment</p>
              {complaints.map(c => (
                <AssignOfficerRow
                  key={c._id}
                  complaint={c}
                  officers={officers}
                  departments={departments}
                  onAssign={handleAssign}
                  onView={(complaintId) => navigate(`/complaint/${complaintId}`)}
                />
              ))}
            </div>
          )
        }
      </div>
    </DashboardLayout>
  );
};

export default AssignOfficers;
