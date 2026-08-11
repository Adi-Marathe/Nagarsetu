import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { complaintAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Upload, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Citizen.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categories = [
  'Road Damage', 'Pothole', 'Bridge Issue', 'Garbage', 'Drainage', 'Sewage',
  'Water Leakage', 'Pipeline Burst', 'Water Supply', 'Street Light', 'Power Outage',
  'Electricity Fault', 'Hospital', 'Medical Emergency', 'Sanitation', 'Traffic', 'Parking', 'Public Transport', 'Other'
];

const ReportIssue = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', address: '', priority: 'medium' });
  const [position, setPosition] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = idx => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await complaintAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        location: {
          address: form.address,
          lat: position ? position[0] : 0,
          lng: position ? position[1] : 0
        },
        images
      });
      toast.success('Complaint submitted successfully!');
      navigate('/citizen/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="citizen-page report-form">
        <div className="welcome-section">
          <h2>Report a <span className="text-gradient">Civic Issue</span></h2>
          <p>Fill in the details to submit your complaint</p>
        </div>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Issue Title *</label>
            <input name="title" placeholder="e.g. Broken road near main market" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" placeholder="Describe the issue in detail..." value={form.description}
              onChange={handleChange} rows={4} />
          </div>

          <div className="form-group">
            <label>Address / Location Details</label>
            <input name="address" placeholder="e.g. Near City Mall, MG Road" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><MapPin size={16} style={{ verticalAlign: 'middle' }} /> Pin Location on Map</label>
            <div className="map-container">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <p className="map-hint">Click on the map to pin the issue location</p>
          </div>

          <div className="form-group">
            <label><Upload size={16} style={{ verticalAlign: 'middle' }} /> Upload Photos</label>
            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleImageUpload} />
              <p>Click to upload images (max 5)</p>
            </div>
            {images.length > 0 && (
              <div className="image-previews">
                {images.map((img, i) => (
                  <div key={i} className="image-preview">
                    <img src={img} alt={`Preview ${i}`} />
                    <button type="button" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="action-btn primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ReportIssue;
