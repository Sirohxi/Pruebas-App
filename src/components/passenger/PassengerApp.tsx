import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { PassengerHome } from './PassengerHome';
import { PassengerTrips } from './PassengerTrips';
import { PassengerWallet } from './PassengerWallet';
import { PassengerRewards } from './PassengerRewards';
import { PassengerProfile } from './PassengerProfile';
import {
  Compass,
  Bus,
  Wallet,
  Gift,
  User as UserIcon,
} from 'lucide-react';

export const PassengerApp: React.FC = () => {
  const { passengerTab, setPassengerTab, activeTrip } = useTappi();

  return (
    <div className="relative min-h-[620px] flex flex-col justify-between">
      {/* Active Tab Screen */}
      <div className="flex-1 p-3 sm:p-4">
        {passengerTab === 'home' && <PassengerHome />}
        {passengerTab === 'trips' && <PassengerTrips />}
        {passengerTab === 'wallet' && <PassengerWallet />}
        {passengerTab === 'rewards' && <PassengerRewards />}
        {passengerTab === 'profile' && <PassengerProfile />}
      </div>

      {/* ERGONOMIC BOTTOM NAVIGATION BAR */}
      <nav className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 z-30 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {/* 1. Inicio */}
          <button
            id="nav-passenger-home"
            onClick={() => setPassengerTab('home')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              passengerTab === 'home'
                ? 'text-[#4A3184] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${passengerTab === 'home' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Inicio</span>
          </button>

          {/* 2. Viajes */}
          <button
            id="nav-passenger-trips"
            onClick={() => setPassengerTab('trips')}
            className={`relative flex flex-col items-center py-1.5 rounded-xl transition-all ${
              passengerTab === 'trips'
                ? 'text-[#4A3184] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bus className={`w-5 h-5 ${passengerTab === 'trips' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Viajes</span>
            {activeTrip && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            )}
          </button>

          {/* 3. Billetera */}
          <button
            id="nav-passenger-wallet"
            onClick={() => setPassengerTab('wallet')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              passengerTab === 'wallet'
                ? 'text-[#4A3184] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className={`w-5 h-5 ${passengerTab === 'wallet' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Billetera</span>
          </button>

          {/* 4. Recompensas */}
          <button
            id="nav-passenger-rewards"
            onClick={() => setPassengerTab('rewards')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              passengerTab === 'rewards'
                ? 'text-[#4A3184] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Gift className={`w-5 h-5 ${passengerTab === 'rewards' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Beneficios</span>
          </button>

          {/* 5. Perfil */}
          <button
            id="nav-passenger-profile"
            onClick={() => setPassengerTab('profile')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
              passengerTab === 'profile'
                ? 'text-[#4A3184] font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserIcon className={`w-5 h-5 ${passengerTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
