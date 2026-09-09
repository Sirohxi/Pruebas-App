import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Users,
  UserCheck,
  Star,
  Building,
  Mail,
  Phone,
  Shield,
  Search,
  Plus,
} from 'lucide-react';

export const CompanyPersonnel: React.FC = () => {
  const { driverUser, driverProfile, passengerUser, passengerProfile } = useTappi();
  const [tab, setTab] = useState<'drivers' | 'passengers'>('drivers');
  const [searchTerm, setSearchTerm] = useState('');

  // Extended mock lists
  const driversList = [
    {
      id: 'd-1',
      name: driverUser.name,
      avatar: driverUser.avatar,
      license: driverProfile.licenseNumber,
      category: driverProfile.licenseCategory,
      rating: driverProfile.rating,
      trips: driverProfile.totalTrips,
      status: 'Activo',
      phone: driverUser.phone,
    },
    {
      id: 'd-2',
      name: 'Luis Torres Valdivia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      license: 'Q-49821730',
      category: 'A-IIIa',
      rating: 4.88,
      trips: 890,
      status: 'Activo',
      phone: '+51 971 234 567',
    },
    {
      id: 'd-3',
      name: 'Roberto Huamán Castro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      license: 'Q-41289301',
      category: 'A-IIb',
      rating: 4.95,
      trips: 1540,
      status: 'Descanso',
      phone: '+51 965 890 123',
    },
  ];

  const passengersList = [
    {
      id: 'p-1',
      name: passengerUser.name,
      avatar: passengerUser.avatar,
      department: passengerProfile.department,
      code: passengerProfile.employeeCode,
      homeStop: passengerProfile.homeStop,
      workStop: passengerProfile.workStop,
      subsidy: passengerProfile.corporateSubsidy,
      tripsDone: 142,
    },
    {
      id: 'p-2',
      name: 'Lucía Fernández Ramos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Operaciones y Planta',
      code: 'EMP-9021',
      homeStop: 'Óvalo Higuereta',
      workStop: 'Campus Industrial Puerta 1',
      subsidy: 150.00,
      tripsDone: 188,
    },
    {
      id: 'p-3',
      name: 'Diego Morales Silva',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      department: 'Tecnología & QA',
      code: 'EMP-7814',
      homeStop: 'Estación Angamos',
      workStop: 'Campus Industrial Puerta 2',
      subsidy: 150.00,
      tripsDone: 96,
    },
    {
      id: 'p-4',
      name: 'Camila Rojas Ortiz',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      department: 'Finanzas y Contabilidad',
      code: 'EMP-6532',
      homeStop: 'Atocongo Intermodal',
      workStop: 'Campus Industrial Puerta 1',
      subsidy: 150.00,
      tripsDone: 110,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Personal y Colaboradores</h2>
          <p className="text-xs text-slate-500">
            Padrón de conductores profesionales y colaboradores con transporte corporativo.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setTab('drivers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'drivers'
                  ? 'bg-white text-[#4A3184] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conductores ({driversList.length})
            </button>
            <button
              onClick={() => setTab('passengers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab === 'passengers'
                  ? 'bg-white text-[#4A3184] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pasajeros / Colaboradores ({passengersList.length})
            </button>
          </div>
        </div>
      </div>

      {/* DRIVERS TAB */}
      {tab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {driversList.map(drv => (
            <div
              key={drv.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={drv.avatar}
                  alt={drv.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-violet-100 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{drv.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono text-[11px] font-bold text-slate-700">
                      {drv.license}
                    </span>
                    <span>({drv.category})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Calificación</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#F3A81A] text-[#F3A81A]" />
                    {drv.rating}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Viajes Realizados</span>
                  <span className="font-bold text-slate-900">{drv.trips} viajes</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  ● {drv.status}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{drv.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PASSENGERS TAB */}
      {tab === 'passengers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passengersList.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.department} • <strong className="font-mono">{p.code}</strong>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Subsidio 100%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Paradero Subida</span>
                  <span className="font-semibold text-slate-800 truncate block">{p.homeStop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Paradero Bajada</span>
                  <span className="font-semibold text-slate-800 truncate block">{p.workStop}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Viajes este mes: <strong>{p.tripsDone}</strong></span>
                <span className="font-mono font-bold text-[#4A3184]">Pase Digital QR Activo</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
