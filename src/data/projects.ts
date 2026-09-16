import ARGUS from '../components/reactbits/assets/ARGUS.png';
import Bookhouse from '../components/reactbits/assets/Bookhouse.png';
import CarsAreana from '../components/reactbits/assets/Cars-Areana.png';
import Case360 from '../components/reactbits/assets/Case360.png';
import CheckMate from '../components/reactbits/assets/CheckMate.png';
import DeployInator from '../components/reactbits/assets/Deploy-Inator.png';
import HireWire from '../components/reactbits/assets/HireWire.png';
import IDMWV from '../components/reactbits/assets/IDMWV.png';
import MechHooter from '../components/reactbits/assets/Mech-Hooter.png';
import Resum8 from '../components/reactbits/assets/Resum8.png';
import RoomInator from '../components/reactbits/assets/Room-inator.png';
import VMInator from '../components/reactbits/assets/VM-Inator.png';
import WareHouse from '../components/reactbits/assets/WareHouse-Using-Vertica.png';

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  { title: 'ARGUS', description: 'Intelligent surveillance and monitoring system.', image: ARGUS, tags: ['Java', 'AI', 'Spring Boot'] },
  { title: 'Bookhouse', description: 'Full-stack book management and discovery platform.', image: Bookhouse, tags: ['React', 'Node.js', 'MongoDB'] },
  { title: 'Cars Arena', description: 'Automotive configurator and comparison tool.', image: CarsAreana, tags: ['React', 'TypeScript'] },
  { title: 'Case360', description: 'Enterprise case management system.', image: Case360, tags: ['Java', 'Spring Boot', 'PostgreSQL'] },
  { title: 'CheckMate', description: 'Real-time chess platform with AI opponent.', image: CheckMate, tags: ['React', 'WebSocket', 'Java'] },
  { title: 'Deploy-Inator', description: 'Automated deployment orchestration tool.', image: DeployInator, tags: ['Docker', 'CI/CD', 'Shell'] },
  { title: 'HireWire', description: 'Recruitment and talent acquisition platform.', image: HireWire, tags: ['React', 'Java', 'Spring Boot'] },
  { title: 'IDMWV', description: 'Identity management and verification system.', image: IDMWV, tags: ['Java', 'OAuth2', 'Security'] },
  { title: 'Mech-Hooter', description: 'Mechanical keyboard sound simulator.', image: MechHooter, tags: ['JavaScript', 'Web Audio API'] },
  { title: 'Resum8', description: 'AI-powered resume builder and optimizer.', image: Resum8, tags: ['React', 'AI', 'TypeScript'] },
  { title: 'Room-inator', description: 'Interior design and room planning tool.', image: RoomInator, tags: ['React', 'Three.js'] },
  { title: 'VM-Inator', description: 'Virtual machine provisioning automation.', image: VMInator, tags: ['Python', 'Cloud', 'Terraform'] },
  { title: 'WareHouse Vertica', description: 'Data warehouse analytics with Vertica.', image: WareHouse, tags: ['SQL', 'Vertica', 'Analytics'] },
];
