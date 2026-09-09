import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import { InteractiveMap } from '../common/InteractiveMap';
import {
  QrCode,
  Bus,
  Clock,
  Shield,
  Star,
  ChevronRight,
  Phone,
  AlertTriangle,
  Compass,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export const PassengerHome: React.FC = () => {
  const {
    openQrModal,
    activeTrip,
    routes,
    passengerProfile,
    passengerUser,
    setPassengerTab,
    openRatingModal,
    reportIncident,
  } = useTappi();

  const [selectedRouteId, setSelectedRouteId] = useState('route-1');
  const [sosActive, setSosActive] = useState(false);

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleQuickSos = () => {
    setSosActive(true);
    reportIncident({
      title: 'Alerta SOS de Seguridad activada',
      description: `El pasajero ${passengerUser.name} activó el botón de auxilio rápido a bordo del bus ${activeTrip?.vehiclePlate || 'B8X-720'}.`,
      category: 'seguridad',
      severity: 'alta',
      vehiclePlate: activeTrip?.vehiclePlate,
    });
    setTimeout(() => setSosActive(false), 3000);
  };

  return (
    <div className="flex flex-col space-y-4 pb-20">
      {/* Welcome & Corporate Greeting Pill */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#AB2E81]">
            Transporte Corporativo
          </span>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            Hola, {passengerUser.name.split(' ')[0]} 👋
          </h2>
        </div>
        <button
          onClick={() => setPassengerTab('wallet')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-[#4A3184] rounded-full border border-violet-200 text-xs font-bold hover:bg-violet-100 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#AB2E81]" />
          <span>S/ {(passengerProfile.walletBalance + passengerProfile.corporateSubsidy).toFixed(2)}</span>
        </button>
      </div>

      {/* PREDOMINANT INTERACTIVE MAP */}
      <div className="relative">
        <InteractiveMap
          currentRoute={selectedRoute}
          activeTrip={activeTrip}
          userLocationName="Estación Javier Prado (Tú)"
          height="h-64 sm:h-72"
        />

        {/* Floating Quick Route Selector over Map bottom */}
        <div className="absolute -bottom-3 left-3 right-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {routes.map(r => {
            const isSel = r.id === selectedRouteId;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-[#4A3184] text-white ring-2 ring-white'
                    : 'bg-white/95 backdrop-blur-md text-slate-700 hover:bg-white'
                }`}
              >
                <Bus className={`w-3.5 h-3.5 ${isSel ? 'text-[#F3A81A]' : 'text-slate-500'}`} />
                <span>{r.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CALL TO ACTION: ESCANEAR QR PARA VIAJAR / PAGAR */}
      <div className="pt-2">
        <button
          id="btn-scan-qr-main"
          onClick={() => openQrModal('passenger_scan_vehicle')}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#4A3184] via-[#7B2E81] to-[#AB2E81] text-white rounded-2xl shadow-xl shadow-purple-900/20 hover:shadow-purple-900/30 font-extrabold text-base flex items-center justify-between transition-all transform active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-[#F3A81A]" />
            </div>
            <div className="text-left">
              <div className="text-white text-base font-black">Escanear QR del Bus</div>
              <div className="text-violet-200 text-xs font-medium">
                Paga tu pasaje y valida tu asiento al instante
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ACTIVE TRIP CARD OR NEXT BUS ARRIVAL */}
      {activeTrip ? (
        <div className="bg-white rounded-2xl p-4 border border-violet-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Viaje en Curso
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {activeTrip.speedKmH} km/h
            </span>
          </div>

          {/* Driver & Vehicle Details */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={activeTrip.driverAvatar}
                alt="Conductor"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#4A3184]"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{activeTrip.driverName}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center text-[#F3A81A] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F3A81A] mr-0.5" />
                    {activeTrip.driverRating}
                  </span>
                  <span>• Placa: <strong>{activeTrip.vehiclePlate}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeTrip.driverPhone}`}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Llamar al conductor"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={handleQuickSos}
                className={`p-2.5 rounded-xl transition-all ${
                  sosActive
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }`}
                title="Botón de Pánico / SOS"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Stop Progression */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Próxima parada:</span>
              <span className="font-bold text-[#4A3184]">
                ETA: ~{activeTrip.etaNextStopMin} min
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              Atocongo Intermodal (Panamericana Sur)
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setPassengerTab('trips')}
              className="flex-1 py-2 text-xs font-bold text-[#4A3184] bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors text-center"
            >
              Ver Trazabilidad Completa
            </button>
            <button
              onClick={() => openRatingModal(activeTrip)}
              className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              Calificar
            </button>
          </div>
        </div>
      ) : (
        /* Next Bus Schedule Card */
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#4A3184]" />
              <span className="text-xs font-bold text-slate-700">Próximo Bus de Empresa</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Llega en 4 min
            </span>
          </div>

          <div className="text-sm font-bold text-slate-900">
            {selectedRoute.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Paradero asignado: {passengerProfile.homeStop}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Tarifa con subsidio:</span>
            <span className="font-black text-[#4A3184] text-sm">
              S/ {selectedRoute.fare.toFixed(2)} <span className="text-[10px] text-emerald-600 font-semibold">(Cubierto 100%)</span>
            </span>
          </div>
        </div>
      )}

      {/* QUICK ACCESS TILES */}
      <div className="grid grid-cols-2 gap-3">
        {/* Virtual Badge */}
        <button
          onClick={() => openQrModal('passenger_show_badge')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-violet-300 hover:shadow-sm text-left transition-all flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-[#4A3184] flex items-center justify-center mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Mi Pase Digital</div>
            <div className="text-[11px] text-slate-500">Credencial {passengerProfile.employeeCode}</div>
          </div>
        </button>

        {/* Corporate Rewards */}
        <button
          onClick={() => setPassengerTab('rewards')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-violet-300 hover:shadow-sm text-left transition-all flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#AB2E81] flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Recompensas</div>
            <div className="text-[11px] text-slate-500">{passengerProfile.points} Puntos Tappi</div>
          </div>
        </button>
      </div>

      {/* SAFETY & TRAZABILITY BANNER */}
      <div className="p-3.5 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white shadow-xs text-[#4A3184] flex-shrink-0">
          <Shield className="w-5 h-5 text-[#4A3184]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Viaje Seguro y Trazable</h4>
          <p className="text-[11px] text-slate-600 leading-snug">
            Todos los conductores de Tappi cuentan con validación de identidad, SOAT vigente y monitoreo GPS 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};
