import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../../hooks/useScrollProgress';
import type { SectionKey } from '../../animation/scrollConfig';
import resumePdf from '../../assets/Sriram_Fullstack_Resume.pdf';
import './Nav.css';

interface NavProps {
  activeSection: SectionKey;
}

const NAV_ITEMS: { label: string; id: string; index: string }[] = [
  { label: 'Home',       id: 'hero',       index: '01' },
  { label: 'About',      id: 'about',      index: '02' },
  { label: 'Experience', id: 'experience', index: '03' },
  { label: 'Skills',     id: 'skills',     index: '04' },
  { label: 'Projects',   id: 'projects',   index: '05' },
  { label: 'Education',  id: 'education',  index: '06' },
  { label: 'Activities', id: 'activities', index: '07' },
  { label: 'Contact',    id: 'contact',    index: '08' },
];

const Nav: React.FC<NavProps> = ({ activeSection }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.portfolio-scroll') as HTMLElement;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = resumePdf;
    a.download = 'Sriram_Fullstack_Resume.pdf';
    a.click();
  };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav__inner">
        {/* Brand */}
        <div className="nav__brand">
          <span className="nav__brand-name">SRM</span>
          <span className="nav__brand-sep">/</span>
          <span className="nav__brand-sub">PORTFOLIO</span>
        </div>

        {/* Desktop links */}
        <ul className="nav__links" role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <button
                className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                onClick={() => handleNav(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="nav__link-index">{item.index}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Resume CTA */}
        <button className="nav__resume btn btn-outline" onClick={downloadResume}>
          Resume ↗
        </button>

        {/* Hamburger */}
        <button
          className={`nav__hamburger ${open ? 'nav__hamburger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav__mobile" role="dialog" aria-label="Navigation menu">
          <ul role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  className={`nav__mobile-link ${activeSection === item.id ? 'nav__mobile-link--active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <span className="nav__link-index">{item.index}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline nav__mobile-resume" onClick={downloadResume}>
            Resume ↗
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
