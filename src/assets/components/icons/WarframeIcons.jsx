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

// Shared Arcane Dissolution Crucible Frame (authentic in-game pack frame)
const ArcanePackFrame = () => (
  <>
    {/* Outer Horseshoe Arch */}
    <path
      d="M17 58 L24 58 C25 43 35 25 50 22 C65 25 75 43 76 58 L83 58 C82 39 71 18 50 15 C29 18 18 39 17 58 Z"
      fill="currentColor"
      fillOpacity="0.88"
    />
    {/* Inner Arch Accent Curve */}
    <path
      d="M28 54 C31 38 39 28 50 28 C61 28 69 38 72 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.4"
    />
    {/* Top Left Pillar with Cutout Slot */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31 20 H35 L36 21 V33 L35 34 H31 L30 33 V21 Z M32 23 V31 H34 V23 Z"
      fill="currentColor"
    />
    {/* Top Right Pillar with Cutout Slot */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65 20 H69 L70 21 V33 L69 34 H65 L64 33 V21 Z M66 23 V31 H68 V23 Z"
      fill="currentColor"
    />
    {/* Bottom Left Pendant Spade with Cutout Slot */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26 58 H41 L40 61 L37 63 L34 72 L31 63 L27 61 Z M33 62 V68 H35 V62 Z"
      fill="currentColor"
    />
    {/* Bottom Right Pendant Spade with Cutout Slot */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M59 58 H74 L73 61 L70 63 L66 72 L63 63 L60 61 Z M65 62 V68 H67 V62 Z"
      fill="currentColor"
    />
    {/* Inner Corner Triangular Wedges */}
    <polygon points="28,43 28,54 35,54" fill="currentColor" fillOpacity="0.88" />
    <polygon points="72,43 72,54 65,54" fill="currentColor" fillOpacity="0.88" />
    {/* Base Horizontal Bar */}
    <line x1="41" y1="58" x2="59" y2="58" stroke="currentColor" strokeWidth="1.5" />
  </>
);

// Cavia Syndicate Emblem (Sanctum Anatomica / Albrecht's Laboratories)
export const CaviaIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Cavia Syndicate Vessel Head (Sanctum Anatomica) */}
    <g fill="currentColor">
      {/* Crown peak */}
      <path d="M46 29 C48 26 52 26 54 29 C52 30.5 51 30 50 31 C49 30 48 30.5 46 29 Z" />
      {/* Vessel Face with Keyhole Cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44 33 C44 29 56 29 56 33 C56 38 58 43 55 49 C53 53 51 55 50 55 C49 55 47 53 45 49 C42 43 44 38 44 33 Z M50 37 C52 37 53.5 38.5 53.5 40.5 C53.5 42 51.5 44 51 49 H49 C48.5 44 46.5 42 46.5 40.5 C46.5 38.5 48 37 50 37 Z"
      />
      {/* Stepped Horizontal Resonance Bars (Left) */}
      <rect x="33" y="38" width="7" height="3" rx="1.5" />
      <rect x="33" y="42.5" width="7" height="3" rx="1.5" />
      <rect x="36" y="47" width="4" height="3" rx="1.5" />
      {/* Stepped Horizontal Resonance Bars (Right) */}
      <rect x="60" y="38" width="7" height="3" rx="1.5" />
      <rect x="60" y="42.5" width="7" height="3" rx="1.5" />
      <rect x="60" y="47" width="4" height="3" rx="1.5" />
    </g>
  </svg>
);

// Duviri Paradox Emblem (Dominus Thrax Crown & Mask)
export const DuviriIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Dominus Thrax Royal Head & Mantlet Collar */}
    <g fill="currentColor">
      {/* Head & Crown Horns with Cutout Eye Sockets */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43 28 L40 25 L41 31 C39 34 39 40 43 45 L50 48 L57 45 C61 40 61 34 59 31 L60 25 L57 28 C55 26 45 26 43 28 Z M44.5 33 C44.5 31.8 47.5 31.8 47.5 33 C47.5 36 44.5 36 44.5 33 Z M52.5 33 C52.5 31.8 55.5 31.8 55.5 33 C55.5 36 52.5 36 52.5 33 Z"
      />
      {/* Central Collar Bib */}
      <polygon points="47,48 50,46 53,48 52,55 50,57 48,55" />
      {/* Curved Royal Neck Wings (Left & Right) */}
      <path d="M39 36 C42 42 45 49 48 53 C44 52 40 46 38 42 C37 39 38 36 39 36 Z" />
      <path d="M61 36 C58 42 55 49 52 53 C56 52 60 46 62 42 C63 39 62 36 61 36 Z" />
    </g>
  </svg>
);

// Plains of Eidolon Emblem (Sentient Horns & Flame)
export const EidolonIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Plains of Eidolon / Quills Sentient Horns & Flame */}
    <g fill="currentColor">
      {/* Left Sentient Horn */}
      <path d="M45 52 C39 50 34 43 35 33 C37 23 43 15 47 10 C47 18 48 26 47 35 C46 42 45 49 45 52 Z" />
      {/* Right Sentient Horn */}
      <path d="M55 52 C61 50 66 43 65 33 C63 23 57 15 53 10 C53 18 52 26 53 35 C54 42 55 49 55 52 Z" />
      {/* Center Rising Flame / Spire */}
      <path d="M45 52 C41 46 36 46 35 43 C38 43 41 40 43 36 C45 32 47 28 48 23 C48 30 46 38 46 45 Z" />
    </g>
  </svg>
);

