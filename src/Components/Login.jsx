import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginLottie from "../assets/Login.json";
import { useAuth } from "../context/AuthContext";
import idIcon from "../assets/id.svg";
import mailIcon from "../assets/mail.svg";
import lockIcon from "../assets/lock.svg";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login({ id: userId, email, password });
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-split-container">
      <div className="login-left-panel">
        <div className="login-lottie-wrapper">
          <Lottie animationData={loginLottie} loop={true} width={500} height={300} />
        </div>
        <div className="login-crm-title">C.R.M</div>
        <div className="login-crm-subtitle">Customer Relationship Management</div>
      </div>
      <div className="login-right-panel login-form-center">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Sign In to C.R.M</h2>
          {error && <div className="login-error">{error}</div>}
          <div className="login-input-group">
            <img src={idIcon} alt="ID" className="login-input-svg" />
            <input
              type="text"
              placeholder="ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="login-input"
              required
              disabled={loading}
            />
          </div>
          <div className="login-input-group">
            <img src={mailIcon} alt="Email" className="login-input-svg" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
              disabled={loading}
            />
          </div>
          <div className="login-input-group" style={{position: 'relative'}}>
            <img src={lockIcon} alt="Password" className="login-input-svg" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              disabled={loading}
              style={{paddingRight: '2.5rem'}}
            />
            <img
              src={showPassword ? eyeOffIcon : eyeIcon}
              alt={showPassword ? "Hide password" : "Show password"}
              className="login-eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', width: '22px', height: '22px', opacity: 0.7}}
              tabIndex={0}
            />
          </div>
          <div className="login-options-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                disabled={loading}
              />
              Remember Me
            </label>
            <span className="login-forgot" onClick={() => alert('Forgot Password?')}>Forgot Password?</span>
          </div>
          <button type="submit" className="login-btn-green" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
