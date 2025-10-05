import React from "react";
import CircularGallery from "./reactbits/CircularGallery";

const WorkProjects: React.FC = () => {
  return (
    <div id="projects" style={{
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '150px',
        padding: '150px 1rem 0 1rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          width: 'fit-content'
        }}>
          <h2 style={{
            fontSize: '4rem',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1.1,
            textAlign: 'center',
            margin: 0,
            background: 'linear-gradient(to right, white, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}>Work Projects</h2>
        </div>
      </div>
      <div style={{ height: "calc(100vh - 300px)", position: "relative", padding: '1rem', marginTop: '1px' }}>
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </div>
  );
};

export default WorkProjects;
