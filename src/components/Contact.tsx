import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div id="contact" className="contact-wrapper" style={{
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 2rem 2rem 2rem',
      boxSizing: 'border-box'
    }}>
      <div className="contact-glass-box" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        padding: '2rem',
        width: '85%',
        maxWidth: '600px'
      }}>
        <h2 className="contact-title" style={{
          fontSize: '4rem',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          lineHeight: 1.1,
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, white, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontFamily: 'Roboto, sans-serif'
        }}>Let's Work Together</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="contact-form-row" style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
          </div>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'Roboto, sans-serif'
            }}
          />
          
          <div className="contact-phone-row" style={{ display: 'flex', gap: '1rem' }}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="contact-country-select"
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif',
                width: '120px'
              }}
            >
              <option value="+1" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+1 (US)</option>
              <option value="+91" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+91 (IN)</option>
              <option value="+44" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+44 (UK)</option>
              <option value="+49" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+49 (DE)</option>
              <option value="+33" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+33 (FR)</option>
              <option value="+39" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+39 (IT)</option>
              <option value="+34" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+34 (ES)</option>
              <option value="+61" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+61 (AU)</option>
              <option value="+81" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+81 (JP)</option>
              <option value="+86" style={{ background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>+86 (CN)</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
          </div>
          
          <textarea
            name="description"
            placeholder="Say something about your request..."
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={5}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'Roboto, sans-serif',
              resize: 'vertical'
            }}
          />
          
          <button
            type="submit"
            style={{
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'linear-gradient(135deg, #9333ea 0%, #06b6d4 100%)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              marginTop: '1rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Send Message
          </button>
        </form>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .contact-wrapper {
            padding: 120px 1rem 2rem 1rem !important;
          }
          .contact-glass-box {
            width: 95% !important;
            padding: 1.5rem !important;
          }
          .contact-title {
            font-size: 2.5rem !important;
          }
          .contact-form-row {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .contact-phone-row {
            flex-direction: column !important;
          }
          .contact-country-select {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
