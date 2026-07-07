import React, { useState } from "react";
import "./css/Resume.css";
import SkillCard from "./SkillCard";

type TabType = 'aboutme' | 'experience' | 'education' | 'skills';

const AboutMe: React.FC = () => (
  <div className="aboutme-container">
    <p className="aboutme-intro">
      Senior Software Engineer based in <span className="highlight">Hyderabad</span> with over{" "}
      <span className="highlight">5 years</span> of experience specializing in high-throughput
      distributed systems and cloud-native microservices.
    </p>
    <p className="aboutme-body">
      Built a strong foundation over nearly five years at{" "}
      <span className="highlight">OpenText</span>, progressing from Associate to enterprise-level
      engineer. Currently driving advanced backend,{" "}
      <span className="highlight">multi-tenant security architecture</span>, and{" "}
      <span className="highlight">AI-driven automation</span> at{" "}
      <span className="highlight">Matillion</span>.
    </p>
    <div className="aboutme-stats">
      <div className="stat-chip">⚡ 5+ Years Experience</div>
      <div className="stat-chip">🏢 2 Companies</div>
      <div className="stat-chip">☁️ Azure &amp; AWS</div>
      <div className="stat-chip">🔒 Security Specialist</div>
    </div>
    <p className="aboutme-personal">
      Outside of work —{" "}
      <span className="highlight-soft">competitive gamer</span>,{" "}
      <span className="highlight-soft">automotive enthusiast</span>, and a die-hard{" "}
      <span className="highlight-soft">cricket, F1, Football fan</span>
    </p>
  </div>
);

import matillionLogo from "../assets/maia-logo.png";
import opentextLogo from "../assets/opentext logo.png";

const experiences = [
  {
    role: "Senior Software Engineer",
    company: "Matillion",
    logo: matillionLogo,
    fill: false,
    duration: "2025 — Present",
    type: "Full-time",
    tags: ["Java", "Spring Boot", "AI", "Microservices"],
    bullets: [
      "Driving multi-tenant security architecture and AI-driven automation.",
      "Building cloud-native microservices on Azure with high availability.",
      "Leading backend design for enterprise-scale data integration pipelines.",
    ],
  },
  {
    role: "Software Engineer",
    company: "OpenText",
    logo: opentextLogo,
    fill: true,
    duration: "2023 — 2025",
    type: "Full-time",
    tags: ["Java", "Spring Security", "OAuth2", "Kafka"],
    bullets: [
      "Delivered high-throughput REST APIs serving millions of enterprise users.",
      "Architected OAuth2 / Spring Security auth platform across product lines.",
      "Reduced API latency by 40% through caching and query optimization.",
    ],
  },
  {
    role: "Associate Software Engineer",
    company: "OpenText",
    logo: opentextLogo,
    fill: true,
    duration: "2021 — 2023",
    type: "Full-time",
    tags: ["Java", "React", "Docker", "CI/CD"],
    bullets: [
      "Built and maintained full-stack features across enterprise content management.",
      "Automated CI/CD pipelines reducing deployment time by 60%.",
      "Mentored junior engineers and led code review sessions.",
    ],
  },
];

const WorkExperience: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState(0);

  return (
    <div className="timeline">
      <div className="timeline-track">
        {experiences.map((exp, i) => (
          <div className="timeline-item" key={i} onClick={() => setSelectedExp(i)}>
            <div className="timeline-top">
              <div className="timeline-line-left" />
              <div className={`timeline-logo ${exp.fill ? 'fill' : ''} ${selectedExp === i ? 'active' : ''}`}>
                <img src={exp.logo} alt={exp.company} />
              </div>
              <div className="timeline-line-right" />
            </div>
            <div className={`timeline-card ${selectedExp === i ? 'active' : ''}`}>
              <div className="timeline-card-top">
                <h4 className="timeline-role">{exp.role}</h4>
                <span className="timeline-company">{exp.company}</span>
                <div className="timeline-meta">
                  <span className="timeline-duration">{exp.duration}</span>
                  <span className="timeline-type">{exp.type}</span>
                </div>
              </div>
              <ul className="timeline-bullets">
                {exp.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <div className="timeline-tags">
                {exp.tags.map((tag, k) => (
                  <span className="timeline-tag" key={k}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Education: React.FC = () => (
  <div className="education-container">
    <div className="edu-card">
      <div className="edu-header">
        <div className="edu-header-text">
          <h3 className="edu-degree">Bachelor of Technology</h3>
          <span className="edu-field">Computer Science & Engineering</span>
        </div>
      </div>
      <div className="edu-divider" />
      <div className="edu-body">
        <div className="edu-institution">SRM Institute of Science and Technology</div>
        <div className="edu-meta">
          <span className="edu-meta-item">2017 — 2021</span>
          <span className="edu-meta-item edu-cgpa">CGPA: 8.2 / 10</span>
        </div>
        <div className="edu-specialization">Specialization in Software Engineering</div>
      </div>
      <div className="edu-tags">
        {["Data Structures", "Algorithms", "OS", "DBMS", "Computer Networks", "Software Engineering", "OOP", "Web Development"].map(c => (
          <span className="edu-tag" key={c}>{c}</span>
        ))}
      </div>
    </div>
  </div>
);

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('aboutme');

  const skills = [
    'Java', 'Spring Boot', 'JavaScript', 'React.js', 'Spring Security', 'OAuth2',
    'Spring AI', 'Microservices', 'Design Patterns', 'OOP', 'Load Balancing',
    'Apache Kafka', 'Azure', 'AWS', 'Docker', 'CI/CD pipelines', 'MSSQL',
    'PostgreSQL', 'Redis', 'Secure APIs', 'Git', 'JIRA', 'Agile Methodology',
    'RCA', 'Security Advocacy', 'Mentorship'
  ];

  const tabContent = {
    aboutme: { title: "About Me", content: "" },
    experience: {
      title: "Work Experience",
      content: ""
    },
    education: { title: "Education", content: "" },
    skills: { title: "Skills", content: "" }
  };

  return (
    <div id="experience" className="resume-wrapper">
      <div className="resume-title-box">
        <h2 className="resume-title">Experience</h2>
      </div>
      <div className="resume-body">
        <div className="tabs-nav">
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab as TabType)}
            >
              {tabContent[tab as TabType].title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {Object.entries(tabContent).map(([tab, _]) => (
            <div
              key={tab}
              className={`tab-panel ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'aboutme' ? (
                <AboutMe />
              ) : tab === 'experience' ? (
                <WorkExperience />
              ) : tab === 'skills' ? (
                <div className='skills-grid'>
                  {skills.map((skill, index) => (
                    <SkillCard key={index} skill={skill} />
                  ))}
                </div>
              ) : tab === 'education' ? (
                <Education />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resume;
