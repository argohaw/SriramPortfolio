// Résumé downloads shown in the header and Contact section.
// Put the PDF files in public/resumes/ using exactly these file names
// (or change `file` below to match yours).
import { asset } from '../lib/asset'

const OWNER = 'Sriramasivam_Thirumalaivasan'

export const resumes = [
  {
    id: 'india',
    code: 'IN',
    country: 'India',
    options: [
      { id: 'india-fullstack', label: 'Full-stack', file: asset('resumes/Sriramasivam_FS_Resume.pdf'), downloadAs: `${OWNER}_Resume_India_FullStack.pdf` },
      { id: 'india-backend', label: 'Backend', file: asset('resumes/Sriramasivam_B_Resume.pdf'), downloadAs: `${OWNER}_Resume_India_Backend.pdf` },
    ],
  },
  { id: 'germany', code: 'DE', country: 'Germany', file: asset('resumes/CV_Sriramasivam_Thirumalaivasan.pdf'), downloadAs: `${OWNER}_Resume_Germany.pdf` },
  { id: 'netherlands', code: 'NL', country: 'Netherlands', file: asset('resumes/Sriramasivam_Thirumalaivasan_CV.pdf'), downloadAs: `${OWNER}_Resume_Netherlands.pdf` },
  { id: 'uk', code: 'UK', country: 'UK', file: asset('resumes/Sriramasivam CV.pdf'), downloadAs: `${OWNER}_Resume_UK.pdf` },
]
