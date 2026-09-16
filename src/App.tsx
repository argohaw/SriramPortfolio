import { useEffect, useRef, useState } from 'react';
import { FaExternalLinkAlt, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Scene from './three/Scene';
import { scrollToSection, useScrollProgress, SECTIONS, type SectionKey } from './hooks/useScrollProgress';
import { experiences } from './data/experience';
import { projects } from './data/projects';
import { skillGroups } from './data/skills';
import { education } from './data/education';
import { activities } from './data/activities';
import indiaFullstackResume from './assets/Sriram_Fullstack_Resume.pdf';
import indiaBackendResume from './assets/Sriramasivam_Resume.pdf';
import germanyResume from './assets/CV_Sriramasivam_Thirumalaivasan.pdf';
import netherlandsResume from './assets/Sriramasivam_Thirumalaivasan_CV.pdf';
import profilePhoto from './assets/personal-photo.png';
import './App.css';

const sectionLabels: Record<SectionKey, string> = {
  hero: 'Home',
  about: 'About',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  education: 'Education',
  activities: 'Research',
  contact: 'Contact',
};

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/SriramThirumalaivasan', icon: <FaGithub /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sriram-thirumalaivasan/', icon: <FaLinkedinIn /> },
  { label: 'Instagram', href: 'https://www.instagram.com/sriram.thirumalaivasan/', icon: <FaInstagram /> },
];

