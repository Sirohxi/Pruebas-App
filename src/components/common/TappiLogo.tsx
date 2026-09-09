import React from 'react';

interface TappiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  lightMode?: boolean;
  className?: string;
  subtitle?: string;
}

export const TappiLogo: React.FC<TappiLogoProps> = ({
  size = 'md',
  withText = false,
  lightMode = false,
  className = '',
  subtitle,
}) => {
  const sizeMap = {
    xs: { h: 'h-6', w: 'w-4', text: 'text-base', sub: 'text-[9px]' },
    sm: { h: 'h-8', w: 'w-5', text: 'text-lg', sub: 'text-[10px]' },
    md: { h: 'h-10', w: 'w-7', text: 'text-2xl', sub: 'text-xs' },
    lg: { h: 'h-14', w: 'w-10', text: 'text-3xl', sub: 'text-sm' },
    xl: { h: 'h-20', w: 'w-14', text: 'text-4xl', sub: 'text-base' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${dim.h} ${dim.w} flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105`}>
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Tassel / Tuft */}
          <g fill="#4A3184">
            <path d="M 200 65 L 188 15 C 188 15 192 10 196 15 L 202 65 Z" />
            <path d="M 200 65 L 200 5 C 200 5 204 5 204 5 L 205 65 Z" />
            <path d="M 200 65 L 212 15 C 212 15 208 10 204 15 L 198 65 Z" />
            <path d="M 175 40 L 225 40" stroke="#4A3184" strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* Magenta Dome of Andean Chullo */}
          <path d="M 60 220 C 60 110 120 60 200 60 C 280 60 340 110 340 220 Z" fill="#AB2E81" />

          {/* Golden Zig-Zag Pattern */}
          <path
            d="M 65 170 
               L 100 130 
               L 150 180 
               L 200 120 
               L 250 180 
               L 300 130 
               L 335 170
               L 338 195
               L 300 155
               L 250 205
               L 200 145
               L 150 205
               L 100 155
               L 62 195 Z"
            fill="#F3A81A"
          />

          {/* Left Ear Flap */}
          <path
            d="M 60 220 Q 48 305 70 340 Q 60 345 58 355 C 56 365 65 375 68 385 L 68 400 L 62 400 L 62 385 C 55 375 48 355 50 330 C 50 290 55 240 60 220 Z"
            fill="#AB2E81"
          />
          <line x1="65" y1="390" x2="65" y2="425" stroke="#F3A81A" strokeWidth="7" strokeLinecap="round" />
          <circle cx="65" cy="435" r="18" fill="#F3A81A" />

          {/* Right Ear Flap */}
          <path
            d="M 340 220 Q 352 305 330 340 Q 340 345 342 355 C 344 365 335 375 332 385 L 332 400 L 338 400 L 338 385 C 345 375 352 355 350 330 C 350 290 345 240 340 220 Z"
            fill="#AB2E81"
          />
          <line x1="335" y1="390" x2="335" y2="425" stroke="#F3A81A" strokeWidth="7" strokeLinecap="round" />
          <circle cx="335" cy="435" r="18" fill="#F3A81A" />

          {/* Main Pin Body */}
          <path
            d="M 70 245
               L 70 310
               C 70 350 110 440 200 570
               C 290 440 330 350 330 310
               L 330 245 Z"
            fill="#4A3184"
          />

          {/* Golden Headband */}
          <rect x="50" y="220" width="300" height="36" rx="6" fill="#F3A81A" />

          {/* Pin Center White Hole */}
          <circle cx="200" cy="355" r="54" fill="#FFFFFF" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight ${dim.text} ${
                lightMode ? 'text-white' : 'text-[#4A3184]'
              }`}
            >
              tappi
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#AB2E81] mb-2 inline-block"></span>
          </div>
          <span
            className={`font-semibold tracking-wider uppercase ${dim.sub} ${
              lightMode ? 'text-violet-200' : 'text-slate-500'
            }`}
          >
            {subtitle || 'Movilidad Conectada'}
          </span>
        </div>
      )}
    </div>
  );
};
