export interface SkillGroup {
  layer: string;
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    layer: 'core',
    label: 'Energy Core',
    skills: ['Java', 'Spring Boot', 'Spring Framework'],
  },
  {
    layer: 'inner',
    label: 'Inner Assembly',
    skills: ['Microservices', 'REST APIs', 'Spring Security', 'OAuth2', 'Distributed Systems'],
  },
  {
    layer: 'circuit',
    label: 'Circuit Layer',
    skills: ['Apache Kafka', 'Event-Driven Architecture', 'Spring AI'],
  },
  {
    layer: 'infra',
    label: 'Infrastructure Ring',
    skills: ['Docker', 'Kubernetes', 'Azure', 'AWS', 'CI/CD', 'Terraform'],
  },
  {
    layer: 'interface',
    label: 'Interface Layer',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'],
  },
  {
    layer: 'data',
    label: 'Data Layer',
    skills: ['PostgreSQL', 'MSSQL', 'Redis', 'Design Patterns', 'OOP'],
  },
];

export const allSkills = skillGroups.flatMap(g => g.skills);
