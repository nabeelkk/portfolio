'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Loader2, Send } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { EASE_OUT } from '@/lib/animations';
import { cn, externalProps } from '@/lib/utils';
import { Magnetic } from '../ui/MagneticButton';
import { SectionHeading } from '../ui/SectionHeading';
import { SocialIcon, type SocialIconName } from '../ui/SocialIcon';

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter at least 2 characters.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
  return e;
}

const LINKS: { label: string; value: string; href: string; icon: SocialIconName; external: boolean }[] = [
  { label: 'LinkedIn', value: 'muhammed-nabeel-kk', href: profile.linkedin, icon: 'linkedin', external: true },
  { label: 'GitHub', value: 'nabeelkk', href: profile.github, icon: 'github', external: true },
  { label: 'AISYNX', value: 'aisynx.in', href: profile.aisynx.url, icon: 'globe', external: true },
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: 'mail', external: false },
  { label: 'Phone', value: profile.phone, href: profile.phoneHref, icon: 'phone', external: false },
  { label: 'WhatsApp', value: 'Chat on WhatsApp', href: profile.whatsapp, icon: 'whatsapp', external: true },
];

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-mono text-muted">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="text-sm text-[#ff8a7a]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (invalid?: boolean) =>
  cn(
    'w-full rounded-xl border bg-bg-elev px-4 py-3.5 text-base text-fg placeholder:text-fg/30 transition-[border-color,box-shadow] duration-300 outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(198,244,50,0.12)]',
    invalid ? 'border-[#ff8a7a]/70' : 'border-line-strong',
  );

export function Contact() {
  const uid = useId();
  const [values, setValues] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = profile.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    // Bots fill hidden fields: pretend success, send nothing.
    if (honeypot.current?.value) {
      setStatus('success');
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    if (!publicKey || !serviceId || !templateId) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: values.name.trim(), email_id: values.email.trim(), message: values.message.trim() },
        { publicKey },
      );
      setStatus('success');
      setValues({ name: '', email: '', message: '' });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (k: keyof Fields) => (errors[k] && touched[k] ? `${uid}-${k}-error` : undefined);

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="absolute -bottom-1/3 left-1/2 -z-10 size-[80vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,244,50,0.08),transparent_60%)]" />
      <div className="container-x">
        <SectionHeading
          id="contact-title"
          index="08"
          label="Contact"
          title={['Let’s build something ', { text: 'great', serif: true, accent: true }, ' together.']}
        />

        {/* Email */}
        <div className="mb-16 flex flex-col gap-4 md:mb-24">
          <span className="label-mono text-muted">Drop me a line</span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="link-underline min-w-0 text-[clamp(1.15rem,4.4vw,3.6rem)] font-semibold tracking-[-0.035em] break-all hover:text-accent"
            >
              {profile.email}
            </a>
            <Magnetic>
              <button
                type="button"
                onClick={copyEmail}
                data-cursor="COPY"
                aria-label="Copy email address"
                className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
              >
                {copied ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="grid gap-14 lg:grid-cols-12">
          {/* Form */}
          <div className="relative lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  role="status"
                  className="flex min-h-[420px] flex-col items-start justify-center gap-6 rounded-3xl border border-accent/40 bg-accent/[0.06] p-8 md:p-12"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                >
                  <motion.span
                    className="grid size-16 place-items-center rounded-full bg-accent text-accent-ink"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
                  >
                    <Check aria-hidden className="size-8" strokeWidth={2.5} />
                  </motion.span>
                  <h3 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                    Message sent. <span className="serif-i">Thank you!</span>
                  </h3>
                  <p className="max-w-md text-fg/70">Thanks for reaching out. I’ll get back to you soon.</p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="link-underline label-mono text-accent"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-describedby={status === 'error' ? `${uid}-form-error` : undefined}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={`${uid}-name`} label="Your name" error={touched.name ? errors.name : undefined}>
                      <input
                        id={`${uid}-name`}
                        name="from_name"
                        autoComplete="name"
                        value={values.name}
                        onChange={set('name')}
                        onBlur={blur('name')}
                        aria-invalid={!!(touched.name && errors.name)}
                        aria-describedby={describedBy('name')}
                        placeholder="Jane Doe"
                        className={inputCls(!!(touched.name && errors.name))}
                      />
                    </Field>
                    <Field id={`${uid}-email`} label="Email" error={touched.email ? errors.email : undefined}>
                      <input
                        id={`${uid}-email`}
                        name="email_id"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={values.email}
                        onChange={set('email')}
                        onBlur={blur('email')}
                        aria-invalid={!!(touched.email && errors.email)}
                        aria-describedby={describedBy('email')}
                        placeholder="jane@company.com"
                        className={inputCls(!!(touched.email && errors.email))}
                      />
                    </Field>
                  </div>
                  <Field id={`${uid}-message`} label="Message" error={touched.message ? errors.message : undefined}>
                    <textarea
                      id={`${uid}-message`}
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={set('message')}
                      onBlur={blur('message')}
                      aria-invalid={!!(touched.message && errors.message)}
                      aria-describedby={describedBy('message')}
                      placeholder="Tell me about the role, product or project…"
                      className={cn(inputCls(!!(touched.message && errors.message)), 'resize-y')}
                      data-lenis-prevent
                    />
                  </Field>
                  {/* Honeypot: hidden from people and assistive tech */}
                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor={`${uid}-company`}>Company</label>
                    <input ref={honeypot} id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.p
                        id={`${uid}-form-error`}
                        role="alert"
                        className="rounded-xl border border-[#ff8a7a]/40 bg-[#ff8a7a]/[0.08] px-4 py-3 text-sm text-[#ffb3a8]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Something went wrong sending your message. Please try again, or email me directly at{' '}
                        <a href={`mailto:${profile.email}`} className="underline">
                          {profile.email}
                        </a>
                        .
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap items-center gap-4">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group/btn inline-flex h-14 items-center gap-2.5 rounded-full bg-accent px-8 font-medium text-accent-ink transition-shadow duration-500 hover:shadow-[0_0_0_6px_rgba(198,244,50,0.15),0_10px_40px_-10px_rgba(198,244,50,0.6)] disabled:cursor-wait disabled:opacity-80"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 aria-hidden className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <Send aria-hidden className="size-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <span className="label-mono text-muted" aria-live="polite">
                      {status === 'sending' ? 'Sending your message…' : 'All fields are required'}
                    </span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Links */}
          <div className="lg:col-span-5">
            <p className="mb-5 label-mono text-muted">Elsewhere</p>
            <ul className="border-t border-line">
              {LINKS.map((l) => (
                <li key={l.label} className="border-b border-line">
                  <a
                    href={l.href}
                    {...(l.external ? externalProps : {})}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <SocialIcon name={l.icon} className="size-[18px] shrink-0 text-fg/60 transition-colors group-act:text-accent" />
                      <span className="label-mono w-20 shrink-0 text-muted">{l.label}</span>
                      <span className="truncate">{l.value}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 shrink-0 transition-transform duration-500 group-act:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copied toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-[75] flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg shadow-2xl"
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <Check aria-hidden className="size-4 text-[#3a7d00]" /> Email copied
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
