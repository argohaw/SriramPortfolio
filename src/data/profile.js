import { asset } from '../lib/asset'
export const profile = {
  name: 'Sriramasivam Thirumalaivasan',
  firstName: 'Sriramasivam',
  headerName: 'Sriram', // short name shown in the header only
  lastName: 'Thirumalaivasan',
  roles: ['Senior Software Engineer', 'Full-Stack Developer', 'AI Enthusiast'],
  tagline:
    'I build high-throughput distributed systems and turning complex problems into clean, elegant solutions at the intersection of design and technology',
  photo: asset('profile.png'),
  about: [
    "Hi! I'm Sriramasivam, a software engineer who loves crafting robust systems and pixel-perfect interfaces. I enjoy owning features end-to-end from database design and APIs to polished, accessible front-ends.",
    "I'm driven by curiosity and a passion for clean architecture. When I'm not coding, you'll find me exploring new tech, trying POCs, or mentoring at hackathons.",
  ],
  coreStack: ['Java', 'Spring Boot', 'React.js', 'AI', 'AWS'],
  email: 'tsriram2310@gmail.com',
  location: 'India',
  socials: {
    github: 'https://github.com/SriramThirumalaivasan',
    linkedin: 'https://www.linkedin.com/in/sriram-thirumalaivasan/',
    instagram: 'https://www.instagram.com/sriram.thirumalaivasan/',
  },
}
