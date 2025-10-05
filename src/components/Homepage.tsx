import React from "react";
import "./css/Homepage.css";

const Homepage: React.FC = () => {
  return (
    <>
      <div id="home" className="hero-wrapper">
        <div className="glass-box">
          <div className="hero-content">
            <p className="hero-subtitle">
              Software Engineer | Full Stack Developer | AI Integrator
            </p>
            <h1 className="hero-title">
              <span className="gradient-text">
                SRIRAMASIVAM THIRUMALAIVASAN
              </span>
            </h1>
            <p className="hero-description">
              I am a Full-Stack Developer with 4+ years of building high-impact
              enterprise solutions, now integrating AI to drive smarter, faster
              decision-making. Proven track record in optimizing performance,
              architecting secure, scalable systems, and accelerating digital
              transformation through intelligent automation and data-driven
              solutions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
