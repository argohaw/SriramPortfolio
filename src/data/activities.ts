export interface Activity {
  category: string;
  title: string;
  items: string[];
}

export const activities: Activity[] = [
  {
    category: 'Publication',
    title: 'Research Publications',
    items: [
      'Secure E-Voting System using Blockchain Based on Solidity Technology - AIP Publishing',
      'Secure Patient Records using Multi-Level Encryption - SRM Research Day',
    ],
  },
  {
    category: 'Conference',
    title: 'Conferences',
    items: [
      'AIP Publishing',
      "ICMTA'21 at SRMIST",
      'SRM Research Day',
    ],
  },
  {
    category: 'Hackathon',
    title: 'Hackathons',
    items: [
      'DBMS Hackathon - SRMIST',
      '2x Top 5 - OpenText Hackathon',
      'Google Foobar Challenge',
      'SRM Developer Students Club Hackathon',
    ],
  },
  {
    category: 'Workshop',
    title: 'Workshops',
    items: [
      'Actions on Google - SRM Developer Students Club',
      'Aaruush - National-level Techno-Management Club',
      'Agile DevOps - Renault-Nissan-Mitsubishi',
    ],
  },
];
