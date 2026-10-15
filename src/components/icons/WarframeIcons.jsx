import React from "react";

// Official Warframe Lotus Emblem SVG
export const LotusIcon = ({ className = "w-6 h-6", glow = false, ...props }) => (
  <svg
    viewBox="0 0 352 208"
    fill="currentColor"
    className={`${className} ${glow ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" : ""}`}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 173.217 8.313 C 165.892 25.246, 131.125 52.586, 86.438 76.557 C 74.663 82.873, 75 82.235, 75 98.196 C 75 106.055, 75.342 108.485, 76.629 109.772 C 78.135 111.277, 78.435 111.196, 80.581 108.701 C 81.859 107.215, 83.713 105.994, 84.702 105.986 C 85.691 105.978, 88.486 104.181, 90.913 101.992 C 93.341 99.802, 96.794 97.481, 98.587 96.832 C 100.380 96.184, 102.408 94.606, 103.093 93.327 C 103.778 92.047, 104.911 91, 105.612 91 C 106.312 91, 108.374 90.135, 110.193 89.077 C 112.012 88.020, 115.735 86.829, 118.466 86.431 C 121.197 86.034, 124.765 84.897, 126.395 83.906 C 128.025 82.915, 129.731 82.334, 130.186 82.615 C 130.642 82.897, 131.284 82.423, 131.614 81.563 C 131.944 80.704, 132.861 80, 133.651 80 C 134.782 80, 163.124 64.010, 173.612 57.455 C 175.731 56.130, 182.437 59.837, 252.105 100.837 C 253.538 101.680, 256.238 104.590, 258.105 107.303 C 262.408 113.555, 270.836 122, 272.772 122 C 275.247 122, 277.645 101.373, 276.540 89.583 L 275.824 81.945 270.662 79.349 C 259.350 73.660, 241.721 63.202, 227 53.447 C 200.690 36.012, 183.808 20.358, 178.259 8.250 C 176.936 5.362, 175.774 3.008, 175.677 3.017 C 175.580 3.026, 174.472 5.409, 173.217 8.313 M 289.519 115.500 C 288.579 119.350, 287.605 123.019, 287.354 123.653 C 287.090 124.320, 292.356 127.642, 299.850 131.536 C 306.973 135.237, 314.065 139.274, 315.610 140.506 L 318.419 142.746 314.104 154.623 C 305.081 179.459, 294.786 197.979, 286.576 204.143 C 284.334 205.826, 283.400 206.959, 284.500 206.660 C 285.600 206.360, 290.477 205.345, 295.338 204.403 C 300.927 203.321, 304.528 202.105, 305.133 201.096 C 305.660 200.218, 311.886 187.256, 318.969 172.292 C 332.739 143.198, 335.677 138.177, 343.274 130.750 L 348.133 126 341.227 126 C 330.801 126, 320.116 122.848, 304.864 115.273 L 291.227 108.500 289.519 115.500 M 48.286 115.031 C 32.279 123.254, 26.383 125.105, 14.185 125.735 L 3.869 126.268 7.438 129.210 C 14.033 134.646, 20.001 144.702, 33.827 173.681 L 47.578 202.500 55.039 204.077 C 59.143 204.945, 64.063 205.966, 65.974 206.347 L 69.448 207.040 65.262 203.961 C 57.431 198.202, 48.361 181.966, 38.629 156.283 C 36.083 149.564, 34 143.607, 34 143.046 C 34 141.811, 39.611 138.188, 51 132.068 L 59.500 127.500 52.250 127.206 C 48.263 127.045, 45 126.482, 45 125.956 C 45 125.430, 45.675 124.944, 46.500 124.875 C 48.236 124.730, 48.230 124.732, 53.500 123.193 C 55.700 122.550, 58.731 121.006, 60.236 119.762 C 62.833 117.615, 62.916 117.285, 61.864 113.250 C 61.255 110.912, 60.474 109.061, 60.128 109.135 C 59.783 109.209, 54.454 111.863, 48.286 115.031 M 265.550 124.250 C 265.338 124.938, 264.931 128.875, 264.648 133 C 263.790 145.468, 258.324 157.748, 247.461 171.614 L 242.850 177.500 247.020 173 C 259.667 159.354, 269.616 141.521, 273.381 125.750 C 274.016 123.095, 273.899 123, 269.988 123 C 267.620 123, 265.777 123.519, 265.550 124.250 M 224.500 126.055 C 217.350 126.449, 210.398 126.823, 209.051 126.886 C 207.193 126.973, 208.881 128.344, 216.051 132.574 C 221.248 135.639, 226.574 139.127, 227.886 140.324 C 235.780 147.524, 236.262 163.416, 228.962 175.790 C 227.881 177.621, 227.436 178.848, 227.974 178.516 C 229.925 177.310, 236.325 164.651, 238.767 157.167 C 241.856 147.703, 242.648 127.661, 240 125.982 C 239.175 125.459, 238.275 125.100, 238 125.185 C 237.725 125.269, 231.650 125.661, 224.500 126.055 M 79 128.343 C 79 129.935, 83.495 141.034, 86.802 147.610 C 90.998 155.953, 100.681 169.577, 105.556 174 C 107.120 175.418, 106.380 174.097, 103.848 170.947 C 94.293 159.060, 88.090 145.418, 86.481 132.750 C 85.893 128.121, 85.790 128, 82.439 128 C 80.547 128, 79 128.155, 79 128.343 M 110.015 137.250 C 110.023 142.338, 110.717 149.425, 111.556 153 C 113.313 160.478, 119.697 174.105, 123.504 178.500 L 126.103 181.500 123.540 177.434 C 116.238 165.847, 115.145 153.153, 120.678 144.203 C 122.961 140.510, 125.427 138.434, 132.267 134.445 C 137.046 131.658, 141.266 129.068, 141.645 128.689 C 142.023 128.310, 135.058 128, 126.167 128 L 110 128 110.015 137.250 M 168.996 133.931 C 163.345 139.868, 148.947 149.953, 138.750 155.117 L 133 158.029 133 165.409 C 133 173.025, 135.636 183.787, 138.415 187.514 C 139.730 189.279, 139.739 189.054, 138.491 185.500 C 136.545 179.955, 136.671 176.311, 138.971 171.566 C 140.721 167.954, 142.882 166.354, 158.334 157.235 L 175.727 146.970 192.989 157.167 C 205.002 164.263, 210.819 168.296, 212.121 170.432 C 214.184 173.813, 214.619 181.243, 213.003 185.492 C 212.442 186.967, 212.408 187.866, 212.925 187.546 C 214.376 186.649, 217.894 175.063, 218.608 168.829 C 219.613 160.044, 218.916 158.680, 211.253 154.433 C 199.956 148.173, 187.519 139.242, 182.062 133.472 C 179.216 130.462, 176.350 128.033, 175.693 128.074 C 175.037 128.115, 172.023 130.750, 168.996 133.931 M 67.151 144.533 C 65.309 145.333, 60.976 146.508, 57.522 147.144 L 51.243 148.301 54.673 152.795 C 56.560 155.267, 61.643 164.609, 65.968 173.556 L 73.832 189.823 79.640 191.029 C 82.835 191.692, 86.135 192.490, 86.974 192.802 C 87.813 193.113, 86.867 191.544, 84.870 189.314 C 79.209 182.991, 67 160.595, 67 156.533 C 67 155.878, 69.250 154.288, 72 153 C 74.750 151.712, 77 150.480, 77 150.262 C 77 149.469, 71.745 143.001, 71.131 143.039 C 70.784 143.061, 68.993 143.733, 67.151 144.533 M 277.619 146.433 C 276.178 148.322, 275 150.045, 275 150.262 C 275 150.480, 277.250 151.712, 280 153 C 282.848 154.334, 285 156.010, 285 156.895 C 285 160.206, 272.595 183.235, 268.121 188.229 C 265.579 191.066, 264.187 193.128, 265.026 192.811 C 265.865 192.494, 269.170 191.691, 272.370 191.027 L 278.188 189.819 286.091 173.557 C 290.438 164.613, 295.554 155.252, 297.460 152.756 L 300.927 148.216 296.213 147.519 C 293.621 147.135, 289.041 145.961, 286.035 144.911 C 283.029 143.860, 280.495 143, 280.403 143 C 280.312 143, 279.059 144.545, 277.619 146.433"
    />
  </svg>
);

