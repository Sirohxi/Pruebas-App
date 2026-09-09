import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Route as RouteIcon,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  ThumbsUp,
  CheckCircle2,
  XCircle,
  Bus,
} from 'lucide-react';

export const CompanyRoutes: React.FC = () => {
  const { routes, proposedRoutes, addRoute } = useTappi();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'official' | 'proposals'>('official');

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [fare, setFare] = useState('6.50');
  const [hours, setHours] = useState('06:00 - 21:30');
  const [freq, setFreq] = useState('15');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    addRoute({
      name,
      code,
      fare: parseFloat(fare) || 6.5,
      operatingHours: hours,
      frequencyMinutes: parseInt(freq) || 15,
      stops: [
        { id: `stop-${Date.now()}-1`, name: 'Paradero Inicial', lat: -12.0864, lng: -77.0315, address: 'Av. Javier Prado', etaMinutes: 0 },
        { id: `stop-${Date.now()}-2`, name: 'Paradero Intermedio', lat: -12.1245, lng: -77.0142, address: 'Av. Primavera', etaMinutes: 12 },
        { id: `stop-${Date.now()}-3`, name: 'Sede Central TechCorp', lat: -12.1978, lng: -76.9745, address: 'Campus Industrial', etaMinutes: 30 },
      ],
    });
    setName('');
    setCode('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gestión de Rutas y Corredores</h2>
          <p className="text-xs text-slate-500">
            Administración de paraderos, frecuencias y solicitudes ciudadanas de colaboradores.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#4A3184] hover:bg-[#3b246f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nueva Ruta
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit text-xs font-bold border border-slate-200">
        <button
          onClick={() => setActiveTab('official')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'official'
              ? 'bg-white text-[#4A3184] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rutas Oficiales ({routes.length})
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'proposals'
              ? 'bg-white text-[#4A3184] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Propuestas de Colaboradores ({proposedRoutes.length})
        </button>
      </div>

      {/* TAB 1: OFFICIAL ROUTES */}
      {activeTab === 'official' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map(r => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-violet-100 text-[#4A3184]">
                      {r.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {r.operatingHours}
                    </span>
                    <span>• Cada {r.frequencyMinutes} min</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#4A3184]">
                    S/ {r.fare.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Tarifa plana</span>
                </div>
              </div>

              {/* Stops list preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Paraderos asignados ({r.stops.length}):
                </span>
                <div className="space-y-1.5">
                  {r.stops.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-violet-200 text-[#4A3184] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-semibold truncate">{s.name}</span>
                      <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">
                        +{s.etaMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PROPOSED ROUTES */}
      {activeTab === 'proposals' && (
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Analítica de Demanda Espontánea:</strong> Los colaboradores pueden sugerir nuevos corredores cuando sus paraderos habituales quedan lejos de su residencia. Las rutas con mayor votación pueden convertirse en líneas piloto.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposedRoutes.map(pr => (
              <div
                key={pr.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{pr.origin}</span>
                      <span className="text-[#AB2E81]">➔</span>
                      <span>{pr.destination}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Horario preferido: <strong>{pr.preferredDepartureTime}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sugerido por {pr.passengerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-violet-50 text-[#4A3184] px-2.5 py-1 rounded-xl text-xs font-bold">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#AB2E81]" />
                    <span>{pr.votes} votos</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Estado: En Evaluación
                  </span>

                  <button
                    onClick={() => {
                      addRoute({
                        name: `Línea Piloto: ${pr.origin} - ${pr.destination}`,
                        code: `PL-${Math.floor(Math.random() * 90 + 10)}`,
                        fare: 6.50,
                        operatingHours: '06:30 - 20:00',
                        frequencyMinutes: 20,
                        stops: [
                          { id: `st-p1`, name: pr.origin, lat: -12.1, lng: -77.02, address: pr.origin, etaMinutes: 0 },
                          { id: `st-p2`, name: pr.destination, lat: -12.18, lng: -76.98, address: pr.destination, etaMinutes: 35 },
                        ],
                      });
                      alert('¡Propuesta convertida exitosamente en Ruta Oficial Piloto!');
                    }}
                    className="text-xs font-bold text-white bg-[#4A3184] hover:bg-[#3b246f] px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Aprobar como Piloto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE ROUTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Crear Nueva Ruta Corporativa</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="CORR-04"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Línea 4: San Juan - Lurín"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tarifa (S/)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={fare}
                    onChange={e => setFare(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frecuencia (min)</label>
                  <input
                    type="number"
                    value={freq}
                    onChange={e => setFreq(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horario Operativo</label>
                <input
                  type="text"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A3184] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Guardar Ruta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
