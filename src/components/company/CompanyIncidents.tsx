import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  Filter,
  Car,
} from 'lucide-react';

export const CompanyIncidents: React.FC = () => {
  const { incidents, resolveIncident } = useTappi();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filtered = incidents.filter(i => {
    if (filter === 'open') return i.status !== 'resuelta';
    if (filter === 'resolved') return i.status === 'resuelta';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Bitácora de Incidencias Operativas</h2>
          <p className="text-xs text-slate-500">
            Registro de alertas, retrasos de tráfico, asistencia técnica y reportes de seguridad.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filter === 'all'
                ? 'bg-[#4A3184] text-white border-[#4A3184]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas ({incidents.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filter === 'open'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pendientes ({incidents.filter(i => i.status !== 'resuelta').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filter === 'resolved'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Resueltas ({incidents.filter(i => i.status === 'resuelta').length})
          </button>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-3">
        {filtered.map(inc => (
          <div
            key={inc.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    inc.severity === 'alta'
                      ? 'bg-rose-100 text-rose-700'
                      : inc.severity === 'media'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {inc.category} • {inc.severity}
                </span>

                <span className="text-[11px] text-slate-400">{inc.timestamp}</span>

                {inc.vehiclePlate && (
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Unidad: {inc.vehiclePlate}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
              <p className="text-xs text-slate-600 max-w-2xl">{inc.description}</p>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0">
              {inc.status === 'resuelta' ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> Resuelta
                </span>
              ) : (
                <button
                  onClick={() => resolveIncident(inc.id, 'Incidencia revisada y solucionada por el despachador central.')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
