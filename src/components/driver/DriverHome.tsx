import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Play,
  Bus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Navigation,
  Shield,
  Fuel,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const {
    driverUser,
    driverProfile,
    vehicles,
    routes,
    activeTrip,
    startDriverTrip,
    setDriverTab,
  } = useTappi();

  const [selectedRouteId, setSelectedRouteId] = useState('route-1');
  const assignedVehicle = vehicles[0];
  const targetRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Header Driver Card */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3A81A]">
            Panel de Conductor
          </span>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            Hola, {driverUser.name.split(' ')[0]} 🚍
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{driverProfile.status === 'on_trip' ? 'En Ruta Activa' : 'Disponible'}</span>
        </div>
      </div>

      {/* GIANT PRIMARY ACTION BUTTON (MINIMAL ACTIONS DURING PRE-TRIP) */}
      {activeTrip ? (
        <div className="p-5 bg-gradient-to-r from-[#4A3184] to-[#AB2E81] rounded-3xl text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/15 px-2.5 py-1 rounded-full">
              ● Viaje en Ejecución
            </span>
            <span className="text-xs text-violet-200">
              {activeTrip.passengers.filter(p => p.status === 'boarded').length} a bordo
            </span>
          </div>

          <div>
            <div className="text-xl font-black">{activeTrip.routeName}</div>
            <div className="text-xs text-violet-200 mt-1">
              Placa: <strong>{activeTrip.vehiclePlate}</strong> • Velocidad: {activeTrip.speedKmH} km/h
            </div>
          </div>

          <button
            id="btn-driver-resume-cockpit"
            onClick={() => setDriverTab('active_trip')}
            className="w-full py-3.5 bg-white hover:bg-slate-50 text-[#4A3184] text-sm font-black rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5 text-[#AB2E81]" />
            Abrir Cabina de Navegación En Vivo
          </button>
        </div>
      ) : (
        <div className="p-5 bg-gradient-to-br from-slate-900 via-purple-950 to-[#4A3184] rounded-3xl text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Próxima Salida Programada
            </span>
            <span className="text-xs text-slate-300 font-mono">08:00 AM</span>
          </div>

          <div>
            <label className="text-xs text-violet-200 block mb-1">Ruta Asignada:</label>
            <select
              value={selectedRouteId}
              onChange={e => setSelectedRouteId(e.target.value)}
              className="w-full bg-white/15 border border-white/20 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-hidden"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id} className="text-slate-900 font-medium">
                  {r.name} (S/ {r.fare.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-driver-start-trip"
            onClick={() => startDriverTrip(selectedRouteId)}
            className="w-full py-4 bg-gradient-to-r from-[#F3A81A] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-base font-black rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            INICIAR SERVICIO / VIAJE
          </button>
        </div>
      )}

      {/* VEHICLE STATUS & CHECKLIST (CRITICAL PRE-TRIP INFO) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-[#4A3184]" />
            Unidad Asignada: {assignedVehicle.plate}
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Operativa
          </span>
        </div>

        <div className="text-xs font-medium text-slate-700">
          {assignedVehicle.brand} {assignedVehicle.model} ({assignedVehicle.year})
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold block">Capacidad</span>
            <span className="text-xs font-bold text-slate-900">{assignedVehicle.capacity} asientos</span>
          </div>

          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold block">Combustible</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Fuel className="w-3 h-3" /> GNV 85%
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold block">SOAT</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Vigente
            </span>
          </div>
        </div>
      </div>

      {/* DRIVER STATS SUMMARY */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setDriverTab('earnings')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-violet-200"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ingresos de Hoy</span>
          <div className="text-xl font-black text-[#4A3184] mt-0.5">
            S/ {driverProfile.todayEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% cobros procesados</span>
        </div>

        <div
          onClick={() => setDriverTab('profile')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-violet-200"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Tu Reputación</span>
          <div className="text-xl font-black text-slate-900 flex items-center gap-1 mt-0.5">
            <Star className="w-5 h-5 fill-[#F3A81A] text-[#F3A81A]" />
            {driverProfile.rating}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">97.4% a tiempo</span>
        </div>
      </div>

      {/* QUICK PASSENGER MANIFEST ACCESS */}
      <div
        onClick={() => setDriverTab('passengers')}
        className="p-3.5 bg-violet-50 hover:bg-violet-100/80 rounded-2xl border border-violet-200 flex items-center justify-between cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4A3184] text-white flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Lista de Pasajeros de la Empresa</div>
            <div className="text-[11px] text-slate-500">Verifica credenciales y valida abordajes</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#4A3184]" />
      </div>
    </div>
  );
};
