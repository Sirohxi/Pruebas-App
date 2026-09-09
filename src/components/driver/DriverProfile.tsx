import React from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  User,
  Award,
  Star,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Car,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

export const DriverProfile: React.FC = () => {
  const { driverUser, driverProfile, vehicles } = useTappi();
  const assignedVehicle = vehicles[0];

  const trainings = [
    { title: 'Manejo Defensivo y Seguridad Vial 2026', date: 'Completado • Ene 2026', status: 'approved' },
    { title: 'Protocolo de Emergencia y Primeros Auxilios', date: 'Completado • Mar 2026', status: 'approved' },
    { title: 'Atención al Cliente y Ergonomía en Conducción', date: 'Completado • May 2026', status: 'approved' },
    { title: 'Uso de la Plataforma Tappi y Cobros QR', date: 'Completado • Jul 2026', status: 'approved' },
  ];

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-slate-900">Perfil del Conductor</h2>
        <p className="text-xs text-slate-500">
          Credenciales profesionales, reputación y capacitaciones corporativas.
        </p>
      </div>

      {/* Driver Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
        <div className="relative mb-3">
          <img
            src={driverUser.avatar}
            alt={driverUser.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-violet-100 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        <h3 className="text-base font-bold text-slate-900">{driverUser.name}</h3>
        <p className="text-xs text-slate-500">{driverUser.companyName}</p>

        {/* Rating Banner */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-full border border-amber-200 text-xs font-bold">
          <div className="flex items-center gap-0.5 text-[#F3A81A]">
            <Star className="w-4 h-4 fill-[#F3A81A]" />
            <span className="text-slate-950 font-black">{driverProfile.rating}</span>
          </div>
          <span>• {driverProfile.totalTrips} viajes realizados</span>
        </div>

        {/* License & Experience */}
        <div className="mt-4 w-full grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-left">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Licencia de Conducir</span>
            <span className="text-xs font-bold text-slate-900 font-mono">{driverProfile.licenseNumber}</span>
            <span className="text-[10px] text-slate-500 block">{driverProfile.licenseCategory}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Experiencia</span>
            <span className="text-xs font-bold text-slate-900">{driverProfile.experienceYears} años</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">97.4% Puntualidad</span>
          </div>
        </div>
      </div>

      {/* Assigned Vehicle Technical Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Car className="w-4 h-4 text-[#4A3184]" />
          Vehículo Asignado
        </h4>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-500">Modelo:</span>
          <span className="font-bold text-slate-900">{assignedVehicle.brand} {assignedVehicle.model} ({assignedVehicle.year})</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-500">Placa:</span>
          <span className="font-mono font-bold text-[#4A3184]">{assignedVehicle.plate}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-500">Revisión Técnica:</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Vigente hasta {assignedVehicle.technicalReviewExpiry}
          </span>
        </div>
      </div>

      {/* Capacitaciones y Certificaciones */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#AB2E81]" />
          Capacitaciones Obligatorias Aprobadas
        </h4>

        <div className="space-y-2">
          {trainings.map((t, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
