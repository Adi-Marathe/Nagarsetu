import React from 'react';

const AuthField = ({ label, type = 'text', name, value, placeholder, onChange, error, children, className = '' }) => (
  <div className={`form-group ${className}`}>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={error ? 'input-error' : ''}
    />
    {error && <span className="error-msg">{error}</span>}
    {children}
  </div>
);

export default AuthField;
