import { Globe, Mail, Phone } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

const MAP = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  mail: Mail,
  phone: Phone,
  whatsapp: FaWhatsapp,
  globe: Globe,
} as const;

export type SocialIconName = keyof typeof MAP;

export function SocialIcon({ name, className = 'size-[18px]' }: { name: SocialIconName; className?: string }) {
  const Icon = MAP[name];
  return <Icon aria-hidden className={className} />;
}
