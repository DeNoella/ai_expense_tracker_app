'use client';

import { useEffect } from 'react';
import { initTheme } from '@/lib/preferences';

export default function ThemeHydrator() {
  useEffect(() => {
    initTheme();
  }, []);

  return null;
}

