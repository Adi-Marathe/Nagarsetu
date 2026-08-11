import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import AuthField from '../../components/auth/AuthField';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: ''});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};
    if (!/^[A-Za-z\s]{3,}$/.test(form.name.trim())) errs.name = 'Name must be at least 3 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome, ${data.name}! Account created successfully.`);
      const routes = { citizen: '/citizen/dashboard', admin: '/admin/dashboard', officer: '/officer/dashboard' };
      navigate(routes[data.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button onClick={() => navigate('/')} className="auth-back-btn">← Back</button>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">🏛️</span>
            <h2>Join <span className="text-gradient">NagarSetu</span></h2>
            <p>Create your account to start reporting issues</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <AuthField
              label="Full Name"
              name="name"
              value={form.name}
              placeholder="Enter your name"
              onChange={handleChange}
              error={errors.name}
            />

            <AuthField
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              placeholder="e.g. citizen@email.com"
              onChange={handleChange}
              error={errors.email}
            />

            <AuthField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              placeholder="Create a password"
              onChange={handleChange}
              error={errors.password}
            />

            <div className="form-group">
              <label>I am a</label>
              <select name="role" value={form.role} onChange={handleChange} className="auth-select">
                <option value="citizen">Citizen</option>
                <option value="admin">Municipal Admin</option>
                <option value="officer">Department Officer</option>
              </select>
            </div>

            <AuthField
              label="Phone (optional)"
              type="tel"
              name="phone"
              value={form.phone}
              placeholder="+91 XXXXXXXXXX"
              onChange={handleChange}
            />

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <span onClick={() => navigate('/login')} className="auth-link">Sign in</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;