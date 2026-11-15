import { clsx, type ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a /public path with the deploy base path (for plain <img>/<a> usage). */
export const asset = (path: string) => (path.startsWith('/') ? `${BASE_PATH}${path}` : path);

export const SITE_URL = 'https://nabeelkk.store';

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Hide placeholder values such as "TODO" from the UI. */
export const isFilled = (v?: string | null): v is string =>
  !!v && v.trim() !== '' && !/^todo\b/i.test(v.trim());

export const externalProps = { target: '_blank', rel: 'noopener noreferrer' } as const;
