import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Car,
  Plus,
  ShieldCheck,
  Fuel,
  QrCode,
  AlertCircle,
  Wrench,
  Search,
} from 'lucide-react';

export const CompanyVehicles: React.FC = () => {
  const { vehicles, addVehicle, openQrModal } = useTappi();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('Mercedes-Benz');
  const [capacity, setCapacity] = useState('20');
  const [driverName, setDriverName] = useState('Carlos Mendoza');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !model) return;
    addVehicle({
      plate: plate.toUpperCase(),
      model,
      brand,
      year: 2024,
      capacity: parseInt(capacity) || 20,
      occupiedSeats: 0,
      status: 'idle',
      driverId: 'driver-1',
      driverName,
      routeId: 'route-1',
      soatExpiry: '2027-02-15',
      technicalReviewExpiry: '2026-11-30',
      qrCode: `TAPPI-BUS-${plate.toUpperCase()}`,
      fuelType: 'GNV',
      lat: -12.115,
      lng: -77.025,
    });
    setPlate('');
    setModel('');
    setShowAddModal(false);
  };

  const filtered = vehicles.filter(
    v =>
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gestión de Flota y Vehículos</h2>
          <p className="text-xs text-slate-500">
            Control técnico, SOAT, revisiones y códigos QR oficiales de las unidades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#4A3184] hover:bg-[#3b246f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Registrar Unidad
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Buscar por placa, conductor o modelo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
        />
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(veh => (
          <div
            key={veh.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-base font-black text-slate-900">
                  {veh.plate}
                </span>
                <h3 className="text-xs font-medium text-slate-600 mt-0.5">
                  {veh.brand} {veh.model} ({veh.year})
                </h3>
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
                {veh.status === 'active' ? 'En Servicio' : veh.status === 'idle' ? 'Disponible' : 'En Taller'}
              </span>
            </div>

            {/* Spec breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Capacidad</span>
                <span className="font-bold text-slate-900">{veh.capacity} asientos</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Combustible</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Fuel className="w-3 h-3" /> {veh.fuelType}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block">SOAT Vigencia</span>
                <span className="font-mono text-[11px] text-slate-700">{veh.soatExpiry}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Rev. Técnica</span>
                <span className="font-mono text-[11px] text-slate-700">{veh.technicalReviewExpiry}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 truncate max-w-[150px]">
                Conductor: <strong>{veh.driverName.split(' ')[0]}</strong>
              </span>

              <button
                onClick={() => openQrModal('passenger_scan_vehicle')}
                className="text-xs font-bold text-[#4A3184] hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                Ver QR Unidad
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Registrar Vehículo en Flota</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Placa</label>
                  <input
                    type="text"
                    required
                    placeholder="B8X-720"
                    value={plate}
                    onChange={e => setPlate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacidad (Asientos)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Sprinter 516"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conductor Titular</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
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
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
