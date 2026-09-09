import React from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const DriverEarnings: React.FC = () => {
  const { driverProfile, tripHistory } = useTappi();

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-slate-900">Tus Ingresos</h2>
        <p className="text-xs text-slate-500">
          Resumen de recaudo por servicios, bonos de puntualidad y liquidaciones.
        </p>
      </div>

      {/* TODAY'S REVENUE HERO CARD */}
      <div className="p-6 bg-gradient-to-br from-[#4A3184] via-[#5B3184] to-[#AB2E81] rounded-3xl text-white shadow-xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-200">
          Recaudo Consolidado de Hoy
        </span>
        <div className="text-3xl sm:text-4xl font-black text-white mt-1">
          S/ {driverProfile.todayEarnings.toFixed(2)}
        </div>
        <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1 font-semibold">
          <TrendingUp className="w-4 h-4" /> +15% superior al promedio diario programado
        </p>

        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/20">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <span className="text-[10px] text-violet-200 block font-semibold">Acumulado Mes</span>
            <span className="text-base font-bold text-white">S/ {driverProfile.totalEarnings.toFixed(2)}</span>
          </div>
          <div className="p-2.5 bg-white/10 rounded-xl">
            <span className="text-[10px] text-violet-200 block font-semibold">Bono Puntualidad</span>
            <span className="text-base font-bold text-[#F3A81A]">+S/ 120.00</span>
          </div>
        </div>
      </div>

      {/* INCENTIVES & BONUSES */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <Award className="w-4 h-4 text-[#F3A81A]" />
          <span>Incentivo por Cumplimiento de Rutas (97.4%)</span>
        </div>
        <p className="text-xs text-amber-800 leading-snug">
          ¡Excelente desempeño! Mantén tu índice de puntualidad sobre el 95% para desbloquear el bono mensual de <strong>S/ 300.00</strong> otorgado por la empresa.
        </p>
      </div>

      {/* RECENT SERVICES REVENUE BREAKDOWN */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Detalle por Viaje Realizado
        </h3>

        <div className="space-y-2">
          {tripHistory.map((trip, idx) => (
            <div
              key={trip.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{trip.routeName}</h4>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{trip.startTime}</span>
                  <span>• Placa {trip.vehiclePlate}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-emerald-600">
                  +S/ {(trip.fare * (idx === 0 ? 12 : 14)).toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">Liquidado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
