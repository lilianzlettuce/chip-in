import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPass.css';

const ForgotPass: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 6969;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);  // Start loading
    setMessage(null);  // Clear previous messages

    try {
      const response = await fetch(`${SERVER_URL}/user/resetpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset code sent to your email');
        setTimeout(() => {
          navigate('/verifycode', { state: { email } }); // Navigate to VerifyCode with email state
        }, 2000); // Add a delay if you want to show the message before redirecting
      } else {
        const result = await response.json();
        setMessage(result.message || 'Failed to send password reset code');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Account Recovery</h2>
        <p>Enter your email address to recover your account.</p>
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
          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Password Reset Code"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPass;