import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { DriverHome } from './DriverHome';
import { DriverActiveTrip } from './DriverActiveTrip';
import { DriverPassengers } from './DriverPassengers';
import { DriverEarnings } from './DriverEarnings';
import { DriverProfile } from './DriverProfile';
import {
  Compass,
  Navigation,
  Users,
  DollarSign,
  User as UserIcon,
} from 'lucide-react';

export const DriverApp: React.FC = () => {
  const { driverTab, setDriverTab, activeTrip } = useTappi();

  return (
    <div className="relative min-h-[620px] flex flex-col justify-between">
      {/* Active Tab Screen */}
      <div className="flex-1 p-3 sm:p-4">
        {driverTab === 'home' && <DriverHome />}
        {driverTab === 'active_trip' && <DriverActiveTrip />}
        {driverTab === 'passengers' && <DriverPassengers />}
        {driverTab === 'earnings' && <DriverEarnings />}
        {driverTab === 'profile' && <DriverProfile />}
      </div>

      {/* ERGONOMIC DRIVER BOTTOM NAVIGATION BAR */}
      <nav className="sticky bottom-0 left-0 right-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-3 z-30 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 text-white">
          {/* 1. Inicio */}
          <button
            id="nav-driver-home"
            onClick={() => setDriverTab('home')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              driverTab === 'home'
                ? 'text-[#F3A81A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className={`w-5 h-5 ${driverTab === 'home' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Inicio</span>
          </button>

          {/* 2. En Ruta / Viaje Actual */}
          <button
            id="nav-driver-trip"
            onClick={() => setDriverTab('active_trip')}
            className={`relative flex flex-col items-center py-1.5 rounded-xl transition-all ${
              driverTab === 'active_trip'
                ? 'text-[#F3A81A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className={`w-5 h-5 ${driverTab === 'active_trip' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">En Ruta</span>
            {activeTrip && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* 3. Pasajeros */}
          <button
            id="nav-driver-passengers"
            onClick={() => setDriverTab('passengers')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              driverTab === 'passengers'
                ? 'text-[#F3A81A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className={`w-5 h-5 ${driverTab === 'passengers' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Pasajeros</span>
          </button>

          {/* 4. Ingresos */}
          <button
            id="nav-driver-earnings"
            onClick={() => setDriverTab('earnings')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              driverTab === 'earnings'
                ? 'text-[#F3A81A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className={`w-5 h-5 ${driverTab === 'earnings' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Ingresos</span>
          </button>

          {/* 5. Perfil */}
          <button
            id="nav-driver-profile"
            onClick={() => setDriverTab('profile')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              driverTab === 'profile'
                ? 'text-[#F3A81A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className={`w-5 h-5 ${driverTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
