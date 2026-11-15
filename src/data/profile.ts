export const profile = {
  name: 'Muhammed Nabeel KK',
  shortName: 'Nabeel',
  firstLine: 'MUHAMMED',
  secondLine: 'NABEEL',
  title: 'Full-Stack Developer · Founder of AISYNX',
  // TODO: confirm "Open to remote and relocation"
  location: 'Manjeri, Malappuram, Kerala, India',
  locationShort: 'Kerala, India',
  availability: 'Available for work',
  openTo: 'Open to remote roles and relocation',
  email: 'mohammednabeelkk.tkl@gmail.com',
  phone: '+91 8089222453',
  phoneHref: 'tel:+918089222453',
  whatsapp: 'https://wa.me/918089222453',
  website: 'https://nabeelkk.store',
  linkedin: 'https://www.linkedin.com/in/muhammed-nabeel-kk-7aa729379/',
  github: 'https://github.com/nabeelkk',
  resume: '/Muhammed_Nabeel_KK_Resume.pdf',
  photo: { src: '/images/nabeel.webp', width: 548, height: 507 },

  aisynx: {
    name: 'AISYNX',
    url: 'https://aisynx.in',
    github: 'https://github.com/AisynxAi',
    logo: '/images/aisynx-logo.png',
    tagline: 'Engineering the Future of Software.',
    founded: '2025',
    location: 'Manjeri, Kerala',
  },

  rotatingWords: [
    'ERP systems',
    'SaaS products',
    'mobile apps',
    'real-time apps',
    'luxury e-commerce',
  ],

  intro:
    'I design, build and ship software end to end, from multi-tenant ERPs and mobile apps to real-time chat and brand websites, with clean architecture and pixel-perfect UI.',

  statement:
    'I care about the parts users never see, like data models, permissions and audit trails, as much as the pixels they do. Architecture first, interfaces with care, shipped end to end.',

  summary:
    'Full-Stack Developer and founder of AISYNX, a software studio I designed, built and run. I ship software end to end, from multi-tenant ERP platforms, SaaS products and mobile apps to real-time chat apps, AI-driven e-commerce and live websites for real businesses. I work across React.js, Next.js, TypeScript, Node.js, NestJS, Express.js, React Native, PostgreSQL (Prisma), MongoDB and Redis, and I care about clean architecture (SOLID, MVC), secure authentication (JWT, RBAC), performance and pixel-perfect, responsive UI. Comfortable owning a product end to end: requirements, architecture, development, CI/CD and cloud deployment on AWS, Vercel and Render.',

  /** Edit freely: rendered as animated counters in the About section. */
  stats: [
    { value: 4, suffix: '+', label: 'Years building for the web' },
    { value: 1, suffix: '', label: 'Software studio founded' },
    { value: 25, suffix: '+', label: 'Projects built' },
    { value: 5, suffix: '', label: 'Live client websites' },
  ],
} as const;

export const socials = [
  { label: 'GitHub', href: profile.github, icon: 'github' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
] as const;

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'studio', label: 'Studio' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;
