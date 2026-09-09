import React, { useState, useEffect } from 'react';
import { Route, Vehicle, Trip } from '../../types';
import {
  Navigation,
  ZoomIn,
  ZoomOut,
  MapPin,
  Clock,
  Car,
  Layers,
  Play,
  Pause,
} from 'lucide-react';

interface InteractiveMapProps {
  currentRoute?: Route;
  activeTrip?: Trip | null;
  vehicles?: Vehicle[];
  userLocationName?: string;
  height?: string;
  showControls?: boolean;
  onSelectStop?: (stopName: string) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentRoute,
  activeTrip,
  vehicles = [],
  userLocationName = 'Estación Javier Prado (Tú)',
  height = 'h-72 sm:h-96',
  showControls = true,
  onSelectStop,
  className = '',
}) => {
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(true);
  const [vehicleProgress, setVehicleProgress] = useState(0.42); // 0 to 1 along route
  const [activeStopHover, setActiveStopHover] = useState<string | null>(null);

  // Smooth simulation loop for moving vehicle along route
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setVehicleProgress(prev => {
        const next = prev + 0.004;
        return next > 0.95 ? 0.05 : next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Interpolated bus position along a curved polyline in SVG coordinate space (0..600, 0..400)
  // Route trajectory: starts top-left (120, 70), goes through corporate corridor to bottom-right (500, 340)
  const waypoints = [
    { x: 130, y: 70, name: 'Estación Javier Prado', eta: 'En paradero' },
    { x: 210, y: 110, name: 'Paradero Primavera / Encalada', eta: '6 min' },
    { x: 290, y: 170, name: 'Atocongo Intermodal', eta: '14 min' },
    { x: 370, y: 230, name: 'Peaje Villa / Alipio Ponce', eta: '22 min' },
    { x: 440, y: 290, name: 'Puente San Pedro (Lurín)', eta: '30 min' },
    { x: 520, y: 340, name: 'Campus TechPark Puerta 1', eta: '38 min' },
  ];

  // Calculate current bus position based on vehicleProgress
  const totalSegments = waypoints.length - 1;
  const scaledProgress = vehicleProgress * totalSegments;
  const currentSegmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segmentFraction = scaledProgress - currentSegmentIndex;

  const p1 = waypoints[currentSegmentIndex];
  const p2 = waypoints[currentSegmentIndex + 1];

  const busX = p1.x + (p2.x - p1.x) * segmentFraction;
  const busY = p1.y + (p2.y - p1.y) * segmentFraction;

  // Rotation angle for bus orientation
  const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const angleDeg = (angleRad * 180) / Math.PI;

  return (
    <div className={`relative w-full ${height} bg-[#f0f4f8] overflow-hidden rounded-2xl border border-slate-200 shadow-inner select-none ${className}`}>
      {/* SVG Vector Map Canvas */}
      <svg
        viewBox="0 0 650 400"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <defs>
          {/* Subtle Grid Pattern for city blocks */}
          <pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#f8fafc" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>

          {/* Green parks */}
          <linearGradient id="parkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.6" />
          </linearGradient>

          {/* Route line glowing gradient */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A3184" />
            <stop offset="60%" stopColor="#AB2E81" />
            <stop offset="100%" stopColor="#F3A81A" />
          </linearGradient>

          <filter id="busGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4A3184" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Base Background */}
        <rect width="650" height="400" fill="url(#urbanGrid)" />

        {/* City Parks & Green Corridors */}
        <path d="M 60 40 Q 110 30 140 60 Q 130 110 80 120 Z" fill="url(#parkGrad)" />
        <path d="M 460 210 Q 510 190 560 230 Q 540 280 480 270 Z" fill="url(#parkGrad)" />
        <path d="M 230 310 Q 280 300 320 340 Q 290 380 240 370 Z" fill="url(#parkGrad)" />

        {/* Secondary Avenues & Streets */}
        <g stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="40" y1="120" x2="610" y2="120" />
          <line x1="40" y1="260" x2="610" y2="260" />
          <line x1="180" y1="20" x2="180" y2="380" />
          <line x1="360" y1="20" x2="360" y2="380" />
          <line x1="500" y1="20" x2="500" y2="380" />
          <path d="M 30 210 Q 220 200 380 370" fill="none" />
        </g>

        {/* Street Labels */}
        <text x="50" y="114" fill="#94a3b8" fontSize="9" fontWeight="600">Av. Javier Prado Este</text>
        <text x="50" y="254" fill="#94a3b8" fontSize="9" fontWeight="600">Av. Primavera / Angamos</text>
        <text x="366" y="50" fill="#94a3b8" fontSize="9" fontWeight="600" transform="rotate(90 366 50)">Panamericana Sur</text>
        <text x="490" y="325" fill="#4A3184" fontSize="10" fontWeight="bold">TechPark Industrial Lurín</text>

        {/* Main Tappi Dedicated Transit Corridor Polyline */}
        {/* Outer casing */}
        <path
          d="M 130 70 L 210 110 L 290 170 L 370 230 L 440 290 L 520 340"
          fill="none"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Vibrant Gradient Track */}
        <path
          d="M 130 70 L 210 110 L 290 170 L 370 230 L 440 290 L 520 340"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all"
        />

        {/* Secondary Alternative Route (Ruta 204 Norte) */}
        <path
          d="M 130 70 L 110 160 L 140 250 L 200 330"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Passenger Stops */}
        {waypoints.map((st, idx) => {
          const isSelected = activeStopHover === st.name;
          const isTerminal = idx === 0 || idx === waypoints.length - 1;

          return (
            <g
              key={st.name}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                setActiveStopHover(st.name);
                onSelectStop?.(st.name);
              }}
              onMouseEnter={() => setActiveStopHover(st.name)}
            >
              {/* Outer white ring */}
              <circle cx={st.x} cy={st.y} r={isTerminal ? 8 : 6} fill="#ffffff" stroke="#4A3184" strokeWidth={isTerminal ? 3 : 2.5} />
              <circle cx={st.x} cy={st.y} r={isTerminal ? 4 : 3} fill={isTerminal ? '#AB2E81' : '#F3A81A'} />

              {/* Stop Label Banner */}
              <g transform={`translate(${st.x}, ${st.y - (idx % 2 === 0 ? 16 : -22)})`}>
                <rect
                  x="-55"
                  y="-11"
                  width="110"
                  height="20"
                  rx="10"
                  fill={isSelected ? '#4A3184' : '#ffffff'}
                  stroke={isSelected ? '#4A3184' : '#e2e8f0'}
                  strokeWidth="1"
                  className="drop-shadow-xs"
                />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#334155'}
                  fontSize="8.5"
                  fontWeight="600"
                >
                  {st.name.length > 18 ? st.name.slice(0, 16) + '…' : st.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* Passenger (Current User) Location Pin */}
        <g transform="translate(130, 70)">
          <circle cx="0" cy="0" r="18" fill="#AB2E81" fillOpacity="0.2" className="animate-ping" />
          <circle cx="0" cy="0" r="10" fill="#AB2E81" fillOpacity="0.4" />
          <circle cx="0" cy="0" r="6" fill="#AB2E81" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Live Moving Tappi Bus Vehicle */}
        <g
          transform={`translate(${busX}, ${busY})`}
          filter="url(#busGlow)"
          className="transition-transform duration-300"
        >
          {/* Pulsing radar radius */}
          <circle cx="0" cy="0" r="22" fill="#4A3184" fillOpacity="0.15" />

          {/* Vehicle Body container rotated by route tangent */}
          <g transform={`rotate(${angleDeg})`}>
            {/* Bus chassis */}
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#4A3184" stroke="#ffffff" strokeWidth="1.5" />
            {/* Windshield */}
            <rect x="7" y="-6" width="4" height="12" rx="1.5" fill="#38bdf8" />
            {/* Roof accent */}
            <line x1="-8" y1="0" x2="4" y2="0" stroke="#F3A81A" strokeWidth="2" strokeLinecap="round" />
            {/* Headlights */}
            <circle cx="13" cy="-4" r="1.5" fill="#fef08a" />
            <circle cx="13" cy="4" r="1.5" fill="#fef08a" />
          </g>

          {/* Floating Tag over Bus */}
          <g transform="translate(0, -20)">
            <rect x="-38" y="-12" width="76" height="18" rx="9" fill="#1e1b4b" className="shadow-md" />
            <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
              🚌 {activeTrip?.vehiclePlate || 'B8X-720'}
            </text>
          </g>
        </g>
      </svg>

      {/* Floating Map HUD Overlays */}
      {/* Top Left: Route Quick Info Badge */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2.5 max-w-[260px]">
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-[#4A3184]">
          <Navigation className="w-4 h-4 transform rotate-45" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#AB2E81] bg-pink-50 px-1.5 py-0.5 rounded">
              {currentRoute?.code || 'EXP-101'}
            </span>
            <span className="text-xs font-bold text-slate-800 truncate">
              {currentRoute?.name.split('-')[1] || 'Expreso San Isidro - Lurín'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
              <Clock className="w-3 h-3" /> Frecuencia: 15 min
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Live Simulation & Status Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
            isSimulating
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
          title={isSimulating ? 'Pausar simulación de GPS' : 'Reanudar simulación de GPS'}
        >
          {isSimulating ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="hidden sm:inline">GPS En Vivo</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Simular</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Right: Map Zoom Controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 text-slate-600 hover:text-[#4A3184] hover:bg-slate-100 rounded-lg transition-colors"
            title="Acercar mapa"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
            className="p-1.5 text-slate-600 hover:text-[#4A3184] hover:bg-slate-100 rounded-lg transition-colors"
            title="Alejar mapa"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Left: User Location Indicator */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
        <MapPin className="w-3.5 h-3.5 text-[#AB2E81]" />
        <span className="truncate max-w-[170px]">{userLocationName}</span>
      </div>
    </div>
  );
};
