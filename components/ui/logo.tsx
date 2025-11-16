// components/ui/Logo.tsx
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AthleteHub">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#3b82f6"/>
          <stop offset="1" stopColor="#8b5cf6"/>
        </linearGradient>
        <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.12"/>
        </filter>
      </defs>

      <rect x="6" y="6" rx="20" ry="20" width="108" height="108" fill="url(#g1)" filter="url(#s)" />
      <g transform="translate(18,20) scale(0.7 0.7)">
        <path d="M10 50 L40 20 L55 35 L85 5 L85 25 L60 50 L45 35 L20 60 Z" fill="#ffffff" opacity="0.98"/>
      </g>
    </svg>
  );
}
