import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  User,
  Shield,
  Phone,
  Mail,
  Building,
  QrCode,
  AlertOctagon,
  ChevronRight,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export const PassengerProfile: React.FC = () => {
  const {
    passengerUser,
    passengerProfile,
    openQrModal,
    reportIncident,
  } = useTappi();

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incCategory, setIncCategory] = useState<'retraso' | 'seguridad' | 'mecanico' | 'comportamiento' | 'otro'>('otro');
  const [reportedSuccess, setReportedSuccess] = useState(false);

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;
    reportIncident({
      title: incTitle,
      description: incDesc,
      category: incCategory,
      severity: 'media',
    });
    setIncTitle('');
    setIncDesc('');
    setReportedSuccess(true);
    setTimeout(() => {
      setReportedSuccess(false);
      setShowIncidentModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-slate-900">Perfil de Pasajero</h2>
        <p className="text-xs text-slate-500">
          Credencial digital de movilidad corporativa y ajustes de seguridad.
        </p>
      </div>

      {/* Profile ID Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
        <div className="relative mb-3">
          <img
            src={passengerUser.avatar}
            alt={passengerUser.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-violet-100 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        <h3 className="text-base font-bold text-slate-900">{passengerUser.name}</h3>
        <p className="text-xs text-slate-500">{passengerProfile.department}</p>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-[#4A3184] rounded-full border border-violet-200 text-xs font-bold font-mono">
          <Building className="w-3.5 h-3.5 text-[#AB2E81]" />
          {passengerUser.companyName} • {passengerProfile.employeeCode}
        </div>

        <div className="mt-4 w-full grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-left">
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Paradero Origen</span>
            <span className="text-xs font-semibold text-slate-800">{passengerProfile.homeStop}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Paradero Destino</span>
            <span className="text-xs font-semibold text-slate-800">{passengerProfile.workStop}</span>
          </div>
        </div>

        <button
          onClick={() => openQrModal('passenger_show_badge')}
          className="mt-4 w-full py-2.5 bg-[#4A3184] hover:bg-[#39246a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4 text-[#F3A81A]" />
          Mostrar Mi Credencial QR Tappi
        </button>
      </div>

      {/* Account Details & Contact */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Datos de Contacto
        </h4>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-500 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo
          </span>
          <span className="font-semibold text-slate-800">{passengerUser.email}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-500 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Teléfono
          </span>
          <span className="font-semibold text-slate-800">{passengerUser.phone}</span>
        </div>
      </div>

      {/* Security & Incident reporting */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Seguridad y Soporte
        </h4>

        <button
          onClick={() => setShowIncidentModal(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-rose-700 text-xs font-bold flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            <span>Reportar Incidencia u Objeto Perdido</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 flex items-center gap-2 text-xs text-[#4A3184]">
          <Shield className="w-4 h-4 flex-shrink-0 text-[#AB2E81]" />
          <span>Línea directa de monitoreo corporativo activa: <strong>(01) 619-4500</strong></span>
        </div>
      </div>

      {/* Incident Modal Popup */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Reportar Incidencia</h3>
            <p className="text-xs text-slate-500">
              Informa retrasos, objetos extraviados o inconvenientes con la unidad.
            </p>

            <form onSubmit={handleIncidentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  value={incCategory}
                  onChange={e => setIncCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="retraso">Retraso o Congestión</option>
                  <option value="seguridad">Seguridad en Ruta</option>
                  <option value="mecanico">Problema con el Vehículo</option>
                  <option value="comportamiento">Conductor / Pasajeros</option>
                  <option value="otro">Objeto Perdido / Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mochila olvidada en el bus"
                  value={incTitle}
                  onChange={e => setIncTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe brevemente lo ocurrido..."
                  value={incDesc}
                  onChange={e => setIncDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              {reportedSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Incidencia enviada al centro de control.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A3184] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
