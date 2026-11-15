import type { Service } from './types';

export const services: Service[] = [
  {
    title: 'ERP & Business Software',
    description:
      'Multi-tenant, role-based, workflow-heavy enterprise apps: organisation → company → branch tenancy, granular permissions, approvals and audit trails.',
    tags: ['Multi-tenant', 'RBAC', 'Workflows', 'Audit trails'],
  },
  {
    title: 'Full-Stack Web Apps & SaaS',
    description:
      'Production web applications and SaaS platforms with Next.js, NestJS and Node.js on PostgreSQL or MongoDB, from data model to deployment.',
    tags: ['Next.js', 'NestJS', 'Node.js', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Mobile Apps',
    description:
      'Cross-platform apps with React Native and Expo, and native Android with Kotlin and Jetpack Compose.',
    tags: ['React Native', 'Expo', 'Kotlin', 'Jetpack Compose'],
  },
  {
    title: 'E-commerce & Brand Websites',
    description:
      'Immersive storefronts and story-led brand sites with payments, order management and fast, responsive UI.',
    tags: ['Storefronts', 'Payments', 'Orders', 'SEO'],
  },
  {
    title: 'Real-Time, AI & Integrations',
    description:
      'WebSockets, payment gateways, WhatsApp/SMS messaging and AI document workflows wired into real products.',
    tags: ['Socket.IO', 'Razorpay', 'WhatsApp/SMS', 'AI extraction'],
  },
  {
    title: 'UI Engineering & Design',
    description:
      'Figma to responsive, accessible, animated interfaces, with design systems that stay consistent as the product grows.',
    tags: ['Figma', 'Accessibility', 'Motion', 'Design systems'],
  },
];

/** AISYNX service areas (studio spotlight chips). */
export const studioServices = [
  'ERP & Business Software',
  'Custom Web Apps',
  'SaaS',
  'Mobile Apps',
  'E-commerce',
  'AI & Workflow Automation',
];

export const studioProcess = [
  { step: 'Discover', text: 'Understand the business, users and constraints.' },
  { step: 'Define', text: 'Scope, requirements and architecture decisions.' },
  { step: 'Design', text: 'Flows, UI and the data model, designed together.' },
  { step: 'Build & Validate', text: 'Iterative delivery with tests and reviews.' },
  { step: 'Launch & Improve', text: 'Deploy, monitor and keep improving.' },
];

export const studioClients = [
  'FELANCCI',
  'CORE.R',
  'ARTIS BUILD',
  'LAST CHANCE',
  'LE ROLAND SANDSE',
  'MMM',
];
