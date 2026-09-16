import matillionLogo from '../assets/maia-logo.png';
import opentextLogo from '../assets/opentext logo.png';

export interface Experience {
  company: string;
  role: string;
  logo: string;
  logoFill: boolean;
  duration: string;
  start: string;
  end: string;
  type: string;
  tags: string[];
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Matillion',
    role: 'Senior Software Engineer',
    logo: matillionLogo,
    logoFill: false,
    duration: '2025 - Present',
    start: '2025',
    end: 'Present',
    type: 'Full-time',
    tags: ['Java', 'Spring Boot', 'AI', 'Microservices', 'Azure'],
    bullets: [
      'Driving multi-tenant security architecture and AI-driven automation.',
      'Building cloud-native microservices on Azure with high availability.',
      'Leading backend design for enterprise-scale data integration pipelines.',
    ],
  },
  {
    company: 'OpenText',
    role: 'Software Engineer',
    logo: opentextLogo,
    logoFill: true,
    duration: '2023 - 2025',
    start: '2023',
    end: '2025',
    type: 'Full-time',
    tags: ['Java', 'Spring Security', 'OAuth2', 'Kafka'],
    bullets: [
      'Delivered high-throughput REST APIs serving millions of enterprise users.',
      'Architected OAuth2 / Spring Security auth platform across product lines.',
      'Reduced API latency by 40% through caching and query optimization.',
    ],
  },
  {
    company: 'OpenText',
    role: 'Associate Software Engineer',
    logo: opentextLogo,
    logoFill: true,
    duration: '2021 - 2023',
    start: '2021',
    end: '2023',
    type: 'Full-time',
    tags: ['Java', 'React', 'Docker', 'CI/CD'],
    bullets: [
      'Built and maintained full-stack features across enterprise content management.',
      'Automated CI/CD pipelines reducing deployment time by 60%.',
      'Mentored junior engineers and led code review sessions.',
    ],
  },
];
