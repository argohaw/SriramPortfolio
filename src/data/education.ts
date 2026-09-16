export interface Education {
  degree: string;
  field: string;
  institution: string;
  years: string;
  cgpa: string;
  specialization: string;
  coursework: string[];
}

export const education: Education = {
  degree: 'Bachelor of Technology',
  field: 'Computer Science & Engineering',
  institution: 'SRM Institute of Science and Technology',
  years: '2017 - 2021',
  cgpa: '8.2 / 10',
  specialization: 'Specialization in Software Engineering',
  coursework: [
    'Data Structures', 'Algorithms', 'OS', 'DBMS',
    'Computer Networks', 'Software Engineering', 'OOP', 'Web Development',
  ],
};
