import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Users,
  Search,
  CheckCircle2,
  QrCode,
  MapPin,
  Clock,
  UserCheck,
  Building,
} from 'lucide-react';

export const DriverPassengers: React.FC = () => {
  const {
    activeTrip,
    verifyPassengerBoarding,
    openQrModal,
  } = useTappi();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'boarded' | 'pending'>('all');

  const passengers = activeTrip?.passengers || [];

  const filtered = passengers.filter(p => {
    const matchesSearch =
      p.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.boardingStop.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'boarded') return matchesSearch && p.status === 'boarded';
    if (filter === 'pending') return matchesSearch && p.status === 'registered';
    return matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Manifiesto de Pasajeros</h2>
          <p className="text-xs text-slate-500">
            {activeTrip ? activeTrip.routeName : 'Sin viaje activo'}
          </p>
        </div>
        <button
          onClick={() => openQrModal('driver_scan_passenger')}
          className="p-2.5 bg-[#4A3184] text-white rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-bold"
        >
          <QrCode className="w-4 h-4 text-[#F3A81A]" />
          <span className="hidden sm:inline">Escanear</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por colaborador o código EMP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-[#4A3184] shadow-xs' : 'text-slate-600'
            }`}
          >
            Todos ({passengers.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              filter === 'pending' ? 'bg-white text-[#4A3184] shadow-xs' : 'text-slate-600'
            }`}
          >
            Por Abordar ({passengers.filter(p => p.status === 'registered').length})
          </button>
          <button
            onClick={() => setFilter('boarded')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              filter === 'boarded' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Abordados ({passengers.filter(p => p.status === 'boarded').length})
          </button>
        </div>
      </div>

      {/* Passenger List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No se encontraron pasajeros con el filtro actual.
          </div>
        ) : (
          filtered.map(p => {
            const isBoarded = p.status === 'boarded';
            return (
              <div
                key={p.passengerId}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isBoarded
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.passengerName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.passengerName}</h4>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{p.employeeCode} • TechCorp</span>
                      </div>
                    </div>
                  </div>

                  {isBoarded ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> A bordo ({p.boardedAt})
                    </span>
                  ) : (
                    <button
                      onClick={() => verifyPassengerBoarding(p.passengerId)}
                      className="px-3 py-1.5 bg-[#4A3184] hover:bg-[#392469] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Abordar
                    </button>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#AB2E81]" />
                    <span>Subida: <strong>{p.boardingStop}</strong></span>
                  </div>
                  <span className="text-slate-400">➔ {p.destinationStop}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
