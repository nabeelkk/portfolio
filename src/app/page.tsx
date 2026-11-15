import { About } from '@/components/sections/About';
import { ClientWebsites, type ClientMedia } from '@/components/sections/ClientWebsites';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { FeaturedProjects, type MediaMap } from '@/components/sections/FeaturedProjects';
import { Hero } from '@/components/sections/Hero';
import { MoreProjects } from '@/components/sections/MoreProjects';
import { Services } from '@/components/sections/Services';
import { Skills } from '@/components/sections/Skills';
import { Studio } from '@/components/sections/Studio';
import { TechMarquee } from '@/components/sections/TechMarquee';
import { clientSites, projects } from '@/data/projects';
import { getClientSiteMedia, getProjectMedia, getStudioShot } from '@/lib/media.server';

export default function HomePage() {
  // Resolved at build time: only images that exist in /public are passed down.
  const media: MediaMap = Object.fromEntries(projects.map((p) => [p.slug, getProjectMedia(p)]));
  const clientMedia: ClientMedia = Object.fromEntries(clientSites.map((s) => [s.slug, getClientSiteMedia(s)]));

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero />
      <TechMarquee />
      <About />
      <Experience />
      <FeaturedProjects media={media} />
      <Studio shot={getStudioShot()} />
      <ClientWebsites media={clientMedia} />
      <MoreProjects media={media} />
      <Skills />
      <Services />
      <Education />
      <Contact />
    </main>
  );
}
