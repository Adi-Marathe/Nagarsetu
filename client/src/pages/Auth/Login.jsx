import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import AuthField from '../../components/auth/AuthField';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let emailError = '';
    let passwordError = '';

    if (!validateEmail(email)) emailError = 'Please enter a valid email address';
    if (password.length < 6) passwordError = 'Password must be at least 6 characters';

    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      const routes = { citizen: '/citizen/dashboard', admin: '/admin/dashboard', officer: '/officer/dashboard' };
      navigate(routes[data.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
            <h2>Welcome to <span className="text-gradient">NagarSetu</span></h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <AuthField
              label="Email Address"
              type="email"
              value={email}
              placeholder="e.g. citizen@email.com"
              onChange={e => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
              error={errors.email}
            />

            <AuthField
              label="Password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={e => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
              error={errors.password}
            />

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <span onClick={() => navigate('/register')} className="auth-link">Create one</span></p>
          </div>

          <div className="demo-creds">
            <p className="demo-title">🔑 Demo Credentials</p>
            <div className="demo-row"><code>admin@nagarsetu.com</code> <code>Admin@123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;