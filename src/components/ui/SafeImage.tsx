import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackType?: 'avatar' | 'book';
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'avatar',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const initials = (fallbackLabel || alt)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-100 text-indigo-700 dark:from-indigo-950/80 dark:to-slate-800 dark:text-indigo-200 ${className}`}
        aria-label={alt}
      >
        {fallbackType === 'book' ? (
          <div className="flex flex-col items-center gap-1.5 p-2 text-center">
            <BookOpen className="h-6 w-6 opacity-80" />
            <span className="line-clamp-2 text-[11px] font-medium leading-tight opacity-85">
              {fallbackLabel || alt}
            </span>
          </div>
        ) : initials ? (
          <span className="font-display text-xs font-semibold tracking-tight">{initials}</span>
        ) : (
          <User className="h-4 w-4 opacity-75" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
