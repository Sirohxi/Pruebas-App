import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Bus,
  MapPin,
  Clock,
  Star,
  Receipt,
  PlusCircle,
  ThumbsUp,
  ChevronRight,
  Shield,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const PassengerTrips: React.FC = () => {
  const {
    activeTrip,
    tripHistory,
    routes,
    proposedRoutes,
    proposeNewRoute,
    voteRouteProposal,
    openReceiptModal,
    openRatingModal,
    transactions,
  } = useTappi();

  const [subTab, setSubTab] = useState<'history' | 'routes' | 'propose'>('history');

  // New route form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [preferredTime, setPreferredTime] = useState('07:00 AM');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;
    proposeNewRoute({
      origin,
      destination,
      preferredTime,
    });
    setOrigin('');
    setDestination('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Tus Viajes y Rutas</h2>
        <p className="text-xs text-slate-500">
          Consulta tu trazabilidad, comprobantes y catálogo de transporte corporativo.
        </p>
      </div>

      {/* Segmented Control Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setSubTab('history')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            subTab === 'history'
              ? 'bg-white text-[#4A3184] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Historial ({tripHistory.length})
        </button>
        <button
          onClick={() => setSubTab('routes')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            subTab === 'routes'
              ? 'bg-white text-[#4A3184] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rutas ({routes.length})
        </button>
        <button
          onClick={() => setSubTab('propose')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            subTab === 'propose'
              ? 'bg-white text-[#4A3184] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Proponer Ruta
        </button>
      </div>

      {/* SUBTAB 1: HISTORIAL DE VIAJES */}
      {subTab === 'history' && (
        <div className="space-y-3">
          {/* Active Trip Banner if currently running */}
          {activeTrip && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 text-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  ● En Curso Ahora
                </span>
                <span className="text-xs text-violet-200">Inicio: {activeTrip.startTime}</span>
              </div>
              <h4 className="font-bold text-base text-white">{activeTrip.routeName}</h4>
              <p className="text-xs text-violet-200 mt-0.5">
                Vehículo {activeTrip.vehiclePlate} • Conductor: {activeTrip.driverName}
              </p>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/15">
                <span className="text-xs text-violet-200">Tarifa: S/ {activeTrip.fare.toFixed(2)}</span>
                <button
                  onClick={() => openRatingModal(activeTrip)}
                  className="text-xs font-bold px-3 py-1.5 bg-[#F3A81A] text-slate-950 rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Calificar Viaje
                </button>
              </div>
            </div>
          )}

          {/* Past Trips List */}
          <div className="space-y-2.5">
            {tripHistory.map(trip => {
              // Find matching transaction if any
              const matchingTx = transactions.find(t => t.tripId === trip.id) || transactions[0];

              return (
                <div
                  key={trip.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-violet-200 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {trip.routeName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.startTime}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      S/ {trip.fare.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-[#4A3184]" />
                      <span>{trip.vehiclePlate} ({trip.driverName.split(' ')[0]})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openReceiptModal(matchingTx)}
                        className="text-xs font-semibold text-[#4A3184] hover:underline flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Comprobante
                      </button>

                      <button
                        onClick={() => openRatingModal(trip)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Calificar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: RUTAS Y PARADEROS */}
      {subTab === 'routes' && (
        <div className="space-y-3">
          {routes.map(r => (
            <div
              key={r.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-violet-100 text-[#4A3184]">
                      {r.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Horario: {r.operatingHours} • Frecuencia: cada {r.frequencyMinutes} min
                  </p>
                </div>
                <span className="text-sm font-black text-[#4A3184]">
                  S/ {r.fare.toFixed(2)}
                </span>
              </div>

              {/* Stops timeline preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Paraderos oficiales ({r.stops.length}):
                </span>
                <div className="space-y-1.5">
                  {r.stops.map((st, i) => (
                    <div key={st.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-violet-200 text-[#4A3184] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-medium truncate">{st.name}</span>
                      <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">
                        +{st.etaMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: PROPONER NUEVA RUTA */}
      {subTab === 'propose' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200">
            <h3 className="text-sm font-bold text-[#4A3184] flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#AB2E81]" />
              ¿Necesitas una ruta directa a tu sede de trabajo?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Propón un nuevo corredor de movilidad corporativa. Las empresas evalúan la viabilidad según el volumen de solicitudes de los colaboradores.
            </p>

            <form onSubmit={handleProposeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Punto de Origen (Tu zona o paradero):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Óvalo Higuereta / Estación Angamos"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Punto de Destino (Sede o planta corporativa):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Campus Industrial Lurín Puerta 2"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Horario de Salida Preferido:
                </label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
                >
                  <option>06:15 AM</option>
                  <option>06:45 AM</option>
                  <option>07:00 AM</option>
                  <option>07:30 AM</option>
                  <option>08:00 AM</option>
                  <option>05:30 PM (Retorno)</option>
                  <option>06:30 PM (Retorno)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A3184] hover:bg-[#3b246f] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Enviar Solicitud de Ruta
              </button>

              {formSubmitted && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ¡Propuesta registrada con éxito! Ya está abierta a votación.
                </div>
              )}
            </form>
          </div>

          {/* Existing Proposals by Colleagues */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rutas propuestas en evaluación ({proposedRoutes.length}):
            </h4>
            <div className="space-y-2">
              {proposedRoutes.map(pr => (
                <div
                  key={pr.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                      <span>{pr.origin}</span>
                      <span>➔</span>
                      <span>{pr.destination}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Horario: {pr.preferredDepartureTime} • Propuesto por: {pr.passengerName.split(' ')[0]}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-[#4A3184]">
                      {pr.status === 'approved' ? 'Aprobada para piloto' : 'En estudio de demanda'}
                    </span>
                  </div>

                  <button
                    onClick={() => voteRouteProposal(pr.id)}
                    className="flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-[#4A3184] border border-slate-200 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-[#AB2E81]" />
                    <span className="text-[11px] font-bold mt-0.5">{pr.votes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
