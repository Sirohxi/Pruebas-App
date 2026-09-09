import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  X,
  Camera,
  Zap,
  CheckCircle2,
  AlertCircle,
  Bus,
  UserCheck,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QrScannerModal: React.FC = () => {
  const {
    qrModalOpen,
    qrModalMode,
    closeQrModal,
    processQrScan,
    vehicles,
    activeTrip,
    passengerUser,
    passengerProfile,
  } = useTappi();

  const [flashlight, setFlashlight] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: boolean; text: string } | null>(null);
  const [customInput, setCustomInput] = useState('');

  if (!qrModalOpen) return null;

  const handleSimulatedScan = (code: string) => {
    const res = processQrScan(code);
    setFeedback({
      success: res.success,
      text: res.message,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4A3184] flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {qrModalMode === 'passenger_scan_vehicle'
                    ? 'Escanear QR de Vehículo'
                    : qrModalMode === 'driver_scan_passenger'
                    ? 'Verificar Abordaje de Pasajero'
                    : 'Mi Tappi Pass Corporativo'}
                </h3>
                <p className="text-xs text-slate-400">
                  {qrModalMode === 'passenger_scan_vehicle'
                    ? 'Apunta al código QR pegado en la puerta o cabina'
                    : qrModalMode === 'driver_scan_passenger'
                    ? 'Escanea la credencial digital del colaborador'
                    : 'Muestra este código al subir al vehículo'}
                </p>
              </div>
            </div>
            <button
              onClick={closeQrModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 flex flex-col items-center">
            {qrModalMode === 'passenger_show_badge' ? (
              /* Passenger Virtual QR Badge */
              <div className="w-full flex flex-col items-center text-center py-2">
                <div className="p-4 bg-white rounded-2xl border-2 border-[#4A3184] shadow-md mb-3 flex flex-col items-center">
                  <div className="w-48 h-48 bg-slate-950 p-3 rounded-xl flex items-center justify-center relative">
                    {/* Stylized QR Code Graphic */}
                    <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-[#4A3184] p-1 flex items-center justify-center">
                          <div className="w-4 h-4 bg-[#4A3184]"></div>
                        </div>
                        <div className="w-10 h-10 border-4 border-[#4A3184] p-1 flex items-center justify-center">
                          <div className="w-4 h-4 bg-[#4A3184]"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center my-auto">
                        <div className="w-10 h-10 rounded-full bg-[#AB2E81] flex items-center justify-center text-white text-xs font-black">
                          TP
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-[#4A3184] p-1 flex items-center justify-center">
                          <div className="w-4 h-4 bg-[#4A3184]"></div>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-[#F3A81A]"></div>
                          <div className="w-3 h-3 bg-[#4A3184]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 mt-2">
                    {passengerProfile.employeeCode}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{passengerUser.name}</h4>
                <p className="text-xs text-slate-500">{passengerProfile.department} • TechCorp</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subsidio activo (S/ {passengerProfile.corporateSubsidy.toFixed(2)})
                </div>
              </div>
            ) : (
              /* Camera / Viewfinder Box */
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                  {/* Viewfinder corners */}
                  <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-violet-400/40 rounded-xl flex items-center justify-center">
                    {/* Animated Scanning Laser */}
                    <motion.div
                      animate={{ y: [-70, 70, -70] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#AB2E81] to-transparent shadow-[0_0_12px_#AB2E81]"
                    />
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-7 left-7 w-6 h-6 border-t-4 border-l-4 border-[#F3A81A] rounded-tl-md pointer-events-none"></div>
                  <div className="absolute top-7 right-7 w-6 h-6 border-t-4 border-r-4 border-[#F3A81A] rounded-tr-md pointer-events-none"></div>
                  <div className="absolute bottom-7 left-7 w-6 h-6 border-b-4 border-l-4 border-[#F3A81A] rounded-bl-md pointer-events-none"></div>
                  <div className="absolute bottom-7 right-7 w-6 h-6 border-b-4 border-r-4 border-[#F3A81A] rounded-br-md pointer-events-none"></div>

                  {/* Center hint icon */}
                  <div className="flex flex-col items-center text-slate-500 opacity-60">
                    <Camera className="w-10 h-10 mb-1" />
                    <span className="text-xs">Buscando código QR…</span>
                  </div>

                  {/* Flashlight toggle */}
                  <button
                    onClick={() => setFlashlight(!flashlight)}
                    className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all ${
                      flashlight ? 'bg-[#F3A81A] text-slate-950' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title="Linterna"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>

                {/* Feedback message banner if any */}
                {feedback && (
                  <div
                    className={`w-full mt-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      feedback.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {feedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                  </div>
                )}

                {/* Quick Simulation Buttons (One-touch testing) */}
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#AB2E81]" />
                      Acceso rápido de prueba (Simulador):
                    </span>
                  </div>

                  {qrModalMode === 'passenger_scan_vehicle' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSimulatedScan('TAPPI-VEH-B8X720-CORP')}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-violet-200 bg-violet-50/70 hover:bg-violet-100/80 text-left transition-colors"
                      >
                        <Bus className="w-5 h-5 text-[#4A3184] flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Sprinter VIP (B8X-720)</div>
                          <div className="text-[11px] text-slate-600">Carlos Mendoza • S/ 6.50</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSimulatedScan('TAPPI-VEH-AYZ915-CORP')}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-pink-200 bg-pink-50/70 hover:bg-pink-100/80 text-left transition-colors"
                      >
                        <Bus className="w-5 h-5 text-[#AB2E81] flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Volvo Eléctrico (AYZ-915)</div>
                          <div className="text-[11px] text-slate-600">Rosa Morales • S/ 5.50</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSimulatedScan('EMP-7482-CAMILA')}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-left transition-colors"
                      >
                        <UserCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Camila Morales (EMP-7482)</div>
                          <div className="text-[11px] text-slate-600">TechCorp • Subsidio OK</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSimulatedScan('EMP-3109-ANDRES')}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                      >
                        <UserCheck className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Andrés Valdivia (EMP-3109)</div>
                          <div className="text-[11px] text-slate-600">TechCorp • Validar</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Manual Code Input */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="O ingresa código manual (ej. B8X-720)..."
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
                    />
                    <button
                      onClick={() => {
                        if (customInput) {
                          handleSimulatedScan(customInput);
                          setCustomInput('');
                        }
                      }}
                      className="px-3 py-2 bg-[#4A3184] text-white text-xs font-semibold rounded-xl hover:bg-[#3b246f] transition-colors"
                    >
                      Validar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
