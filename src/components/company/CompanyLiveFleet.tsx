import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import { InteractiveMap } from '../common/InteractiveMap';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  Radio,
  Fuel,
  Shield,
  Search,
  Filter,
  Users,
} from 'lucide-react';

export const CompanyLiveFleet: React.FC = () => {
  const { vehicles, routes, activeTrip } = useTappi();
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0].id);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle'>('all');

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const activeRoute = routes[0];

  const filteredVehicles = vehicles.filter(v => {
    if (filterStatus === 'all') return true;
    return v.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Monitoreo Satelital de Flota</h2>
          <p className="text-xs text-slate-500">
            Seguimiento GPS de buses y vanes en los corredores de transporte de personal.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterStatus === 'all'
                ? 'bg-[#4A3184] text-white border-[#4A3184]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas ({vehicles.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterStatus === 'active'
                ? 'bg-[#4A3184] text-white border-[#4A3184]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            En Ruta ({vehicles.filter(v => v.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('idle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterStatus === 'idle'
                ? 'bg-[#4A3184] text-white border-[#4A3184]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            En Base ({vehicles.filter(v => v.status === 'idle').length})
          </button>
        </div>
      </div>

      {/* Grid with Interactive Map and Vehicle Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <InteractiveMap
              currentRoute={activeRoute}
              activeTrip={activeTrip}
              userLocationName="Centro de Operaciones Tappi"
              height="h-96"
            />
          </div>

          {/* Selected Vehicle Telemetry Ribbon */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-[#4A3184] flex items-center justify-center font-bold flex-shrink-0">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-slate-900">
                    {selectedVehicle.plate}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-[#4A3184]">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    GPS Online (Último ping: hace 4s)
                  </span>
                  <span>•</span>
                  <span>Conductor: <strong>{selectedVehicle.driverName}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right pr-2">
                <div className="text-xs font-bold text-slate-900">
                  {selectedVehicle.occupiedSeats} / {selectedVehicle.capacity}
                </div>
                <span className="text-[10px] text-slate-400">Asientos ocupados</span>
              </div>
              <a
                href={`tel:+51987654321`}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Llamar a Unidad
              </a>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Vehicle Selection List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Unidades Registradas
          </h3>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredVehicles.map(veh => {
              const isSelected = veh.id === selectedVehicleId;
              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicleId(veh.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-50/70 border-[#4A3184] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {veh.plate}
                      </span>
                      <h4 className="text-xs font-medium text-slate-700 mt-0.5">
                        {veh.brand} {veh.model}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        veh.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.status === 'idle'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {veh.status === 'active' ? 'En Ruta' : veh.status === 'idle' ? 'En Base' : 'Taller'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {veh.occupiedSeats}/{veh.capacity} asientos
                    </span>
                    <span>Conductor: {veh.driverName.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