// The Holdfasts Emblem (Zariman Ten Zero Circular Hatch)
export const HoldfastsIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* The Holdfasts Zariman Ten Zero Circular Hatch Emblem */}
    <g fill="currentColor">
      {/* Outer Hatch Ring */}
      <circle cx="50" cy="42" r="15" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {/* Left Hatch Plate Semicircle */}
      <path d="M50 29.2 A12.8 12.8 0 0 0 50 54.8 Z" />
      {/* Horizontal Reliquary Key with Knob */}
      <path d="M50 40.5 H56 A2.5 2.5 0 1 1 56 43.5 H50 Z" />
      {/* Right Concentric Crescent */}
      <path d="M50 32 A10 10 0 0 1 50 52 V54.8 A12.8 12.8 0 0 0 50 29.2 V32 Z" opacity="0.6" />
      {/* Celestial Orbital Dots */}
      <circle cx="42" cy="35" r="1.3" />
      <circle cx="48" cy="36" r="1" />
      <circle cx="40" cy="45" r="1.3" />
    </g>
  </svg>
);

// Necralisk Emblem (Entrati Family Crest / Honeycomb Sphere)
export const NecraliskIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Entrati Family Crest: Skull atop Honeycomb Dotted Sphere */}
    <g fill="currentColor">
      {/* Entrati Skull with Eye Cutouts */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46 32 C46 29 54 29 54 32 C54 34.5 52 35 52 36.5 C52 37.5 51 38.5 50 38.5 C49 38.5 48 37.5 48 36.5 C48 35 46 34.5 46 32 Z M47.5 33.5 A1 1 0 1 0 49.5 33.5 A1 1 0 1 0 47.5 33.5 Z M50.5 33.5 A1 1 0 1 0 52.5 33.5 A1 1 0 1 0 50.5 33.5 Z"
      />
      {/* Spherical Array of Concentric Dots */}
      <circle cx="44" cy="39" r="1.8" />
      <circle cx="47.5" cy="41" r="1.8" />
      <circle cx="52.5" cy="41" r="1.8" />
      <circle cx="56" cy="39" r="1.8" />
      <circle cx="40" cy="43" r="1.8" />
      <circle cx="44" cy="45" r="1.8" />
      <circle cx="48" cy="46" r="1.8" />
      <circle cx="52" cy="46" r="1.8" />
      <circle cx="56" cy="45" r="1.8" />
      <circle cx="60" cy="43" r="1.8" />
      <circle cx="42" cy="48" r="1.8" />
      <circle cx="46" cy="50" r="1.8" />
      <circle cx="50" cy="51" r="1.8" />
      <circle cx="54" cy="50" r="1.8" />
      <circle cx="58" cy="48" r="1.8" />
      <circle cx="45" cy="53" r="1.8" />
      <circle cx="49" cy="54" r="1.8" />
      <circle cx="51" cy="54" r="1.8" />
      <circle cx="55" cy="53" r="1.8" />
      <circle cx="50" cy="56" r="1.6" />
    </g>
  </svg>
);

// Ostron Emblem (Cetus / Unum Feather Sigil)
export const OstronIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Ostron Syndicate Feather / Spearhead Sigil */}
    <g fill="currentColor">
      <path d="M50 65 L49 63 C42 56 38 46 40 37 C41 30 45 23 54 17 C51 24 50 31 50 38 C49 34 49 29 51 25 C53 28 54 32 55 36 C57 32 60 28 62 34 C60 38 56 42 57 47 C58 52 61 54 62 55 C57 56 53 60 50 65 Z" />
    </g>
  </svg>
);

// Solaris United Emblem (Fortuna 3-Bar Cybernetic Logo)
export const SolarisIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* Solaris United 3-Bar Cybernetic Logo */}
    <g fill="currentColor">
      {/* Center Bar */}
      <polygon points="50,36 53.5,38 53.5,58.5 50,63.5 46.5,58.5 46.5,38" />
      {/* Left Bar & Diagonal Stripes */}
      <polygon points="38.5,31.5 45.5,35 45.5,49 38.5,45.5" />
      <polygon points="38.5,47.5 45.5,51 45.5,52.5 38.5,49" />
      <polygon points="38.5,51 45.5,54.5 45.5,56 38.5,52.5" />
      {/* Right Bar & Diagonal Stripes */}
      <polygon points="61.5,31.5 54.5,35 54.5,49 61.5,45.5" />
      <polygon points="61.5,47.5 54.5,51 54.5,52.5 61.5,49" />
      <polygon points="61.5,51 54.5,54.5 54.5,56 61.5,52.5" />
    </g>
  </svg>
);

// The Steel Path Emblem (3 Tiered Dax Chevrons)
export const SteelIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* The Steel Path 3 Tiered Chevrons */}
    <g fill="currentColor">
      {/* Top Chevron */}
      <path d="M50 26 C45 31 40 35 37 39 C41 37 46 32 50 30 C54 32 59 37 63 39 C60 35 55 31 50 26 Z" />
      {/* Middle Chevron */}
      <path d="M50 34 C44 39 38 45 35 48 C40 45 45 40 50 38 C55 40 60 45 65 48 C62 45 56 39 50 34 Z" />
      {/* Bottom Chevron & Crucible Aperture */}
      <path d="M50 42 C46 45 42 49 40 54 C44 51 47 48 50 47 C53 48 56 51 60 54 C58 49 54 45 50 42 Z" />
    </g>
  </svg>
);
