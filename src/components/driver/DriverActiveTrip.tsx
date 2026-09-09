import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  MapPin,
  Clock,
  QrCode,
  Users,
  CheckCircle2,
  StopCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const DriverActiveTrip: React.FC = () => {
  const {
    activeTrip,
    routes,
    advanceDriverStop,
    finishDriverTrip,
    openQrModal,
    setDriverTab,
    reportIncident,
    driverProfile,
  } = useTappi();

  const [confirmFinish, setConfirmFinish] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  if (!activeTrip) {
    return (
      <div className="text-center py-16 px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <StopCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No hay ningún viaje en curso</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Inicia un nuevo servicio desde la pantalla principal para activar la cabina de navegación.
        </p>
        <button
          onClick={() => setDriverTab('home')}
          className="py-2.5 px-6 bg-[#4A3184] text-white text-xs font-bold rounded-xl shadow-md"
        >
          Ir a Inicio
        </button>
      </div>
    );
  }

  const currentRoute = routes.find(r => r.id === activeTrip.routeId) || routes[0];
  const totalStops = currentRoute.stops.length;
  const currentStop = currentRoute.stops[activeTrip.currentStopIndex] || currentRoute.stops[0];
  const nextStop = currentRoute.stops[activeTrip.currentStopIndex + 1];
  const isLastStop = activeTrip.currentStopIndex >= totalStops - 1;

  const boardedCount = activeTrip.passengers.filter(p => p.status === 'boarded').length;
  const totalCollected = boardedCount * activeTrip.fare;

  const handleSos = () => {
    setSosActive(true);
    reportIncident({
      title: 'Auxilio / Incidencia reportada por el conductor en ruta',
      description: `El conductor de la unidad ${activeTrip.vehiclePlate} solicitó asistencia operativa en el tramo de ${currentStop.name}.`,
      category: 'seguridad',
      severity: 'alta',
      vehiclePlate: activeTrip.vehiclePlate,
    });
    setTimeout(() => setSosActive(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* GLANCEABLE HIGH-CONTRAST NAVIGATION HUD */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              En Tránsito • {activeTrip.vehiclePlate}
            </span>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-violet-200">
            {activeTrip.speedKmH} km/h
          </span>
        </div>

        {/* Big Stop Banner */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {isLastStop ? 'Destino Final' : 'Próximo Paradero:'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {currentStop.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#F3A81A]" />
            {currentStop.address}
          </p>
        </div>

        {/* Progress Bar through Stops */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Parada {activeTrip.currentStopIndex + 1} de {totalStops}</span>
            <span>ETA: ~{activeTrip.etaNextStopMin} min</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#AB2E81] via-[#F3A81A] to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${((activeTrip.currentStopIndex + 1) / totalStops) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* ONE-TOUCH GIANT BUTTON TO ADVANCE STOP */}
        <button
          id="btn-driver-advance-stop"
          onClick={advanceDriverStop}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-base rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" />
          {isLastStop ? 'FINALIZAR RUTA COMPLETA' : 'LLEGUÉ / SIGUIENTE PARADERO'}
        </button>
      </div>

      {/* AFORO & PASSENGER CAPACITY STATUS (ONE-HAND SCAN) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#4A3184]" />
            <span className="text-xs font-bold text-slate-800">Aforo de Pasajeros</span>
          </div>
          <span className="text-xs font-black text-[#4A3184]">
            {boardedCount} / {activeTrip.capacity} ocupados
          </span>
        </div>

        {/* Meter */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4A3184] rounded-full transition-all"
            style={{ width: `${(boardedCount / activeTrip.capacity) * 100}%` }}
          ></div>
        </div>

        {/* Quick QR Passenger Verification Button */}
        <div className="flex gap-2 pt-1">
          <button
            id="btn-driver-scan-passenger"
            onClick={() => openQrModal('driver_scan_passenger')}
            className="flex-1 py-3 bg-[#4A3184] hover:bg-[#3c256d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#F3A81A]" />
            Escanear QR de Pasajero
          </button>

          <button
            onClick={() => setDriverTab('passengers')}
            className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            Ver Lista ({activeTrip.passengers.length})
          </button>
        </div>
      </div>

      {/* METRICS OF CURRENT SHIFT */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Recaudo Este Viaje</span>
          <div className="text-lg font-black text-emerald-600 mt-0.5">
            S/ {totalCollected.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Tarifa S/ {activeTrip.fare.toFixed(2)} c/u</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pasajeros Restantes</span>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            {activeTrip.passengers.filter(p => p.status === 'registered').length} por subir
          </div>
          <span className="text-[10px] text-slate-500">En siguientes paraderos</span>
        </div>
      </div>

      {/* EMERGENCY & SAFETY CONTROLS */}
      <div className="flex gap-2">
        <button
          onClick={handleSos}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            sosActive
              ? 'bg-rose-600 text-white animate-bounce'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {sosActive ? 'Alerta Transmitida a Central' : 'Alerta de Tráfico / SOS'}
        </button>

        <button
          onClick={() => setConfirmFinish(true)}
          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200"
        >
          Finalizar
        </button>
      </div>

      {/* CONFIRMATION POPUP FOR FINISHING TRIP */}
      {confirmFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-3">
            <h3 className="text-base font-bold text-slate-900">¿Deseas finalizar este servicio?</h3>
            <p className="text-xs text-slate-500">
              Se cerrará la ruta y se consolidarán los S/ {totalCollected.toFixed(2)} de recaudación en tus ingresos del día.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmFinish(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Continuar Viaje
              </button>
              <button
                onClick={() => {
                  setConfirmFinish(false);
                  finishDriverTrip();
                }}
                className="flex-1 py-2.5 bg-[#4A3184] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Sí, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
