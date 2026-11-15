import type { Experience } from './types';

/** Newest first. A period of "TODO" is hidden in the UI. */
export const experience: Experience[] = [
  {
    // TODO: confirm title "Founder & Lead Engineer"
    company: 'AISYNX',
    role: 'Founder & Lead Engineer',
    location: 'Manjeri, Kerala',
    period: '2025 – Present',
    current: true,
    url: 'https://aisynx.in',
    bullets: [
      'Founded AISYNX, a technology studio building ERP solutions, custom software, SaaS platforms, mobile apps and websites for SMEs and founders; designed and built the company website aisynx.in end to end.',
      'Architecting multi-tenant ERP platforms (Construction, Architectural Consultancy, Medical Calibration) with organisation/company/branch tenancy, granular RBAC, audit trails and approval workflows.',
      'Building in-house products: Remora (React Native commitment manager), Nova (native Android widget platform) and Learning Hub (AI-assisted learning platform).',
      'Delivered live websites for clients including Last Chance, Le Roland Sandse, Felancci Le’Atelier, coredotr and Artis Build.',
      'Runs a 5-stage delivery process: Discover → Define → Design → Build & Validate → Launch & Improve.',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'NestJS',
      'Node.js',
      'PostgreSQL',
      'Prisma',
      'Redis',
      'BullMQ',
      'React Native',
      'Kotlin',
      'Docker',
    ],
  },
  {
    company: 'Nexcrest IT',
    role: 'Senior React.js Developer',
    location: 'Kannur, India',
    period: 'TODO', // TODO: add dates
    bullets: [
      'Led front-end development of two major products: an Institution Management ERP and a CRM platform.',
      'Built core ERP modules: student management, staff management, attendance tracking and reporting.',
      'Developed CRM features: lead management, customer tracking and sales workflow automation.',
      'Designed responsive, reusable, scalable UI components and integrated RESTful APIs for dynamic data.',
      'Implemented efficient state management and performance optimisations; ensured cross-browser and mobile responsiveness.',
      'Collaborated with backend developers and stakeholders in an agile environment through debugging, testing and continuous improvement.',
    ],
    stack: ['React.js', 'Redux', 'REST APIs', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
  },
  {
    company: 'Aventus Informatics',
    role: 'React Developer',
    location: 'Thrissur, India',
    period: 'TODO', // TODO: add dates
    bullets: [
      'Worked on City Beach, an AI-driven e-commerce web application.',
      'Integrated AI-powered features for personalised product recommendations.',
      'Managed app settings, feature flags and environment-based configs with TOML.',
      'Built responsive, reusable components; worked with the backend and AI teams to consume APIs.',
      'Optimised components and state management; took part in code reviews.',
    ],
    stack: ['React.js', 'REST APIs', 'TOML', 'AI integrations'],
  },
  {
    company: 'Qbize Technologies',
    role: 'Web Designer',
    location: 'Bangalore, India',
    period: '2021 – 2022', // TODO: confirm (taken from the legacy site)
    bullets: [
      'Designed a user-friendly, responsive e-commerce website with HTML, CSS and JavaScript.',
      'Designed a subscription section and integrated MSGBOSS for bulk WhatsApp and SMS messaging.',
      'Redesigned and maintained a school-management SaaS product.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
  },
  {
    company: 'Freelance',
    role: 'Full-Stack Web Developer',
    location: 'Remote',
    period: 'Jan 2022 – Present',
    current: true,
    bullets: [
      'Delivered end-to-end solutions for clients: e-commerce platforms, real-time chat apps, ERPs, and static and dynamic websites.',
      'Built UIs with React, Next.js, Tailwind, Bootstrap and EJS; backends with Node.js, Express, MongoDB and PostgreSQL, including payment gateways, auth and API integrations.',
      'Implemented real-time features with Socket.IO; deployed on AWS, Vercel, Render and GitHub Pages with Git-based CI/CD.',
      'Owned every stage: requirements, architecture, development, deployment and maintenance.',
    ],
    stack: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Socket.IO', 'AWS'],
  },
];
