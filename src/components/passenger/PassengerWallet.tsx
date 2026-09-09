import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import {
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  QrCode,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';

export const PassengerWallet: React.FC = () => {
  const {
    passengerProfile,
    transactions,
    rechargeWallet,
    openReceiptModal,
    openQrModal,
  } = useTappi();

  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState(20);
  const [method, setMethod] = useState<'yape' | 'plin' | 'visa'>('yape');
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'recharge'>('all');

  const totalBalance = passengerProfile.walletBalance + passengerProfile.corporateSubsidy;

  const handleRecharge = () => {
    rechargeWallet(amount, method);
    setShowRecharge(false);
  };

  const filteredTxs = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Billetera Tappi</h2>
        <p className="text-xs text-slate-500">
          Tus fondos personales y subsidios corporativos para movilidad diaria.
        </p>
      </div>

      {/* BALANCE CARD (Virtual Corporate Card Design) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4A3184] via-[#5B3184] to-[#AB2E81] rounded-3xl p-6 text-white shadow-xl">
        {/* Background decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F3A81A]/20 rounded-full blur-lg pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-200">
              Tappi Pass Corporativo
            </span>
            <div className="text-3xl font-black text-white mt-1">
              S/ {totalBalance.toFixed(2)}
            </div>
            <span className="text-xs text-violet-200">Saldo Total Disponible</span>
          </div>

          <button
            onClick={() => openQrModal('passenger_show_badge')}
            className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition-all shadow-sm"
            title="Ver código QR de pasajero"
          >
            <QrCode className="w-5 h-5 text-[#F3A81A]" />
          </button>
        </div>

        {/* Breakdown between Subsidy and Personal Wallet */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] text-violet-200 font-semibold">
              <Building className="w-3 h-3 text-[#F3A81A]" />
              <span>Subsidio TechCorp</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              S/ {passengerProfile.corporateSubsidy.toFixed(2)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] text-violet-200 font-semibold">
              <CreditCard className="w-3 h-3 text-emerald-300" />
              <span>Saldo Personal</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              S/ {passengerProfile.walletBalance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Quick Action: Recargar */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowRecharge(!showRecharge)}
            className="w-full py-2.5 bg-[#F3A81A] hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Recargar Saldo
          </button>
        </div>
      </div>

      {/* RECHARGE PANEL (COLLAPSIBLE) */}
      {showRecharge && (
        <div className="p-4 bg-white rounded-2xl border border-violet-200 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900">
            Selecciona el monto a recargar:
          </h3>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 50, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  amount === val
                    ? 'bg-[#4A3184] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                S/ {val}
              </button>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Medio de Pago Digital:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('yape')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  method === 'yape'
                    ? 'border-[#7B2E81] bg-purple-50 text-[#7B2E81] ring-2 ring-[#7B2E81]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black">💜 Yape</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('plin')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  method === 'plin'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-800 ring-2 ring-cyan-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black">💙 Plin</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('visa')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  method === 'visa'
                    ? 'border-[#4A3184] bg-violet-50 text-[#4A3184] ring-2 ring-[#4A3184]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black">💳 Tarjeta</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleRecharge}
            className="w-full py-3 bg-[#4A3184] hover:bg-[#3b246f] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Confirmar Recarga de S/ {amount.toFixed(2)}
          </button>
        </div>
      )}

      {/* TRANSACTIONS & EXPENSES LIST */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Historial de Gastos y Movimientos</h3>
          <div className="flex gap-1 text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded-md font-semibold ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('payment')}
              className={`px-2 py-1 rounded-md font-semibold ${
                filterType === 'payment' ? 'bg-slate-900 text-white' : 'text-slate-500'
              }`}
            >
              Viajes
            </button>
            <button
              onClick={() => setFilterType('recharge')}
              className={`px-2 py-1 rounded-md font-semibold ${
                filterType === 'recharge' ? 'bg-slate-900 text-white' : 'text-slate-500'
              }`}
            >
              Recargas
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTxs.map(tx => {
            const isNegative = tx.amount < 0;
            return (
              <div
                key={tx.id}
                onClick={() => openReceiptModal(tx)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-violet-200 transition-colors shadow-xs flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isNegative
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isNegative ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.description}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {tx.receiptNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-black ${
                      isNegative ? 'text-slate-900' : 'text-emerald-600'
                    }`}
                  >
                    {isNegative ? '-' : '+'}S/ {Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 justify-end">
                    <Receipt className="w-3 h-3" /> Ver ticket
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
