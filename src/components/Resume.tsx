import React, { useState } from "react";
import "./css/Resume.css";
import SkillCard from "./SkillCard";

type TabType = 'aboutme' | 'experience' | 'education' | 'skills';

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
    aboutme: {
      title: "About Me",
      content: "<strong>Senior Java Full Stack Developer</strong> with <em>4+ years</em> architecting <strong>enterprise-grade applications</strong>. Expert in <em>Java 17/21</em>, <strong>Spring Boot</strong>, and <strong>Microservices architecture</strong>. Proven track record in <em>end-to-end system design</em>, <strong>secure API development</strong>, and <em>React.js integration</em>. <strong>Cloud-native specialist</strong> with <em>Azure/AWS</em> expertise, <strong>CI/CD automation</strong>, and <em>resilient application design</em>. Successfully delivered <strong>AI-powered solutions</strong> while leading <em>cross-functional teams</em> and driving <strong>technical innovation</strong>."
    },
    experience: {
      title: "Work Experience",
      content: "<div class='experience-cards-container'><div class='experience-card'><div class='card-header'><h4>Senior Software Engineer</h4><span class='company'>Opentext</span><span class='duration'> 2025 - Present</span></div></div><div class='experience-card'><div class='card-header'><h4>Software Engineer</h4><span class='company'>Opentext</span><span class='duration'>2023 - 2025</span></div></div><div class='experience-card'><div class='card-header'><h4>Associate Software Engineer</h4><span class='company'>Opentext</span><span class='duration'>2021 - 2023</span></div></div></div>"
    },
    education: {
      title: "Education",
      content: "<div class='education-card'><div class='card-header'><h4>Bachelor of Technology in Computer Science</h4><span class='specialization'>Specialization in Software Engineering</span><span class='company'>SRM Institute of Science and Technology</span><span class='duration'>CGPA: 82.09%</span></div></div>"
    },
    skills: {
      title: "Skills",
      content: "<div class='skills-grid'><div class='skill-card' data-skill='Java'><span class='skill-logo'>☕</span><span class='skill-name'>Java</span></div><div class='skill-card' data-skill='Spring Boot'><span class='skill-logo'>🍃</span><span class='skill-name'>Spring Boot</span></div><div class='skill-card' data-skill='JavaScript'><span class='skill-logo'>🟨</span><span class='skill-name'>JavaScript</span></div><div class='skill-card' data-skill='React.js'><span class='skill-logo'>⚛️</span><span class='skill-name'>React.js</span></div><div class='skill-card' data-skill='Spring Security'><span class='skill-logo'>🔒</span><span class='skill-name'>Spring Security</span></div><div class='skill-card' data-skill='OAuth2'><span class='skill-logo'>🔑</span><span class='skill-name'>OAuth2</span></div><div class='skill-card' data-skill='Spring AI'><span class='skill-logo'>🤖</span><span class='skill-name'>Spring AI</span></div><div class='skill-card' data-skill='Microservices'><span class='skill-logo'>🔧</span><span class='skill-name'>Microservices</span></div><div class='skill-card' data-skill='Design Patterns'><span class='skill-logo'>🎨</span><span class='skill-name'>Design Patterns</span></div><div class='skill-card' data-skill='OOP'><span class='skill-logo'>📦</span><span class='skill-name'>OOP</span></div><div class='skill-card' data-skill='Load Balancing'><span class='skill-logo'>⚖️</span><span class='skill-name'>Load Balancing</span></div><div class='skill-card' data-skill='Apache Kafka'><span class='skill-logo'>📨</span><span class='skill-name'>Apache Kafka</span></div><div class='skill-card' data-skill='Azure'><span class='skill-logo'>☁️</span><span class='skill-name'>Azure</span></div><div class='skill-card' data-skill='AWS'><span class='skill-logo'>🌐</span><span class='skill-name'>AWS</span></div><div class='skill-card' data-skill='Docker'><span class='skill-logo'>🐳</span><span class='skill-name'>Docker</span></div><div class='skill-card' data-skill='CI/CD'><span class='skill-logo'>🔄</span><span class='skill-name'>CI/CD pipelines</span></div><div class='skill-card' data-skill='MSSQL'><span class='skill-logo'>🗄️</span><span class='skill-name'>MSSQL</span></div><div class='skill-card' data-skill='PostgreSQL'><span class='skill-logo'>🐘</span><span class='skill-name'>PostgreSQL</span></div><div class='skill-card' data-skill='Redis'><span class='skill-logo'>🔴</span><span class='skill-name'>Redis</span></div><div class='skill-card' data-skill='APIs'><span class='skill-logo'>🔗</span><span class='skill-name'>Secure APIs</span></div><div class='skill-card' data-skill='Git'><span class='skill-logo'>📝</span><span class='skill-name'>Git</span></div><div class='skill-card' data-skill='JIRA'><span class='skill-logo'>📋</span><span class='skill-name'>JIRA</span></div><div class='skill-card' data-skill='Agile'><span class='skill-logo'>🏃</span><span class='skill-name'>Agile Methodology</span></div><div class='skill-card' data-skill='RCA'><span class='skill-logo'>🔍</span><span class='skill-name'>RCA</span></div><div class='skill-card' data-skill='Security'><span class='skill-logo'>🛡️</span><span class='skill-name'>Security Advocacy</span></div><div class='skill-card' data-skill='Mentorship'><span class='skill-logo'>👥</span><span class='skill-name'>Mentorship</span></div></div>"
    }
  };

  return (
    <div id="experience" className="resume-wrapper">
      <div className="glass-box-r">
        <div className="resume-content">
          <h2 className="resume-title">Experience</h2>
          
          <div className="tabs-container">
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
              {Object.entries(tabContent).map(([tab, data]) => (
                <div
                  key={tab}
                  className={`tab-panel ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab === 'skills' ? (
                    <div className='skills-grid'>
                      {skills.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                      ))}
                    </div>
                  ) : (
                    <p dangerouslySetInnerHTML={{ __html: data.content }}></p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
