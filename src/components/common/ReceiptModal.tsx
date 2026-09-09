import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { TappiLogo } from './TappiLogo';
import {
  X,
  CheckCircle2,
  Share2,
  Download,
  Star,
  Bus,
  Clock,
  MapPin,
  Building,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReceiptModal: React.FC = () => {
  const {
    receiptModalOpen,
    activeReceiptTransaction,
    closeReceiptModal,
    openRatingModal,
    activeTrip,
  } = useTappi();

  if (!receiptModalOpen || !activeReceiptTransaction) return null;

  const fareAmount = Math.abs(activeReceiptTransaction.amount);

  const handleRateClick = () => {
    closeReceiptModal();
    if (activeTrip) {
      openRatingModal(activeTrip);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#4A3184] to-[#AB2E81] p-6 text-white text-center relative">
            <button
              onClick={closeReceiptModal}
              className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
              <CheckCircle2 className="w-9 h-9 text-emerald-300" />
            </div>

            <h3 className="text-xl font-black text-white">Comprobante Digital</h3>
            <p className="text-xs text-violet-100 font-medium mt-0.5">
              Tappi Pass • Transporte Corporativo
            </p>

            <div className="mt-4 bg-white/20 backdrop-blur-md py-2 px-4 rounded-2xl inline-block">
              <div className="text-xs text-violet-200">Monto Cobrado</div>
              <div className="text-3xl font-black text-white">
                S/ {fareAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Ticket Details Body (Serrated receipt style) */}
          <div className="p-6 bg-slate-50 space-y-4">
            {/* Meta tags */}
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">N° Comprobante:</span>
              <span className="font-mono font-bold text-slate-800">
                {activeReceiptTransaction.receiptNumber}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Método de Pago:</span>
              <span className="font-semibold text-[#4A3184] bg-violet-100/70 px-2 py-0.5 rounded-md">
                {activeReceiptTransaction.paymentMethod === 'corporate_subsidy'
                  ? 'Subsidio Empresa (100%)'
                  : 'Billetera Digital Tappi'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Fecha y Hora:</span>
              <span className="font-medium text-slate-800">
                {activeReceiptTransaction.date}
              </span>
            </div>

            {/* Trip Info Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Bus className="w-4 h-4 text-[#4A3184]" />
                <span>{activeTrip?.routeName || 'Ruta 101 - Expreso San Isidro'}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Placa: <strong>{activeTrip?.vehiclePlate || 'B8X-720'}</strong> • Conductor: {activeTrip?.driverName || 'Carlos Mendoza'}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-[#AB2E81]" />
                <span>Abordaje verificado con trazabilidad GPS activa</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleRateClick}
                className="w-full py-3 bg-[#4A3184] hover:bg-[#3b246f] text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 text-[#F3A81A] fill-[#F3A81A]" />
                Calificar Conductor y Viaje
              </button>

              <button
                onClick={closeReceiptModal}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-500" />
                Cerrar Comprobante
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
