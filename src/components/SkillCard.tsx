import React from 'react';
import { 
  SiSpring, SiJavascript, SiReact,
  SiAmazon, SiDocker, 
  SiPostgresql, SiRedis, SiGit, SiJira, SiApachekafka
} from 'react-icons/si';
import { 
  MdSecurity, MdDesignServices, MdBalance, MdApi, MdGroup,
  MdSmartToy, MdLoop, MdSearch, MdShield, MdDirectionsRun
} from 'react-icons/md';
import { FaCode } from 'react-icons/fa';

interface SkillCardProps {
  skill: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const getSkillIcon = (skillName: string) => {
    switch (skillName.toLowerCase()) {
      case 'java': return <FaCode />;
      case 'spring boot': return <SiSpring />;
      case 'javascript': return <SiJavascript />;
      case 'react.js': return <SiReact />;
      case 'spring security': return <MdSecurity />;
      case 'oauth2': return <MdSecurity />;
      case 'spring ai': return <MdSmartToy />;
      case 'microservices': return <MdDesignServices />;
      case 'design patterns': return <MdDesignServices />;
      case 'oop': return <FaCode />;
      case 'load balancing': return <MdBalance />;
      case 'apache kafka': return <SiApachekafka />;
      case 'azure': return <MdDesignServices />;
      case 'aws': return <SiAmazon />;
      case 'docker': return <SiDocker />;
      case 'ci/cd pipelines': return <MdLoop />;
      case 'mssql': return <MdDesignServices />;
      case 'postgresql': return <SiPostgresql />;
      case 'redis': return <SiRedis />;
      case 'secure apis': return <MdApi />;
      case 'git': return <SiGit />;
      case 'jira': return <SiJira />;
      case 'agile methodology': return <MdDirectionsRun />;
      case 'rca': return <MdSearch />;
      case 'security advocacy': return <MdShield />;
      case 'mentorship': return <MdGroup />;
      default: return <FaCode />;
    }
  };

  return (
    <div className='skill-card' data-skill={skill}>
      <span className='skill-logo'>
        {getSkillIcon(skill)}
      </span>
      <span className='skill-name'>{skill}</span>
    </div>
  );
};

export default SkillCard;