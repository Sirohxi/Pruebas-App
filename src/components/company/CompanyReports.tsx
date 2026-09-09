import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Leaf,
  Users,
  Clock,
  DollarSign,
  Check,
} from 'lucide-react';

export const CompanyReports: React.FC = () => {
  const { routes, vehicles } = useTappi();
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    // Generate simple simulated CSV export
    const rows = [
      ['Fecha', 'Ruta', 'Placa', 'Conductor', 'Pasajeros Abordados', 'Tarifa Unitaria', 'Recaudo Total', 'Puntualidad'],
      ['2026-09-08', 'Línea 1 - Sur Express', 'B8X-720', 'Carlos Mendoza', '18', 'S/ 6.50', 'S/ 117.00', '100%'],
      ['2026-09-08', 'Línea 2 - Norte Conector', 'AYZ-915', 'Luis Torres', '20', 'S/ 7.00', 'S/ 140.00', '96%'],
      ['2026-09-08', 'Línea 3 - Este Industrial', 'C3T-402', 'Roberto Huamán', '16', 'S/ 6.00', 'S/ 96.00', '98%'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tappi_reporte_movilidad_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Analítica y Reportes de Movilidad</h2>
          <p className="text-xs text-slate-500">
            Métricas de sustentabilidad, ocupación de flota y liquidación contable.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#4A3184] hover:bg-[#3b246f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          {downloaded ? '¡Reporte CSV Descargado!' : 'Exportar Reporte a CSV'}
        </button>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Ahorro de CO2 Corporativo */}
        <div className="p-5 bg-gradient-to-br from-emerald-700 to-teal-900 rounded-3xl text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Impacto Ambiental ESG
            </span>
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-black text-white">2,480 kg CO₂</div>
          <p className="text-xs text-emerald-100 leading-snug">
            Emisiones evitadas este mes reemplazando 180 vehículos individuales por vans colectivas optimizadas por Tappi.
          </p>
        </div>

        {/* Metric 2: Eficiencia de Ocupación */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Factor de Ocupación
            </span>
            <Users className="w-5 h-5 text-[#4A3184]" />
          </div>
          <div className="text-3xl font-black text-slate-900">86.4%</div>
          <p className="text-xs text-slate-500 leading-snug">
            Promedio de asientos ocupados por viaje en horas punta hacia el Campus Industrial.
          </p>
        </div>

        {/* Metric 3: Ahorro de Tiempo de Viaje */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tiempo Ahorrado
            </span>
            <Clock className="w-5 h-5 text-[#F3A81A]" />
          </div>
          <div className="text-3xl font-black text-slate-900">28 min/día</div>
          <p className="text-xs text-slate-500 leading-snug">
            Reducción en tiempo promedio de traslado de cada colaborador gracias a paradas directas y carriles exclusivos.
          </p>
        </div>
      </div>

      {/* Summary Table by Route */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Desglose Operativo Mensual por Corredor</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Línea de Movilidad</th>
                <th className="pb-3">Viajes Mensuales</th>
                <th className="pb-3">Pasajeros Únicos</th>
                <th className="pb-3">Subsidio TechCorp</th>
                <th className="pb-3 text-right">Puntualidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-bold text-slate-900">Línea 1: Sur Express (Javier Prado - Lurín)</td>
                <td className="py-3">184 viajes</td>
                <td className="py-3">142 colaboradores</td>
                <td className="py-3 font-bold text-emerald-600">S/ 1,196.00</td>
                <td className="py-3 text-right font-bold text-[#4A3184]">98.2%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-bold text-slate-900">Línea 2: Norte Conector (Panamericana Norte)</td>
                <td className="py-3">160 viajes</td>
                <td className="py-3">128 colaboradores</td>
                <td className="py-3 font-bold text-emerald-600">S/ 1,120.00</td>
                <td className="py-3 text-right font-bold text-[#4A3184]">96.5%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-bold text-slate-900">Línea 3: Este Industrial (Carretera Central)</td>
                <td className="py-3">140 viajes</td>
                <td className="py-3">94 colaboradores</td>
                <td className="py-3 font-bold text-emerald-600">S/ 840.00</td>
                <td className="py-3 text-right font-bold text-[#4A3184]">97.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
