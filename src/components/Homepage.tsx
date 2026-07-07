import React, { useEffect, useState } from "react";
import "./css/Homepage.css";
import profilePhoto from "../assets/personal-photo.png";

const roles = ["Full Stack Developer", "Full Stack Java Developer", "AI Enthusiast"];

const Typewriter: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return <span className="typewriter-text">{displayed}<span className="typewriter-cursor">|</span></span>;
};

const Homepage: React.FC = () => {
  return (
    <>
      <div id="home" className="hero-wrapper">
        <div className="glass-box">
          <div className="hero-layout">
            <div className="hero-photo-pane">
              <img src={profilePhoto} alt="Sriramasivam" className="hero-photo" />
            </div>
            <div className="hero-content-pane">
              {/* Line 1 — Hello */}
              <p className="hero-hello">hello.</p>

              {/* Line 2 — Full name */}
              <h1 className="hero-name">Sriramasivam Thirumalaivasan</h1>

              {/* Line 3 — Role with typewriter */}
              <p className="hero-role">
                Senior Software Engineer&nbsp;|&nbsp;<Typewriter />
              </p>

              {/* Line 4 — Intro */}
              <p className="hero-description">
                I build high-throughput distributed systems and cloud-native applications. Specializing in the Java, Spring Boot, and React ecosystems, I focus on system performance, robust security architectures, and leveraging modern AI workflows to solve complex engineering challenges at scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
