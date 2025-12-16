'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { getUser, isAuthenticated, setUser } from '@/lib/auth';
import { initLanguage, initTheme, LanguageCode, persistLanguage, persistTheme, ThemeMode } from '@/lib/preferences';
import { Camera, CheckCircle2, Mail, MapPin, Phone, Sparkles, UserRound } from 'lucide-react';

const copy = {
  en: {
    title: 'User information',
    subtitle: 'Keep your Aicash profile updated and add a face to your account.',
    upload: 'Upload a picture',
    save: 'Save profile',
    saved: 'Profile saved locally',
    inputs: {
      name: 'Full name',
      email: 'Email',
      role: 'Role or title',
      phone: 'Phone',
      location: 'Location',
      bio: 'Short bio',
    },
  },
  fr: {
    title: 'Informations utilisateur',
    subtitle: 'Mettez à jour votre profil Aicash et ajoutez une photo.',
    upload: 'Télécharger une photo',
    save: 'Enregistrer le profil',
    saved: 'Profil enregistré localement',
    inputs: {
      name: 'Nom complet',
      email: 'Email',
      role: 'Rôle ou titre',
      phone: 'Téléphone',
      location: 'Localisation',
      bio: 'Courte bio',
    },
  },
};

type Profile = {
  full_name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string;
};

export default function UserInfoPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    role: '',
    phone: '',
    location: 'Kimironko, Kigali, Rwanda',
    bio: '',
    avatar: '',
  });
  const [status, setStatus] = useState<string>('');
  const t = useMemo(() => copy[language], [language]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setTheme(initTheme());
    setLanguage(initLanguage());
    const currentUser = getUser();
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        phone: currentUser.phone || '',
        location: currentUser.location || prev.location,
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || '',
      }));
    }
  }, [router]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfile((prev) => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(profile);
    setStatus(t.saved);
    setTimeout(() => setStatus(''), 2500);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#7b5dfc] px-3 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              Profile
            </p>
            <h1 className="mt-3 text-3xl font-bold">{t.title}</h1>
            <p className="text-[var(--muted)]">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2">
            <button
              className={`rounded-full px-3 py-1 text-sm ${theme === 'light' ? 'bg-white shadow' : ''}`}
              onClick={() => {
                setTheme('light');
                persistTheme('light');
              }}
            >
              Light
            </button>
            <button
              className={`rounded-full px-3 py-1 text-sm ${theme === 'dark' ? 'bg-[rgba(123,93,252,0.2)] shadow text-white' : ''}`}
              onClick={() => {
                setTheme('dark');
                persistTheme('dark');
              }}
            >
              Dark
            </button>
            <div className="mx-1 h-6 w-[1px] bg-[var(--border)]" />
            <button
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              onClick={() => {
                const nextLang: LanguageCode = language === 'en' ? 'fr' : 'en';
                setLanguage(nextLang);
                persistLanguage(nextLang);
              }}
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>

        <form onSubmit={onSave} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={t.inputs.name}
                value={profile.full_name}
                onChange={(value) => setProfile((p) => ({ ...p, full_name: value }))}
                icon={<UserRound className="h-4 w-4 text-[var(--muted)]" />}
                required
              />
              <Input
                label={t.inputs.email}
                value={profile.email}
                onChange={(value) => setProfile((p) => ({ ...p, email: value }))}
                icon={<Mail className="h-4 w-4 text-[var(--muted)]" />}
                type="email"
                required
              />
              <Input
                label={t.inputs.role}
                value={profile.role}
                onChange={(value) => setProfile((p) => ({ ...p, role: value }))}
              />
              <Input
                label={t.inputs.phone}
                value={profile.phone}
                onChange={(value) => setProfile((p) => ({ ...p, phone: value }))}
                icon={<Phone className="h-4 w-4 text-[var(--muted)]" />}
              />
              <Input
                label={t.inputs.location}
                value={profile.location}
                onChange={(value) => setProfile((p) => ({ ...p, location: value }))}
                icon={<MapPin className="h-4 w-4 text-[var(--muted)]" />}
              />
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">{t.inputs.bio}</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-[#7b5dfc]"
                  placeholder="Tell us about you..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6">
              <p className="text-sm font-semibold text-[var(--muted)]">{t.upload}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-10 w-10 text-[var(--muted)]" />
                  )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-[rgba(123,93,252,0.3)]">
                  <Camera className="h-4 w-4" />
                  {t.upload}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                PNG, JPG up to 5MB. Stored locally with your profile.
              </p>
            </div>

            <div className="glass-card space-y-3 p-6">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>{status}</span>
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] via-[#7b5dfc] to-[#4b84ff] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px]"
              >
                <Sparkles className="h-4 w-4" />
                {t.save}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
};

const Input = ({ label, value, onChange, icon, type = 'text', required }: InputProps) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold">{label}</label>
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4">
      {icon}
      <input
        className="w-full bg-transparent py-3 outline-none"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  </div>
);

