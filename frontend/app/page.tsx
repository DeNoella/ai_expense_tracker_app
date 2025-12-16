'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Globe2 from 'lucide-react/dist/esm/icons/globe-2';
import Languages from 'lucide-react/dist/esm/icons/languages';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Moon from 'lucide-react/dist/esm/icons/moon';
import Phone from 'lucide-react/dist/esm/icons/phone';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Sun from 'lucide-react/dist/esm/icons/sun';
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud';
import User2 from 'lucide-react/dist/esm/icons/user-2';
import Wallet from 'lucide-react/dist/esm/icons/wallet';
import { initLanguage, initTheme, LanguageCode, persistLanguage, persistTheme, ThemeMode } from '@/lib/preferences';
import BrandMark from '@/components/BrandMark';

type TranslationKey = 'en' | 'fr';

const translations: Record<TranslationKey, any> = {
  en: {
    tagline: 'AI-native expense tracker for bold teams',
    title: 'Meet Aicash — control spending, forecast, and act with AI clarity.',
    subtitle:
      'Real-time tracking, smart budgets, and bilingual insights that keep your money moves one step ahead.',
    ctaPrimary: 'Get started',
    ctaSecondary: 'See how it works',
    ctaUsers: 'Users info & photo upload',
    nav: ['Product', 'How it works', 'Testimonials', 'Contact'],
    featureHeading: 'What makes Aicash different',
    features: [
      {
        title: 'AI-first guardrails',
        desc: 'Predictive budgets, anomaly alerts, and instant insights so you never overspend.',
        icon: ShieldCheck,
      },
      {
        title: 'Lightning fast onboarding',
        desc: 'Connect accounts, upload receipts, and get a full picture of spending in minutes.',
        icon: UploadCloud,
      },
      {
        title: 'Bilingual by design',
        desc: 'Switch between English and French instantly across the experience.',
        icon: Languages,
      },
      {
        title: 'Personal + Team ready',
        desc: 'Keep personal finances tight or empower teams with shared budgets.',
        icon: Globe2,
      },
    ],
    stepsHeading: 'How Aicash works',
    steps: [
      'Create your secure space and choose light or dark mode.',
      'Connect expenses or upload a receipt — our AI categorizes and cleans the data.',
      'Set budgets, track trends, and share insights with your team.',
    ],
    capabilitiesHeading: 'Aicash can do all of this',
    capabilities: [
      'Auto-categorize expenses and flag anomalies',
      'Generate bilingual AI summaries and savings tips',
      'Attach photos to transactions and export reports',
      'Plan budgets with month-over-month projections',
      'Collaborate with teammates while keeping control',
      'Mobile-ready experience with instant alerts',
    ],
    testimonialsHeading: 'Voices from our community',
    testimonials: [
      {
        name: 'Aline M.',
        role: 'Founder, Kigali',
        quote:
          'Aicash keeps my runway clear. The AI alerts caught duplicate spend in seconds — huge win.',
      },
      {
        name: 'Jean-Paul K.',
        role: 'Product Lead, Rwanda',
        quote: 'Switching to French for reports is seamless. Dark mode is perfect for late nights.',
      },
    ],
    footerTagline: 'Built for Africa, ready for the world.',
    location: 'Kimironko, Kigali, Rwanda',
    contact: 'Contact',
  },
  fr: {
    tagline: 'Suivi des dépenses avec IA pour les équipes ambitieuses',
    title: 'Découvrez Aicash — maîtrisez vos dépenses et prévoyez avec clarté.',
    subtitle:
      'Suivi en temps réel, budgets intelligents et analyses bilingues pour garder une longueur d’avance.',
    ctaPrimary: 'Commencer',
    ctaSecondary: 'Voir comment ça marche',
    ctaUsers: 'Infos utilisateur & photo',
    nav: ['Produit', 'Parcours', 'Témoignages', 'Contact'],
    featureHeading: 'Ce qui rend Aicash unique',
    features: [
      {
        title: 'Garde-fous IA',
        desc: 'Budgets prédictifs, alertes d’anomalies et insights instantanés pour éviter les dépassements.',
        icon: ShieldCheck,
      },
      {
        title: 'Activation express',
        desc: 'Connectez vos comptes, importez des reçus et obtenez une vision claire en minutes.',
        icon: UploadCloud,
      },
      {
        title: 'Bilingue par défaut',
        desc: 'Basculez instantanément entre l’anglais et le français dans toute l’expérience.',
        icon: Languages,
      },
      {
        title: 'Perso + Équipe',
        desc: 'Parfait pour vos finances perso ou des budgets partagés en équipe.',
        icon: Globe2,
      },
    ],
    stepsHeading: 'Comment Aicash fonctionne',
    steps: [
      'Créez votre espace sécurisé et choisissez le mode clair ou sombre.',
      'Connectez des dépenses ou chargez un reçu — l’IA classe et nettoie vos données.',
      'Fixez des budgets, suivez les tendances et partagez les insights.',
    ],
    capabilitiesHeading: 'Aicash peut faire tout ça',
    capabilities: [
      'Catégoriser automatiquement et signaler les anomalies',
      'Générer des synthèses et conseils en anglais et français',
      'Joindre des photos aux transactions et exporter des rapports',
      'Planifier des budgets avec projections mensuelles',
      'Collaborer en équipe tout en gardant le contrôle',
      'Expérience mobile avec alertes instantanées',
    ],
    testimonialsHeading: 'Ils nous font confiance',
    testimonials: [
      {
        name: 'Aline M.',
        role: 'Fondatrice, Kigali',
        quote:
          'Aicash sécurise ma trésorerie. Les alertes IA ont détecté un doublon de dépense en quelques secondes.',
      },
      {
        name: 'Jean-Paul K.',
        role: 'Chef de produit, Rwanda',
        quote: 'Basculer en français pour les rapports est fluide. Le mode sombre est parfait la nuit.',
      },
    ],
    footerTagline: 'Construit pour l’Afrique, prêt pour le monde.',
    location: 'Kimironko, Kigali, Rwanda',
    contact: 'Contact',
  },
};

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<TranslationKey>('en');

  useEffect(() => {
    setTheme(initTheme());
    setLanguage(initLanguage() as TranslationKey);
  }, []);

  useEffect(() => {
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  const t = useMemo(() => translations[language], [language]);

  const navItems = useMemo(
    () => [
      { label: t.nav[0], href: '#product' },
      { label: t.nav[1], href: '#how' },
      { label: t.nav[2], href: '#testimonials' },
      { label: t.nav[3], href: '#contact' },
    ],
    [t.nav],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[rgba(156,27,88,0.08)] to-transparent">
        <div className="absolute inset-0 gradient-surface pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col space-y-8 px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <BrandMark showText />

            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-sm">
              <button
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                  theme === 'light' ? 'bg-white text-gray-900 shadow' : 'text-[var(--muted)]'
                }`}
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                  theme === 'dark' ? 'bg-[rgba(14,165,233,0.15)] text-white shadow' : 'text-[var(--muted)]'
                }`}
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <div className="mx-2 h-6 w-[1px] bg-[var(--border)]" />
              <button
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-[rgba(14,165,233,0.1)] transition"
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              >
                <Languages className="h-4 w-4" />
                {language === 'en' ? 'Français' : 'English'}
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-4 py-2 transition hover:border-[var(--border)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[rgba(14,165,233,0.5)] hover:text-[var(--foreground)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[#0b72d7] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)] shadow">
                {t.tagline}
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t.title}</h1>
              <p className="text-lg text-[var(--muted)]">{t.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[#0b72d7] px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:translate-y-[-1px]"
                >
                  <Sparkles className="h-4 w-4" />
                  {t.ctaPrimary}
                </Link>
                <a
                  href="#how"
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold transition hover:border-[rgba(14,165,233,0.35)]"
                >
                  <PlayIcon />
                  {t.ctaSecondary}
                </a>
                <Link
                  href="/user-info"
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-[rgba(14,165,233,0.35)]"
                >
                  <User2 className="h-4 w-4" />
                  {t.ctaUsers}
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0ea5e9]" />
                  30s onboarding
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0ea5e9]" />
                  Receipt uploads
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0ea5e9]" />
                  AI insights in FR/EN
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-60" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.28), transparent 60%)' }} />
              <div className="relative glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted)]">Live budget health</p>
                      <p className="text-lg font-semibold">+$2,450 saved this month</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    +18%
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Stat label="Spend under control" value="82%" hint="Alert at 90%" />
                  <Stat label="AI predictions" value="7 flagged" hint="Anomalies reviewed" />
                  <Stat label="Reports bilingual" value="EN / FR" hint="Switch anytime" />
                  <Stat label="Receipts stored" value="134" hint="Ready to export" />
                </div>
                <div className="mt-6 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[rgba(14,165,233,0.12)] via-[rgba(15,118,110,0.08)] to-transparent px-4 py-3 text-sm text-[var(--muted)]">
                  “Aicash keeps me calm about every franc. The bilingual AI tips are gold.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-6 py-14">
        <section id="product" className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.featureHeading}</p>
              <h2 className="text-3xl font-bold">Aicash is designed to feel alive</h2>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-[rgba(123,93,252,0.3)]"
            >
              Launch app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {t.features.map((feature: any) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-semibold">{feature.title}</p>
                  </div>
                  <p className="text-[var(--muted)]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="how" className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] opacity-90" />
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.stepsHeading}</p>
              <h2 className="text-3xl font-bold">Built to feel like the AIMS-inspired theme</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {t.steps.map((step: string, index: number) => (
              <div key={step} className="glass-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                  {index + 1}
                </div>
                <p className="text-[var(--muted)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.capabilitiesHeading}</p>
              <h2 className="text-3xl font-bold">Do more with one home</h2>
            </div>
            <Link
              href="/user-info"
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-[rgba(123,93,252,0.3)]"
            >
              Upload a picture
              <UploadCloud className="h-4 w-4" />
            </Link>
          </div>
          <div className="glass-card p-6">
            <div className="grid gap-3 md:grid-cols-2">
              {t.capabilities.map((item: string) => (
                <div key={item} className="flex items-start gap-2 text-[var(--muted)]">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-[#0ea5e9]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-10 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
            <h2 className="text-3xl font-bold">{t.testimonialsHeading}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {t.testimonials.map((person: any) => (
              <div key={person.name} className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-[var(--muted)]">{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-[var(--muted)]">“{person.quote}”</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="glass-card space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] opacity-90" />
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.contact}</p>
              <h2 className="text-2xl font-bold">{t.footerTagline}</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 text-[var(--muted)]">
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-5 w-5 text-[#0ea5e9]" />
              <span>{t.location}</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="mt-1 h-5 w-5 text-[#0ea5e9]" />
              <span>hello@aicash.ai</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-1 h-5 w-5 text-[#0ea5e9]" />
              <span>+250 788 312 469</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 4.5L13 9L6 13.5V4.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Stat = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
    <p className="text-sm text-[var(--muted)]">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
    <p className="text-xs text-[var(--muted)]">{hint}</p>
  </div>
);
