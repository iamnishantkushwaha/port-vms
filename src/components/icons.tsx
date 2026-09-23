type IconProps = { className?: string };

const base = "h-5 w-5";

export function IconGrid({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function IconCar({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 16V12l1.8-4.5A2 2 0 0 1 7.66 6.2h8.68a2 2 0 0 1 1.86 1.3L20 12v4" />
      <path d="M4 16h16" />
      <path d="M4 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
      <path d="M17 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
      <circle cx="7.5" cy="12.5" r="0.6" fill="currentColor" />
      <circle cx="16.5" cy="12.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconBadge({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <circle cx="12" cy="10" r="2.4" />
      <path d="M8.2 16.5c.7-1.6 2-2.4 3.8-2.4s3.1.8 3.8 2.4" />
      <path d="M9.5 4V2.6h5V4" />
    </svg>
  );
}

export function IconUserPlus({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="10" cy="8" r="3.2" />
      <path d="M3.8 20c.8-3.4 3-5.1 6.2-5.1s5.4 1.7 6.2 5.1" />
      <path d="M18.5 8.5v5" />
      <path d="M16 11h5" />
    </svg>
  );
}

export function IconUserCheck({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="10" cy="8" r="3.2" />
      <path d="M3.8 20c.8-3.4 3-5.1 6.2-5.1s5.4 1.7 6.2 5.1" />
      <path d="M15.5 11.5l2 2 3.5-3.8" />
    </svg>
  );
}

export function IconList({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className}>
      <circle cx="4.5" cy="6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8.5 6h11" />
      <path d="M8.5 12h11" />
      <path d="M8.5 18h11" />
    </svg>
  );
}

export function IconUsers({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8.5" cy="8" r="2.8" />
      <path d="M3 19c.6-3 2.6-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
      <circle cx="16.2" cy="8.6" r="2.2" />
      <path d="M15 14.7c2.4.2 4 1.7 4.5 4.3" />
    </svg>
  );
}

export function IconAnchor({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="5.5" r="1.8" />
      <path d="M12 7.5v13" />
      <path d="M8 11h8" />
      <path d="M5 14a7 7 0 0 0 14 0" />
    </svg>
  );
}

export function IconCamera({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.6h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </svg>
  );
}

export function IconQr({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <path d="M14.5 15h2.5v2.5" />
      <path d="M20 15v2" />
      <path d="M14.5 20h2" />
      <path d="M20 20h.01" />
    </svg>
  );
}
