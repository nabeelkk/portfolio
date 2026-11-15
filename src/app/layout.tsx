import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { Cursor } from '@/components/layout/Cursor';
import { Footer } from '@/components/layout/Footer';
import { Grain } from '@/components/layout/Grain';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { Preloader, preloaderInitScript } from '@/components/layout/Preloader';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { TouchActivator } from '@/components/layout/TouchActivator';
import { profile } from '@/data/profile';
import { BASE_PATH, SITE_URL } from '@/lib/utils';
import '@/styles/globals.css';

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const TITLE = 'Muhammed Nabeel KK — Full-Stack Developer & Founder of AISYNX';
const DESCRIPTION =
  'Full-Stack Developer and founder of AISYNX. I design, build and ship software end to end: multi-tenant ERPs, SaaS products, mobile apps, real-time apps and live websites, with React, Next.js, TypeScript, Node.js, NestJS and PostgreSQL.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s — Muhammed Nabeel KK' },
  description: DESCRIPTION,
  applicationName: 'Muhammed Nabeel KK',
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    'Muhammed Nabeel KK',
    'Nabeel KK',
    'Full-Stack Developer',
    'AISYNX',
    'React developer',
    'Next.js developer',
    'Node.js',
    'NestJS',
    'TypeScript',
    'ERP developer',
    'SaaS',
    'React Native',
    'Kerala',
    'India',
    'Remote developer',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Muhammed Nabeel KK',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${BASE_PATH}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: `${BASE_PATH}/apple-touch-icon.png`,
  },
  manifest: `${BASE_PATH}/manifest.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: 'Full-Stack Developer',
  url: SITE_URL,
  image: `${SITE_URL}${profile.photo.src}`,
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Manjeri',
    addressRegion: 'Kerala',
    addressCountry: 'IN',
  },
  worksFor: { '@id': `${profile.aisynx.url}/#organization` },
  founder: { '@id': `${profile.aisynx.url}/#organization` },
  knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'React Native', 'ERP systems'],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'RR Institute of Technology' },
    { '@type': 'EducationalOrganization', name: 'Brototype' },
  ],
  sameAs: [profile.linkedin, profile.github, profile.aisynx.url],
};
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${profile.aisynx.url}/#organization`,
  name: 'AISYNX',
  url: profile.aisynx.url,
  slogan: profile.aisynx.tagline,
  foundingDate: profile.aisynx.founded,
  founder: { '@type': 'Person', name: profile.name, url: SITE_URL },
  sameAs: [profile.aisynx.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderInitScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}.intro-rise,.intro-shift,.intro-fade{animation-play-state:running!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, orgJsonLd]) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[110] -translate-y-[200%] rounded-full bg-accent px-4 py-2 font-medium text-accent-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll />
        <PageTransition>
          <Navbar />
          {children}
          <Footer />
        </PageTransition>
        <Grain />
        <Cursor />
        <TouchActivator />
      </body>
    </html>
  );
}