export const WarframeIcon = LotusIcon;

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

// Official Warframe Vosfor Resource Icon (Arcane Dissolution)
export const VosforIcon = ({ className = "w-4 h-4", glow = true, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={`inline-block ${className} ${glow ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" : ""}`}
    {...props}
  >
    <defs>
      <radialGradient id="wf-vf-aura" cx="58%" cy="26%" r="48%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
        <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.2" />
        <stop offset="85%" stopColor="#0284c7" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wf-vf-dust" x1="15%" y1="20%" x2="75%" y2="95%">
        <stop offset="0%" stopColor="#baa782" />
        <stop offset="35%" stopColor="#938161" />
        <stop offset="70%" stopColor="#61523a" />
        <stop offset="100%" stopColor="#3b3021" />
      </linearGradient>
      <linearGradient id="wf-vf-hi" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#e8ddc5" />
        <stop offset="100%" stopColor="#baa782" />
      </linearGradient>
      <linearGradient id="wf-vf-sh" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#241d14" />
        <stop offset="100%" stopColor="#15100a" />
      </linearGradient>
      <linearGradient id="wf-vf-smoke" x1="40%" y1="85%" x2="65%" y2="10%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="wf-vf-mid" x1="45%" y1="90%" x2="60%" y2="15%">
        <stop offset="0%" stopColor="#0891b2" stopOpacity="0.85" />
        <stop offset="35%" stopColor="#06b6d4" />
        <stop offset="75%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="wf-vf-core" x1="50%" y1="95%" x2="55%" y2="20%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="45%" stopColor="#67e8f9" />
        <stop offset="85%" stopColor="#cffafe" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
    </defs>

    {/* Ambient Phosphor Cloud Aura */}
    <circle cx="58" cy="26" r="32" fill="url(#wf-vf-aura)" />

    {/* Outer Ethereal Smoke Plume */}
    <path
      d="M 55.0 9.0 L 39.9 15.5 L 37.1 18.4 L 32.8 30.6 L 37.8 34.2 L 40.7 30.6 L 43.5 32.0 L 37.1 37.1 L 34.9 37.1 L 31.3 34.2 L 27.7 40.7 L 32.8 41.4 L 37.1 39.9 L 39.9 37.1 L 41.4 37.8 L 43.5 32.0 L 45.7 32.0 L 47.8 34.2 L 49.3 32.8 L 52.2 33.5 L 53.6 38.5 L 47.1 41.4 L 39.2 48.6 L 40.7 50.7 L 37.8 52.2 L 40.7 54.3 L 38.5 56.5 L 44.2 64.4 L 52.9 63.7 L 49.3 65.8 L 50.7 67.2 L 57.9 65.8 L 53.6 64.4 L 55.8 61.5 L 63.7 57.9 L 68.0 58.6 L 71.6 52.2 L 70.1 50.7 L 70.1 44.2 L 75.2 41.4 L 74.4 39.9 L 70.8 40.7 L 70.1 39.2 L 71.6 37.8 L 78.8 38.5 L 85.9 31.3 L 84.5 25.6 L 77.3 17.7 L 73.0 17.7 L 65.8 11.9 L 57.9 11.2 Z"
      fill="url(#wf-vf-smoke)"
    />

    {/* Arcane Dust Mound Base */}
    <path
      d="M 90.2 44.2 L 88.1 44.2 L 87.4 42.1 L 84.5 39.9 L 71.6 37.8 L 70.1 40.7 L 71.6 40.7 L 72.3 42.8 L 69.4 44.2 L 70.8 47.1 L 70.1 55.8 L 68.0 57.9 L 61.5 58.6 L 60.8 60.1 L 57.2 60.8 L 54.3 62.9 L 44.2 64.4 L 39.2 57.2 L 39.2 55.8 L 42.1 53.6 L 40.7 52.2 L 41.4 48.6 L 47.1 41.4 L 53.6 39.2 L 53.6 37.1 L 52.2 36.3 L 52.9 34.2 L 51.4 32.8 L 52.2 30.6 L 47.8 31.3 L 48.6 33.5 L 43.5 34.9 L 42.1 39.2 L 24.8 42.1 L 12.6 49.3 L 9.0 55.8 L 11.2 59.3 L 14.1 60.8 L 15.5 67.2 L 17.7 67.2 L 19.1 63.7 L 23.4 65.8 L 23.4 68.0 L 20.5 68.7 L 20.5 70.1 L 17.7 71.6 L 17.7 74.4 L 15.5 78.8 L 17.7 78.0 L 20.5 79.5 L 21.2 78.0 L 22.7 78.0 L 24.8 80.2 L 32.0 79.5 L 32.8 81.6 L 37.1 81.6 L 39.9 83.1 L 44.2 83.1 L 47.1 81.6 L 50.7 82.3 L 54.3 79.5 L 57.9 78.8 L 59.3 76.6 L 56.5 73.7 L 57.2 70.1 L 52.2 68.7 L 50.7 65.8 L 55.0 65.1 L 56.5 66.5 L 57.9 64.4 L 66.5 63.7 L 70.8 65.8 L 73.0 65.1 L 78.0 70.1 L 77.3 73.0 L 79.5 77.3 L 83.8 75.2 L 88.8 70.1 L 87.4 69.4 L 87.4 68.0 L 89.5 66.5 L 89.5 62.2 L 86.7 55.8 L 86.7 52.2 L 90.2 50.0 Z"
      fill="url(#wf-vf-dust)"
    />

    {/* Dust Shadows and Crevices */}
    <path
      d="M 52.9 75.9 L 53.6 78.8 L 55.8 76.6 L 59.3 76.6 L 58.6 75.2 Z M 16.9 76.6 L 20.5 75.2 L 21.2 76.6 L 23.4 76.6 L 24.8 78.8 L 34.2 79.5 L 35.6 81.6 L 39.9 83.1 L 44.2 83.1 L 47.1 80.9 L 50.0 80.9 L 50.0 79.5 L 49.3 80.9 L 46.4 80.9 L 45.0 79.5 L 39.9 80.2 L 39.2 78.8 L 34.2 78.8 L 30.6 77.3 L 28.4 78.0 L 27.0 75.9 L 22.7 75.9 L 22.0 73.7 L 24.1 73.0 L 25.6 67.2 L 27.7 66.5 L 26.3 65.1 L 22.7 64.4 L 24.8 67.2 L 24.8 70.8 L 19.1 70.8 L 19.1 73.0 Z M 89.5 45.7 L 87.4 46.4 L 88.1 50.0 L 85.9 52.2 L 83.8 52.2 L 85.9 55.0 L 85.2 58.6 L 86.7 60.8 L 86.7 63.7 L 84.5 65.8 L 84.5 68.7 L 81.6 68.0 L 83.8 70.1 L 83.8 72.3 L 80.9 73.0 L 79.5 71.6 L 78.8 75.2 L 82.3 75.9 L 85.2 73.0 L 85.2 71.6 L 87.4 70.8 L 86.7 68.7 L 88.1 66.5 L 89.5 66.5 L 88.1 65.8 L 88.1 63.7 L 89.5 62.9 L 88.1 57.9 L 85.2 54.3 L 86.7 51.4 L 89.5 50.7 Z M 37.8 41.4 L 25.6 42.1 L 12.6 50.0 L 12.6 52.2 L 9.8 55.0 L 9.8 56.5 L 14.1 60.8 L 14.1 62.9 L 16.2 64.4 L 16.2 68.0 L 17.7 67.2 L 17.7 64.4 L 19.8 63.7 L 18.4 63.7 L 17.7 60.8 L 14.8 58.6 L 15.5 53.6 L 16.9 52.2 L 20.5 51.4 L 22.0 48.6 L 29.2 45.0 L 32.0 45.0 L 34.9 42.8 L 37.1 43.5 Z"
      fill="url(#wf-vf-sh)"
      opacity="0.85"
    />

    {/* Dust Highlights */}
    <path
      d="M 85.9 47.1 L 83.1 43.5 L 80.2 42.8 L 78.8 38.5 L 71.6 37.8 L 70.1 40.7 L 71.6 40.7 L 72.3 42.8 L 69.4 44.2 L 70.8 46.4 L 70.1 55.8 L 68.0 57.9 L 61.5 58.6 L 60.8 60.1 L 57.2 60.8 L 54.3 62.9 L 44.2 64.4 L 41.4 61.5 L 39.2 55.8 L 42.1 53.6 L 40.7 50.7 L 42.8 47.8 L 42.8 45.7 L 47.1 41.4 L 53.6 39.2 L 53.6 37.1 L 52.2 36.3 L 52.9 34.2 L 50.7 32.8 L 50.0 35.6 L 47.1 34.2 L 44.2 35.6 L 44.2 37.1 L 41.4 39.9 L 36.3 40.7 L 39.9 40.7 L 41.4 42.1 L 41.4 43.5 L 39.2 45.7 L 36.3 45.0 L 27.7 47.8 L 29.2 49.3 L 28.4 51.4 L 22.0 52.2 L 16.9 55.8 L 17.7 57.9 L 22.0 60.8 L 27.7 59.3 L 27.7 63.7 L 32.0 65.1 L 31.3 68.0 L 29.2 68.7 L 29.2 75.9 L 34.9 77.3 L 39.9 77.3 L 41.4 75.9 L 48.6 76.6 L 48.6 69.4 L 52.2 69.4 L 53.6 72.3 L 56.5 72.3 L 55.0 69.4 L 48.6 68.0 L 48.6 66.5 L 50.0 65.1 L 52.2 65.1 L 52.9 63.7 L 57.2 65.1 L 58.6 63.7 L 71.6 62.2 L 72.3 60.8 L 73.7 60.8 L 80.2 65.1 L 80.2 69.4 L 80.2 68.0 L 83.1 65.8 L 82.3 62.2 L 83.8 61.5 L 83.1 59.3 L 85.2 57.2 L 82.3 51.4 L 85.2 49.3 Z"
      fill="url(#wf-vf-hi)"
      opacity="0.9"
    />

    {/* Mid Cyan Flame Plume */}
    <path
      d="M 65.1 14.1 L 52.9 11.9 L 47.8 15.5 L 49.3 17.7 L 55.0 19.1 L 55.0 22.0 L 57.2 24.1 L 57.2 29.2 L 55.8 30.6 L 52.2 30.6 L 54.3 38.5 L 44.2 45.0 L 40.7 51.4 L 42.8 53.6 L 39.9 57.2 L 42.1 59.3 L 42.1 60.8 L 45.7 63.7 L 57.2 60.8 L 62.9 56.5 L 68.7 56.5 L 70.1 52.2 L 69.4 44.2 L 74.4 41.4 L 70.8 41.4 L 69.4 39.2 L 73.7 37.1 L 77.3 37.8 L 83.8 29.2 L 79.5 29.2 L 77.3 22.0 L 74.4 19.8 L 71.6 19.8 Z"
      fill="url(#wf-vf-mid)"
    />

    {/* Bright Ethereal Core */}
    <path
      d="M 64.4 14.8 L 55.8 14.1 L 54.3 15.5 L 55.0 17.7 L 57.9 19.1 L 57.9 21.2 L 59.3 23.4 L 57.9 25.6 L 60.1 28.4 L 60.1 30.6 L 57.2 32.0 L 56.5 33.5 L 53.6 34.2 L 54.3 36.3 L 53.6 39.2 L 49.3 42.1 L 46.4 42.1 L 43.5 45.7 L 40.7 47.1 L 37.1 45.7 L 34.9 48.6 L 36.3 49.3 L 36.3 47.8 L 38.5 47.1 L 40.7 49.3 L 39.2 51.4 L 36.3 50.7 L 37.8 53.6 L 37.1 54.3 L 38.5 53.6 L 39.9 55.0 L 39.2 55.8 L 40.7 58.6 L 39.9 62.2 L 43.5 65.1 L 46.4 65.1 L 50.7 62.9 L 57.9 63.7 L 61.5 60.1 L 62.2 60.8 L 64.4 59.3 L 66.5 59.3 L 68.0 57.2 L 70.8 60.1 L 74.4 57.2 L 73.7 56.5 L 70.1 58.6 L 68.7 56.5 L 70.1 54.3 L 68.0 52.9 L 70.1 44.2 L 73.0 41.4 L 73.7 42.1 L 74.4 41.4 L 73.0 37.8 L 76.6 37.1 L 78.0 32.0 L 73.0 27.0 L 74.4 22.0 L 70.1 20.5 Z M 70.1 31.3 L 67.2 34.2 L 65.1 32.8 L 65.8 31.3 L 69.4 30.6 Z"
      fill="url(#wf-vf-core)"
    />

    {/* Incandescent White Center */}
    <path
      d="M 59.3 51.4 L 62.2 48.6 L 63.7 49.3 L 65.1 48.6 L 64.4 47.8 L 62.9 48.6 L 59.3 46.4 L 61.5 47.8 L 60.1 48.6 Z M 57.9 47.8 L 56.5 46.4 L 53.6 47.1 L 51.4 45.0 L 50.7 47.1 L 52.9 46.4 L 53.6 49.3 L 48.6 52.9 L 52.2 50.7 L 53.6 51.4 L 57.2 49.3 L 57.9 50.0 L 57.2 49.3 Z M 62.2 39.9 L 58.6 42.8 L 57.9 45.0 L 62.2 41.4 Z"
      fill="#ffffff"
      opacity="0.95"
    />

    {/* Floating Arcane Phosphor Sparks */}
    <circle cx="48" cy="17" r="1.2" fill="#ffffff" />
    <circle cx="48" cy="17" r="2.6" fill="#38bdf8" opacity="0.5" />
    <circle cx="74" cy="14" r="1.1" fill="#ffffff" />
    <circle cx="74" cy="14" r="2.4" fill="#67e8f9" opacity="0.5" />
    <circle cx="83" cy="24" r="1.3" fill="#ffffff" />
    <circle cx="83" cy="24" r="2.8" fill="#38bdf8" opacity="0.4" />
    <circle cx="36" cy="30" r="0.9" fill="#a5f3fc" opacity="0.8" />
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

// Höllvania Arcane Collection Emblem (Warframe: 1999 The Hex Pixel Sigil)
export const HollvaniaIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ArcanePackFrame />
    {/* The Hex 1999 Digital Pixel Emblem */}
    <g fill="currentColor">
      {/* Top Stepped Antenna & Transceiver Spire */}
      <rect x="48" y="17" width="4" height="6" />
      <rect x="46" y="21" width="8" height="3" />
      <rect x="43" y="24" width="14" height="3" />
      <rect x="40" y="27" width="20" height="3" />

      {/* Upper Side Brackets / Transceivers */}
      <path
        d="M30 22 H36 V35 H32 V25 H30 Z"
      />
      <path
        d="M70 22 H64 V35 H68 V25 H70 Z"
      />

      {/* Diagonal Pixelated Crossed Bands (1999 Digital Lattice) */}
      <rect x="36" y="30" width="3" height="3" />
      <rect x="39" y="33" width="3" height="3" />
      <rect x="42" y="36" width="3" height="3" />
      <rect x="55" y="45" width="3" height="3" />
      <rect x="58" y="48" width="3" height="3" />
      <rect x="61" y="51" width="3" height="3" />

      <rect x="61" y="30" width="3" height="3" />
      <rect x="58" y="33" width="3" height="3" />
      <rect x="55" y="36" width="3" height="3" />
      <rect x="42" y="45" width="3" height="3" />
      <rect x="39" y="48" width="3" height="3" />
      <rect x="36" y="51" width="3" height="3" />

      {/* Stepped Pixel Diamond Contour */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48 29 H52 V32 H56 V35 H61 V38 H65 V41 H69 V45 H65 V48 H61 V51 H56 V54 H52 V57 H48 V54 H44 V51 H39 V48 H35 V45 H31 V41 H35 V38 H39 V35 H44 V32 H48 V29 Z M48 35 H52 V38 H55 V41 H57 V44 H55 V47 H52 V50 H48 V50 H45 V47 H43 V44 H45 V41 H48 V38 Z"
      />

      {/* Central Hex Core / Visor with Pupil */}
      <rect x="46" y="39.5" width="8" height="5" rx="1.5" />
      <rect x="49" y="41" width="2" height="2" fill="#000000" />

      {/* Lower Central Digital Spine */}
      <rect x="48" y="57" width="4" height="12" />
      <rect x="45" y="62" width="10" height="3" />

      {/* Lower Fangs with Cutout Slots */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29 57 H40 L38 64 L34 74 L31 74 L29 64 Z M33 62 V68 H35 V62 Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60 57 H71 L69 64 L66 74 L63 74 L61 64 Z M65 62 V68 H67 V62 Z"
      />
    </g>
  </svg>
);

