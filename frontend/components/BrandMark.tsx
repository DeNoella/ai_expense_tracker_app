'use client';

import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

type Props = {
  size?: 'sm' | 'md';
  showText?: boolean;
  textClassName?: string;
};

export default function BrandMark({ size = 'md', showText = false, textClassName = '' }: Props) {
  const box = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const icon = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';

  return (
    <div className="flex items-center space-x-3">
      <div
        className={`flex ${box} items-center justify-center rounded-2xl shadow-lg shadow-[rgba(14,165,233,0.28)]`}
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0f9fbf 60%, #0b72d7 100%)',
        }}
      >
        <Sparkles className={`${icon} text-white`} />
      </div>
      {showText && (
        <div className={textClassName}>
          <p className="text-lg font-semibold">Aicash</p>
          <p className="text-xs text-[var(--muted)]">AI Expense Tracker</p>
        </div>
      )}
    </div>
  );
}

