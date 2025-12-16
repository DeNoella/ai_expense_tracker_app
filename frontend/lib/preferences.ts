export type ThemeMode = 'light' | 'dark';
export type LanguageCode = 'en' | 'fr';

const safeWindow = () => (typeof window !== 'undefined' ? window : null);
const safeDocument = () => (typeof document !== 'undefined' ? document : null);

const getStoredValue = <T extends string>(key: string, fallback: T): T => {
  const win = safeWindow();
  if (!win) return fallback;
  const stored = win.localStorage.getItem(key);
  return stored ? (stored as T) : fallback;
};

const setStoredValue = (key: string, value: string) => {
  const win = safeWindow();
  if (!win) return;
  win.localStorage.setItem(key, value);
};

export const applyTheme = (theme: ThemeMode) => {
  const doc = safeDocument();
  if (!doc) return;
  doc.documentElement.setAttribute('data-theme', theme);
};

export const initTheme = (fallback: ThemeMode = 'light'): ThemeMode => {
  const theme = getStoredValue<ThemeMode>('theme', fallback);
  applyTheme(theme);
  return theme;
};

export const persistTheme = (theme: ThemeMode) => {
  setStoredValue('theme', theme);
  applyTheme(theme);
};

export const initLanguage = (fallback: LanguageCode = 'en'): LanguageCode => {
  return getStoredValue<LanguageCode>('language', fallback);
};

export const persistLanguage = (lang: LanguageCode) => {
  setStoredValue('language', lang);
};

