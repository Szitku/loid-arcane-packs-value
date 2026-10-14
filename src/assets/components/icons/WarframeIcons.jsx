import React from "react";

// Official Warframe Lotus Emblem SVG
export const LotusIcon = ({ className = "w-6 h-6", glow = false }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={`${className} ${glow ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" : ""}`}
  >
    {/* Stylized Lotus Petals */}
    <path
      d="M50 8 C47 22, 44 38, 50 62 C56 38, 53 22, 50 8 Z"
      fill="currentColor"
    />
    <path
      d="M50 62 C38 48, 22 42, 14 52 C26 64, 38 64, 50 62 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M50 62 C62 48, 78 42, 86 52 C74 64, 62 64, 50 62 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M50 66 C36 68, 26 78, 24 92 C38 88, 45 78, 50 66 Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M50 66 C64 68, 74 78, 76 92 C62 88, 55 78, 50 66 Z"
      fill="currentColor"
      opacity="0.8"
    />
    <circle cx="50" cy="40" r="3" fill="#e0f2fe" />
    <path
      d="M48 64 L52 64 L50 78 Z"
      fill="currentColor"
    />
  </svg>
);

// Warframe Platinum Currency Icon
export const PlatinumIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className} drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]`}
  >
    {/* Hexagonal diamond base */}
    <polygon
      points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
      fill="url(#plat-grad)"
      stroke="#7dd3fc"
      strokeWidth="1.2"
    />
    {/* Inner facets */}
    <polygon
      points="12,4.5 18.5,8.8 18.5,15.2 12,19.5 5.5,15.2 5.5,8.8"
      fill="none"
      stroke="#bae6fd"
      strokeWidth="0.8"
      opacity="0.6"
    />
    {/* Stylized P symbol */}
    <path
      d="M10 7.5 H13 C14.5 7.5, 15.5 8.5, 15.5 10 C15.5 11.5, 14.5 12.5, 13 12.5 H10 V16.5"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="plat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
    </defs>
  </svg>
);

// Vosfor Currency Flask Icon (Sanctum Anatomica)
export const VosforIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className} drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]`}
  >
    <path
      d="M9 3 H15 M10 3 V7 L5 17 C4 19, 5.5 21, 7.5 21 H16.5 C18.5 21, 20 19, 19 17 L14 7 V3"
      stroke="#34d399"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Liquid contents */}
    <path
      d="M6.5 15 L8 12 C9.5 13, 11 12, 12.5 13 C14 14, 15 13, 16 12 L17.5 15 C18.5 17, 17.5 19.5, 16 19.5 H8 C6.5 19.5, 5.5 17, 6.5 15 Z"
      fill="#10b981"
      opacity="0.85"
    />
    <circle cx="10" cy="16" r="1" fill="#a7f3d0" />
    <circle cx="14" cy="17" r="1.2" fill="#a7f3d0" />
    <circle cx="12" cy="14" r="0.8" fill="#d1fae5" />
  </svg>
);

// Cavia Syndicate Emblem (Sanctum Anatomica / Albrecht's Grimoire)
export const CaviaIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Open Grimoire with Void Eye */}
    <path
      d="M2 5 L12 8 L22 5 V19 L12 21 L2 18 Z"
      fill="#0d9488"
      fillOpacity="0.25"
      stroke="#2dd4bf"
      strokeWidth="1.5"
    />
    <path d="M12 8 V21" stroke="#2dd4bf" strokeWidth="1.5" />
    {/* The Void Eye */}
    <path
      d="M7 13.5 C9 11, 15 11, 17 13.5 C15 16, 9 16, 7 13.5 Z"
      fill="#f59e0b"
      fillOpacity="0.4"
      stroke="#fbbf24"
      strokeWidth="1.2"
    />
    <circle cx="12" cy="13.5" r="2" fill="#fef08a" />
  </svg>
);

// Duviri Paradox Emblem (Void Spiral & Crown)
export const DuviriIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Duviri Spiral Sun / Mask */}
    <circle cx="12" cy="12" r="9" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
    <path
      d="M12 4 A8 8 0 0 1 20 12 A6 6 0 0 1 14 18 A4 4 0 0 1 10 14 A2 2 0 0 1 12 12"
      stroke="#10b981"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="2" fill="#fbbf24" />
  </svg>
);

// Plains of Eidolon Emblem (Sentient Core / Vomvalyst)
export const EidolonIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Sentient Horns & Core */}
    <path
      d="M12 2 L14 7 L19 5 L16 11 L22 13 L16 16 L17 22 L12 18 L7 22 L8 16 L2 13 L8 11 L5 5 L10 7 Z"
      fill="#0284c7"
      fillOpacity="0.25"
      stroke="#38bdf8"
      strokeWidth="1.3"
    />
    <circle cx="12" cy="13" r="3.5" fill="#38bdf8" fillOpacity="0.7" stroke="#e0f2fe" strokeWidth="1" />
  </svg>
);

// The Holdfasts Emblem (Zariman Ten Zero / Angel Plume)
export const HoldfastsIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Chrysalith Angelic Wing Plumes */}
    <path
      d="M12 2 C8 7, 3 10, 4 17 C5 21, 10 22, 12 18 C14 22, 19 21, 20 17 C21 10, 16 7, 12 2 Z"
      fill="#eab308"
      fillOpacity="0.25"
      stroke="#facc15"
      strokeWidth="1.5"
    />
    <path d="M12 5 V17" stroke="#14b8a6" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9 10 L12 13 L15 10" stroke="#14b8a6" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Necralisk Emblem (Entrati Family Crest / Bone Relic)
export const NecraliskIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Entrati Necramech Crest */}
    <polygon
      points="12,2 19,6 20,15 12,22 4,15 5,6"
      fill="#c2410c"
      fillOpacity="0.25"
      stroke="#fb923c"
      strokeWidth="1.5"
    />
    <path
      d="M8 8 L12 12 L16 8 M12 12 V18 M9 15 L15 15"
      stroke="#fed7aa"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

// Ostron Emblem (Cetus / Unum Tower & Spearfishing)
export const OstronIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Cetus Unum Tower / Sunburst */}
    <path
      d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z"
      fill="#d97706"
      fillOpacity="0.25"
      stroke="#f59e0b"
      strokeWidth="1.4"
    />
    <circle cx="12" cy="12" r="3" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
  </svg>
);

// Solaris United Emblem (Fortuna Cybernetic Cog & Wrench)
export const SolarisIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Fortuna Cog */}
    <circle cx="12" cy="12" r="8" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 2" />
    {/* Crossed Wrench & Hammer silhouette */}
    <path
      d="M7 17 L17 7 M14 6 L18 10 M6 14 L10 18"
      stroke="#eab308"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" fill="#0891b2" />
  </svg>
);

// The Steel Path Emblem (Teshin's Honored Dax Swords)
export const SteelIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Crossed Nikanas */}
    <path
      d="M4 20 L20 4 M17 3 L21 7 M7 21 L3 17"
      stroke="#ef4444"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M20 20 L4 4 M3 7 L7 3 M21 17 L17 21"
      stroke="#e11d48"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3.5" fill="#b91c1c" stroke="#fecdd3" strokeWidth="1" />
  </svg>
);
