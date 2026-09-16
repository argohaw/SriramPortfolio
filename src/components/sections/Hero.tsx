import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../../hooks/useScrollProgress';
import resumePdf from '../../assets/Sriram_Fullstack_Resume.pdf';
import profilePhoto from '../../assets/personal-photo.png';
import './Hero.css';

const ROLES = ['Senior Software Engineer', 'Full Stack Developer', 'AI Enthusiast', 'Distributed Systems'];

const Typewriter: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      t = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 30);
    } else {
      setDeleting(false);
      setIdx(i => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  return (
    <span className="hero__typewriter">
      {displayed}<span className="hero__cursor" aria-hidden="true">|</span>
    </span>
  );
};

const Hero: React.FC = () => {
  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = resumePdf;
    a.download = 'Sriram_Fullstack_Resume.pdf';
    a.click();
  };

  return (
    <section id="hero" className="hero" aria-label="Hero">
      <div className="hero__content">
        <p className="hero__label label">Hello / 001</p>

        <h1 className="hero__name">
          <span className="hero__name-first">Sriramasivam</span>
          <span className="hero__name-last">Thirumalaivasan</span>
        </h1>

        <p className="hero__role">
          <Typewriter />
        </p>

        <p className="hero__stack label">Java · Distributed Systems · Full Stack · AI</p>

        <p className="hero__description">
          Building high-throughput distributed systems and cloud-native applications.
          Specializing in Java, Spring Boot, and React ecosystems — focused on system
          performance, security architecture, and AI-driven engineering at scale.
        </p>

        <div className="hero__actions">
          <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
            Explore Work
          </button>
          <button className="btn btn-outline" onClick={downloadResume}>
            Resume ↗
          </button>
        </div>

        <div className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          <span className="label">Available for Opportunities</span>
        </div>
      </div>

      <div className="hero__photo-wrap" aria-hidden="true">
        <img src={profilePhoto} alt="" className="hero__photo" />
        <div className="hero__photo-glow" />
      </div>

      <div className="hero__core-label" aria-hidden="true">
        <span className="label">SRM / CORE-01</span>
      </div>
    </section>
  );
};

export default Hero;
