import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <div className="footer-container" style={{
      position: 'fixed',
      bottom: '2em',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '800px',
      zIndex: 99,
      boxSizing: 'border-box',
      backdropFilter: 'blur(2px)'
    }}>
      <footer className="footer-content" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        fontSize: '0.9rem',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <div>
          &copy; 2025 Sriramasivam Thirumalaivasan. All rights reserved.
        </div>
        <div className="footer-social" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="https://github.com/argohaw" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <FaGithub style={{ color: '#333' }} />
          </a>
          <a href="https://www.linkedin.com/in/t-sriramasivam/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <FaLinkedin style={{ color: '#0077b5' }} />
          </a>
          <a href="https://www.instagram.com/iamargohaw/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <FaInstagram style={{ color: '#e4405f' }} />
          </a>
        </div>
      </footer>
      
      <style>{`
        @media (max-width: 768px) {
          .footer-container {
            width: 95% !important;
            bottom: 1em !important;
          }
          .footer-content {
            flex-direction: column !important;
            gap: 0.5rem !important;
            text-align: center !important;
            font-size: 0.8rem !important;
          }
          .footer-social {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Footer;
