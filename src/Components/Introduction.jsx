import React from "react";
import "./Introduction.css";
import { useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/dashboard.png";
import whatsappIcon from "../assets/whatsapp.png";
import mailIcon from "../assets/email.png";
import instagramIcon from "../assets/user-engagement.png";

const user1 = "https://randomuser.me/api/portraits/men/32.jpg";
const user2 = "https://randomuser.me/api/portraits/men/44.jpg";
const chatSample = "https://dummyimage.com/400x250/ede9fe/1a1446&text=Chat+UI";

const Introduction = () => {
  const navigate = useNavigate();
  return (
    <div className="intro-container enhanced-bg">
      <header className="intro-header">
        <div className="intro-logo">YourCRM</div>
        <div className="intro-auth-options">
          <button className="intro-login prominent" onClick={() => navigate("/login")}>Login</button>
          <button className="intro-signup prominent" onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </header>
      <main className="intro-main">
        <div className="intro-tagline">Welcome to the future of client management</div>
        <h1 className="intro-title">
          All the unique ways you manage clients —<br /> combined in one app
        </h1>
        <p className="intro-subtitle">Messenger-based sales CRM</p>
        <button className="intro-cta">Get Started</button>
        <div className="intro-visuals enhanced-visuals">
          <img src={dashboardIcon} alt="Dashboard" className="visual-icon animate-float" />
          <img src={whatsappIcon} alt="WhatsApp" className="visual-icon animate-float-delay1" />
          <img src={mailIcon} alt="Mail" className="visual-icon animate-float-delay2" />
          <img src={instagramIcon} alt="Engagement" className="visual-icon animate-float-delay3" />
        </div>
        {/* Testimonial Section */}
        <section className="testimonial-section">
          <div className="testimonial-bg-shape left"></div>
          <div className="testimonial-bg-shape right"></div>
          <img src={user1} alt="User 1" className="testimonial-user testimonial-user-left" />
          <div className="testimonial-text">
            Loved by small businesses & entrepreneurs in 109 countries
          </div>
          <img src={user2} alt="User 2" className="testimonial-user testimonial-user-right" />
        </section>
        {/* Feature Section */}
        <section className="feature-section">
          <div className="feature-content">
            <h2 className="feature-title">More conversations means more sales</h2>
            <p className="feature-desc">
              Get clients talking by connecting on the apps they love. Your new inbox helps your team cover the most popular channels without breaking a sweat.
            </p>
            <div className="feature-channels">
              <span className="channel whatsapp">WhatsApp</span>
              <span className="channel instagram">Instagram</span>
              <span className="channel all">All channels</span>
            </div>
          </div>
          <div className="feature-image-wrapper">
            <img src={chatSample} alt="Chat UI Sample" className="feature-image" />
          </div>
        </section>
        {/* Pipeline Management Section */}
        <section className="pipeline-section">
          <div className="pipeline-image-wrapper">
            <img src="https://dummyimage.com/400x220/e0e7ff/1a1446&text=Pipeline+View" alt="Pipeline Sample" className="pipeline-image" />
          </div>
          <div className="pipeline-content">
            <h2 className="pipeline-title">Customizable Pipelines</h2>
            <p className="pipeline-desc">
              Visualize every stage of your sales process. Move deals with drag-and-drop, track progress, and never miss a follow-up. Get instant insights with beautiful, interactive boards.
            </p>
            <a href="#" className="pipeline-link">Learn more &rarr;</a>
          </div>
        </section>
        {/* Automation & Bots Section */}
        <section className="automation-section">
          <div className="automation-content">
            <h2 className="automation-title">Automation & Bots</h2>
            <p className="automation-desc">
              Save time and boost productivity with smart automation. Set up workflows, send reminders, and trigger personalized messages—all without writing a single line of code.
            </p>
            <a href="#" className="automation-link">See templates &rarr;</a>
          </div>
          <div className="automation-image-wrapper">
            <img src="https://dummyimage.com/400x200/fce7f3/1a1446&text=Workflow+Automation" alt="Automation Sample" className="automation-image" />
          </div>
        </section>
      </main>
      <footer className="intro-footer">
        <div className="footer-content">
          <div className="footer-brand">YourCRM</div>
          <nav className="footer-links">
            <a href="#" className="footer-link">Home</a>
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Pricing</a>
            <a href="#" className="footer-link">Contact</a>
          </nav>
          <div className="footer-copy">&copy; {new Date().getFullYear()} YourCRM. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Introduction;
