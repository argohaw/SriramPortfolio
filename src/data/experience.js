// Placeholder data — replace with your real experience.
import { asset } from '../lib/asset'

export const experience = [
  {
    id: 'exp-1',
    role: 'Senior Software Engineer',
    company: 'Matillion',
    // `fit: 'contain'` = transparent logo shown on a light tile; `'cover'` = logo fills the tile
    logo: { src: asset('maia-logo.png'), fit: 'contain' },
    location: 'Hyderabad, India',
    duration: 'Dec 2025 – Present',
    highlights: [
      'Driving multi-tenant security architecture and AI-driven automation.',
      'Building cloud-native microservices on Azure with high availability.',
      'Leading backend design for enterprise-scale data integration pipelines.',
    ],
    stack: ['Java', 'Spring Boot', 'React.js', 'AWS', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL'],
    description:
      'Owned the IAM team responsible for customer-facing analytics. Partnered with product and design to ship features end-to-end while improving reliability and developer experience.',
    details: [
      'Engineered 3 high-throughput microservices handling 5M+ daily requests',
      'Developed 10+ autonomous agent workflows on the claude API and MCP to cut down 60% of the workload of manual SSO setups and permission management',
      'Achieved 95% test coverage by delivering comprehensive unit, integrations, and E2E test suites',
      'Resolving high-priority incidents on 24/7 on-call rotations',
      'Mentored 2 junior developers',
    ],
  },
  {
    id: 'exp-2',
    role: 'Software Engineer',
    company: 'Opentext',
    logo: { src: asset('opentext-logo.png'), fit: 'cover' },
    location: 'Hyderabad, India',
    duration: 'Oct 2023 – Nov 2025',
    highlights: [
      'Developed REST APIs serving 1M+ requests per day for enterprise users.',
      'Architected OAuth2/Spring Security auth platform across product lines.',
      'Reduced API latency by 40% through caching and query optimisation',
    ],
    stack: ['Java', 'Spring Security', 'React', 'OAuth2', 'Kafka', 'AWS'],
    description:
      'Worked in the Enterprise management tool squad building backend services and internal tools for healthcare customers.',
    details: [
      'Modernised the core architecture of a legacy Java 11 EJB monolith to cloud-native Spring Boot microservices.',
      'Constructed fully responsive, reusable UI component library for a data-driven analytics dashboard using react and hooks.',
      'Rebuilt the CI/CD pipeline around docket and GitOps to shrink the release cycle from weeks to days, and deployment failures dropped by 40%.',
      'Strengthened the system reliability of 2 product lines by serving as a formal Security and Build Advocate while mentoring 2 engineers on secure coding.',
    ],
  },
  {
    id: 'exp-3',
    role: 'Associate Software Engineer',
    company: 'Opentext',
    logo: { src: asset('opentext-logo.png'), fit: 'cover' },
    location: 'Hyderabad, India',
    duration: 'May 2021 – Sep 2023',
    highlights: [
      'Built and maintained full-stack features across enterprise content management.',
      'Automated CI/CD pipelines reducing deployment time by 60%.',
      'Led code review sessions on secure coding.',
    ],
    stack: ['Java', 'React', 'Docker', 'CI/CD', 'JSP', 'EJB'],
    description:
      'Joined the EIM team to digitise operational workflows and improve data visibility.',
    details: [
      'Tuned Hibernate ORM mapping and PostgreSQL queries, bring p99 latency from 21ms to 5ms.',
      'Standardised automated build efficiency by leading the migration from legacy Ant to Maven embedding automated unit/integration test suites.'
    ],
  },
]
