import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Users,
  Car,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Bus,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Filter,
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const {
    vehicles,
    routes,
    activeTrip,
    incidents,
    company,
    setCompanyTab,
    resolveIncident,
  } = useTappi();

  const [dateRange, setDateRange] = useState<'hoy' | 'semana' | 'mes'>('hoy');
  const [routeFilter, setRouteFilter] = useState('all');

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const openIncidents = incidents.filter(i => i.status !== 'resuelta');

  // Simulated metrics
  const totalPassengersToday = 348;
  const totalFaresToday = 2262.00;
  const onTimePercentage = 97.2;

  // Hourly demand curve (6am to 8pm)
  const hourlyDemand = [
    { hour: '06:00', trips: 18, peak: false },
    { hour: '07:00', trips: 54, peak: true },
    { hour: '08:00', trips: 62, peak: true },
    { hour: '09:00', trips: 28, peak: false },
    { hour: '12:00', trips: 22, peak: false },
    { hour: '17:00', trips: 48, peak: true },
    { hour: '18:00', trips: 68, peak: true },
    { hour: '19:00', trips: 36, peak: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Panel de Control Operativo
          </h2>
          <p className="text-xs text-slate-500">
            Monitoreo en tiempo real de flota, pasajeros corporativos y cumplimiento de rutas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setDateRange('hoy')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'hoy' ? 'bg-white text-[#4A3184] shadow-xs' : 'text-slate-600'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateRange('semana')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'semana' ? 'bg-white text-[#4A3184] shadow-xs' : 'text-slate-600'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setDateRange('mes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'mes' ? 'bg-white text-[#4A3184] shadow-xs' : 'text-slate-600'
              }`}
            >
              Mes
            </button>
          </div>

          <select
            value={routeFilter}
            onChange={e => setRouteFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
          >
            <option value="all">Todas las Rutas</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.code} - {r.name.split('-')[1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Pasajeros Transportados */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pasajeros Hoy
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalPassengersToday}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4% vs semana previa
            </span>
          </div>
          <div className="p-3 bg-violet-50 text-[#4A3184] rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Flota Activa en Ruta */}
        <div
          onClick={() => setCompanyTab('fleet')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between cursor-pointer hover:border-violet-300 transition-colors"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Vehículos en Ruta
            </span>
            <div className="text-2xl font-black text-[#4A3184] mt-1">
              {activeVehicles.length} / {vehicles.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              1 en taller • 1 en base
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-[#AB2E81] rounded-xl">
            <Bus className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Recaudo / Subsidios Liquidados */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recaudo del Día
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              S/ {totalFaresToday.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              100% cobro digital vía QR
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Puntualidad y Cumplimiento */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cumplimiento de Rutas
            </span>
            <div className="text-2xl font-black text-[#F3A81A] mt-1">
              {onTimePercentage}%
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Meta cumplida (&gt;95%)
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-[#F3A81A] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: DEMAND CHART & OPEN INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hourly Demand Histogram */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Demanda Horaria de Pasajeros (Horas Punta)
              </h3>
              <p className="text-xs text-slate-500">
                Distribución de abordajes en corredores corporativos el día de hoy.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#4A3184] bg-violet-50 px-2.5 py-1 rounded-lg">
              Pico: 08:00 AM & 06:00 PM
            </span>
          </div>

          {/* Clean CSS/SVG Bar Chart */}
          <div className="pt-4">
            <div className="flex items-end justify-between gap-2 h-44 border-b border-slate-200 pb-2">
              {hourlyDemand.map(item => {
                const heightPercent = (item.trips / 70) * 100;
                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.trips}
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        item.peak
                          ? 'bg-gradient-to-t from-[#4A3184] to-[#AB2E81] shadow-xs'
                          : 'bg-slate-200 group-hover:bg-violet-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-[#4A3184] to-[#AB2E81]"></span>
              <span>Hora Punta Corporativa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200"></span>
              <span>Tránsito Regular</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operational Incidents & Safety Center */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#AB2E81]" />
              <h3 className="text-sm font-bold text-slate-900">Centro de Incidencias</h3>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {openIncidents.length} pendientes
            </span>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map(inc => (
              <div
                key={inc.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
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
                  <span className="text-[10px] text-slate-400">{inc.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{inc.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug">{inc.description}</p>

                {inc.status !== 'resuelta' ? (
                  <button
                    onClick={() => resolveIncident(inc.id, 'Atendido por el coordinador de flota.')}
                    className="mt-1 text-[11px] font-bold text-[#4A3184] hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Marcar como resuelta
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resuelta
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setCompanyTab('incidents')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
          >
            Ver Todas las Incidencias
          </button>
        </div>
      </div>

      {/* ACTIVE FLEET LIVE MONITOR TABLE PREVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Estado de la Flota en Tiempo Real
            </h3>
            <p className="text-xs text-slate-500">
              Unidades en servicio activo con telemetría GPS y estado de pasaje.
            </p>
          </div>
          <button
            onClick={() => setCompanyTab('fleet')}
            className="text-xs font-bold text-[#4A3184] hover:underline flex items-center gap-1"
          >
            Abrir Mapa de Flota ➔
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Placa / Modelo</th>
                <th className="pb-3">Conductor</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Aforo Actual</th>
                <th className="pb-3">SOAT</th>
                <th className="pb-3 text-right">Código QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-medium">
                    <div className="font-bold text-slate-900 font-mono">{v.plate}</div>
                    <div className="text-[11px] text-slate-500">{v.brand} {v.model}</div>
                  </td>
                  <td className="py-3 font-medium">{v.driverName}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : v.status === 'idle'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      ></span>
                      {v.status === 'active' ? 'En Ruta' : v.status === 'idle' ? 'Disponible' : 'Mantenimiento'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900">{v.occupiedSeats}</span> / {v.capacity}
                  </td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{v.soatExpiry}</td>
                  <td className="py-3 text-right font-mono text-[10px] text-violet-600 font-bold">
                    {v.qrCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
