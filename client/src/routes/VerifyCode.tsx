import './VerifyCode.css';
import React, { useState } from 'react';

const VerifyCode: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:6969/user/resetcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Password successfully reset. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setMessage(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-code-container">
      <div className="verify-code-card">
        <h2>Verify Reset Code</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="code">Reset Code:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="verify-code-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyCode;