import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginLottie from "../assets/Login.json";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiGlobe, FiUsers, FiMapPin, FiClock } from "react-icons/fi";

const passwordLottieUrl = "https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json";

const industries = ["SaaS", "Retail", "Manufacturing", "Finance", "Healthcare", "Education", "Other"];
const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Other"];
const timeZones = ["IST (UTC+5:30)", "UTC", "EST (UTC-5)", "PST (UTC-8)", "CET (UTC+1)", "Other"];

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordAnim, setShowPasswordAnim] = useState(false);
  const [showConfirmPasswordAnim, setShowConfirmPasswordAnim] = useState(false);
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowPasswordAnim(e.target.value.length > 0);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setShowConfirmPasswordAnim(e.target.value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      alert("Name should contain only alphabets and spaces!");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(company)) {
      alert("Company/Organization name should contain only alphabets and spaces!");
      return;
    }
    if (website && !/^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\/#?].*)?$/.test(website)) {
      alert("Please enter a valid website URL (must start with http:// or https://)!");
      return;
    }
    if (city && !/^[a-zA-Z ]+$/.test(city)) {
      alert("City/State should contain only alphabets and spaces!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add signup logic here
    alert("Account created!");
    navigate("/login");
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
      <div className="login-right-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Sign Up for C.R.M</h2>
          <div className="signup-section">
            <div className="signup-section-title">1. Account Information <span className="signup-section-note">(essential)</span></div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiUser /></span>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z ]*$/.test(value)) {
                    setFullName(value);
                  }
                }}
                className="login-input"
                required
              />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiMail /></span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
            </div>
            <div className="login-input-group" style={{ position: 'relative' }}>
              <span className="login-input-icon"><FiLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="login-input"
                required
              />
              {showPasswordAnim && (
                <div className="password-lottie-anim">
                  <Lottie animationData={passwordLottieUrl} loop={true} style={{ width: 48, height: 48 }} />
                </div>
              )}
              <span
                className="password-eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ position: 'absolute', right: showPasswordAnim ? 0 : 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 3 }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <div className="login-input-group" style={{ position: 'relative' }}>
              <span className="login-input-icon"><FiLock /></span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="login-input"
                required
              />
              {showConfirmPasswordAnim && (
                <div className="password-lottie-anim">
                  <Lottie animationData={passwordLottieUrl} loop={true} style={{ width: 48, height: 48 }} />
                </div>
              )}
              <span
                className="password-eye-icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{ position: 'absolute', right: showConfirmPasswordAnim ? 0 : 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 3 }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>
          <div className="signup-section" style={{ marginLeft: '73px' }}>
            <div className="signup-section-title">2. Organization / Company Information</div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiUsers /></span>
              <input
                type="text"
                placeholder="Company / Organization Name"
                value={company}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z ]*$/.test(value)) {
                    setCompany(value);
                  }
                }}
                className="login-input"
                required
              />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiGlobe /></span>
              <input
                type="url"
                placeholder="Website URL (optional)"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="login-input"
              />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiGlobe /></span>
              <select
                className="login-input"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              >
                <option value="">Select Industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiUsers /></span>
              <select
                className="login-input"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                required
              >
                <option value="">Company Size / Number of Employees</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiGlobe /></span>
              <select
                className="login-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiMapPin /></span>
              <input
                type="text"
                placeholder="City / State (optional)"
                value={city}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z ]*$/.test(value)) {
                    setCity(value);
                  }
                }}
                className="login-input"
              />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon"><FiClock /></span>
              <select
                className="login-input"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                required
              >
                <option value="">Time Zone</option>
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="login-btn-green" style={{ marginLeft: '73px' }}>SIGN UP</button>
          <div className="login-footer">
            Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
