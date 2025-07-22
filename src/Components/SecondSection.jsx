import React from "react";
import "./SecondSection.css";

const SecondSection = () => {
  return (
    <div className="second-container">
      <div className="second-content">
        <h2 className="second-title">
          You've used and Know the basics.<br />
          Now it's time to <span className="highlight">Master it</span><br />
          Unlock <span className="highlight">Full potential</span>
        </h2>
        
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
      </div>
    </div>
  );
};

export default SecondSection; 