function ResumeMenu({ variant = 'nav' }: { variant?: 'nav' | 'button' }) {
  return (
    <div className={`resume-menu ${variant === 'button' ? 'resume-menu-button' : ''}`}>
      <button className={variant === 'button' ? 'btn btn-outline resume-trigger' : 'resume-link resume-trigger'} type="button">
        Resume <FaExternalLinkAlt />
      </button>
      <div className="resume-options" role="menu" aria-label="Resume downloads">
        <div className="resume-option has-submenu" role="none">
          <button type="button" role="menuitem" aria-haspopup="true">
            <span className="flag" aria-hidden="true">🇮🇳</span>
            India
          </button>
          <div className="resume-submenu" role="menu" aria-label="India resume type">
            <a href={indiaFullstackResume} download role="menuitem">
              Fullstack
            </a>
            <a href={indiaBackendResume} download role="menuitem">
              Backend
            </a>
          </div>
        </div>
        <a className="resume-option" href={germanyResume} download role="menuitem">
          <span className="flag" aria-hidden="true">🇩🇪</span>
          Germany
        </a>
        <a className="resume-option" href={netherlandsResume} download role="menuitem">
          <span className="flag" aria-hidden="true">🇳🇱</span>
          Netherlands
        </a>
      </div>
    </div>
  );
}

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress, section } = useScrollProgress(scrollRef);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [projectIndex, setProjectIndex] = useState(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const activeProject = projects[projectIndex];
  const goProject = (direction: number) => {
    setProjectIndex((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <div className="portfolio-shell">
      <Scene section={section} scrollProgress={progress} mouseX={mouse.x} mouseY={mouse.y} />
      <div className="atmosphere" aria-hidden="true" />

      <header className="nav">
        <button className="brand" type="button" onClick={() => scrollToSection('hero')}>
          <span className="brand-mark" aria-hidden="true">
            <span>S</span>
          </span>
          <small>Sriram</small>
        </button>
        <nav aria-label="Primary navigation">
          {SECTIONS.map((key) => (
            <button key={key} className={section === key ? 'active' : ''} type="button" onClick={() => scrollToSection(key)}>
              {sectionLabels[key]}
            </button>
          ))}
        </nav>
        <ResumeMenu />
      </header>

      <main ref={scrollRef} className="portfolio-scroll">
        <section id="hero" className="panel hero-panel">
          <div className="hero-grid">
            <div className="copy-block hero-copy">
              <p className="eyebrow">HELLO / 001</p>
              <h1>Sriramasivam Thirumalaivasan</h1>
              <p className="role">Senior Software Engineer</p>
              <p className="lede">
                I build high-throughput distributed systems and cloud-native applications across Java,
                Spring Boot, React, and AI-enabled engineering workflows.
              </p>
              <div className="actions">
                <button className="btn btn-primary" type="button" onClick={() => scrollToSection('projects')}>Explore Work</button>
                <ResumeMenu variant="button" />
              </div>
            </div>
            <div className="hero-spacer" aria-hidden="true" />
            <div className="hero-side-panel" aria-hidden="true">
              <p className="eyebrow">CORE BOOT</p>
              <div>
                <span>SYSTEM</span>
                <strong>POWERING</strong>
              </div>
              <div>
                <span>STACK</span>
                <strong>JAVA / REACT / CLOUD</strong>
              </div>
              <div>
                <span>MODE</span>
                <strong>DISTRIBUTED SYSTEMS</strong>
              </div>
            </div>
          </div>
          <div className="system-readout" aria-hidden="true">
            <span>CORE STATUS</span>
            <strong>ONLINE</strong>
          </div>
        </section>

        <section id="about" className="panel split right-copy">
          <div className="portrait-frame"><img src={profilePhoto} alt="Sriramasivam Thirumalaivasan" /></div>
          <div className="copy-block">
            <p className="eyebrow">ABOUT / 002</p>
            <h2>Engineering durable systems with a product-minded edge.</h2>
            <p>
              My work sits at the intersection of backend architecture, secure enterprise platforms,
              full-stack delivery, and modern AI automation. I care about clarity under load:
              predictable APIs, resilient services, and interfaces that make complex systems feel usable.
            </p>
            <div className="metadata-grid">{['Java', 'Systems', 'Full Stack', 'AI', 'Cloud'].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </section>

        <section id="experience" className="panel">
          <div className="section-top"><p className="eyebrow">EXPERIENCE / 003</p><h2>Mechanical timeline</h2></div>
          <div className="timeline">
            {experiences.map((job, index) => (
              <article className="timeline-card" key={`${job.company}-${job.role}`}>
                <div className="timeline-index">{String(index + 1).padStart(2, '0')}</div>
                <img src={job.logo} alt={`${job.company} logo`} className={job.logoFill ? 'logo fill' : 'logo'} />
                <div>
                  <p className="duration">{job.duration}</p>
                  <h3>{job.role}</h3>
                  <strong>{job.company}</strong>
                  <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                  <div className="tag-row">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="panel skills-panel">
          <div className="section-top centered"><p className="eyebrow">SKILLS / 004</p><h2>Exploded engineering stack</h2></div>
          <div className="skill-grid">
            {skillGroups.map((group) => (
              <article key={group.layer} className="skill-group">
                <p>{group.label}</p>
                <div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="panel project-panel">
          <div className="project-stage"><img src={activeProject.image} alt={`${activeProject.title} preview`} /></div>
          <div className="copy-block project-copy">
            <p className="eyebrow">PROJECTS / 005</p>
            <p className="project-count">{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
            <h2>{activeProject.title}</h2>
            <p>{activeProject.description}</p>
            <div className="tag-row">{activeProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="project-controls">
              <button type="button" onClick={() => goProject(-1)} aria-label="Previous project">Prev</button>
              <button type="button" onClick={() => goProject(1)} aria-label="Next project">Next</button>
            </div>
          </div>
        </section>

        <section id="education" className="panel split">
          <div className="copy-block blueprint">
            <p className="eyebrow">EDUCATION / 006</p>
            <h2>{education.degree}</h2>
            <p className="role">{education.field}</p>
            <p>{education.institution} · {education.years}</p>
            <p>{education.specialization} · CGPA {education.cgpa}</p>
            <div className="tag-row">{education.coursework.map((course) => <span key={course}>{course}</span>)}</div>
          </div>
        </section>

        <section id="activities" className="panel">
          <div className="section-top"><p className="eyebrow">RESEARCH & ACTIVITIES / 007</p><h2>Archive of professional signals</h2></div>
          <div className="activity-grid">
            {activities.map((activity) => (
              <article key={activity.category} className="activity-card">
                <p className="duration">{activity.category}</p>
                <h3>{activity.title}</h3>
                <ul>{activity.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="panel split contact-panel">
          <div className="copy-block">
            <p className="eyebrow">CONTACT / 008</p>
            <h2>Let's build the next system with intent.</h2>
            <p>Open to senior backend, full-stack, platform, and AI-adjacent engineering roles where reliability and product thinking matter.</p>
            <div className="social-row">
              {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>{link.icon}</a>)}
            </div>
          </div>
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <input name="name" placeholder="Name" autoComplete="name" />
            <input name="email" placeholder="Email" type="email" autoComplete="email" />
            <textarea name="message" placeholder="Message" rows={5} />
            <button className="btn btn-primary" type="submit">Send Message</button>
          </form>
        </section>

        <footer className="footer"><span>© 2026 Sriramasivam Thirumalaivasan</span><span>CYBERCORE SEQUENCE COMPLETE</span></footer>
      </main>
    </div>
  );
}

export default App;
