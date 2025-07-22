import React from "react";
import "./Introduction.css";
import { useNavigate } from "react-router-dom";
import lineImage from "../assets/Line.png";

const Introduction = () => {
  const navigate = useNavigate();
  
  return (
    <div className="intro-container">
      <header className="intro-header">
        <div className="intro-logo">MAYDIV CRM</div>
        <nav className="intro-nav">
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Pricing</a>
          </div>
        <div className="intro-auth-options">
            <button className="intro-login" onClick={() => navigate("/login")}>Log In</button>
            <button className="intro-signup" onClick={() => navigate("/signup")}>Request a demo</button>
        </div>
        </nav>
      </header>
      
      <main className="intro-main">
        <div className="intro-tagline">
          <img src={lineImage} alt="" className="tagline-line" />
          Used by 100+ companies
          <img src={lineImage} alt="" className="tagline-line" />
        </div>
        <h1 className="intro-title">
          Transform the Way You<br />
          Engage with Your<br />
          Customers
        </h1>
        
        <div className="hero-section">
          <div className="network-graphic">
            <div className="network-center"></div>
            
            <div className="floating-phones">
              <div className="phone-group left">
                <div className="phone back">
                  <div className="phone-screen">
                    <div>App</div>
                  </div>
                </div>
                <div className="phone front">
                  <div className="phone-screen">
                    <div>Chat</div>
                  </div>
        </div>
          </div>
              <div className="phone-group right">
                <div className="phone back">
                  <div className="phone-screen">
                    <div>App</div>
            </div>
          </div>
                <div className="phone front">
                  <div className="phone-screen">
                    <div>Team</div>
          </div>
          </div>
          </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Introduction;
