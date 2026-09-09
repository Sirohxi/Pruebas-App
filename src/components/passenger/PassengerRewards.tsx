import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { Sparkles, Gift, Leaf, Trophy, Check, ArrowRight } from 'lucide-react';

export const PassengerRewards: React.FC = () => {
  const { passengerProfile, rewards, claimReward } = useTappi();

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xl font-black text-slate-900">Recompensas Tappi</h2>
        <p className="text-xs text-slate-500">
          Viaja en transporte colectivo corporativo, ahorra emisiones y acumula puntos.
        </p>
      </div>

      {/* GAMIFICATION & CO2 IMPACT BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Puntos Acumulados
            </span>
            <div className="text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="w-7 h-7 text-[#F3A81A]" />
              {passengerProfile.points} pts
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Nivel Tappi
            </span>
            <div className="text-xs font-bold text-white bg-white/20 px-2.5 py-1 rounded-full mt-0.5">
              Oro Corporativo 🌟
            </div>
          </div>
        </div>

        {/* CO2 Savings Metric */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-200">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {passengerProfile.savedCarbonKg} kg de CO₂ evitados
            </div>
            <div className="text-[11px] text-emerald-100">
              Equivale a plantar 3 árboles nativos al preferir el colectivo corporativo.
            </div>
          </div>
        </div>
      </div>

      {/* REWARDS CATALOG */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[#AB2E81]" />
          Beneficios Canjeables
        </h3>

        <div className="space-y-3">
          {rewards.map(rew => (
            <div
              key={rew.id}
              className={`p-4 rounded-2xl border transition-all ${
                rew.claimed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-xs hover:border-violet-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-2xl flex items-center justify-center flex-shrink-0 border border-violet-100">
                  {rew.logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-[#4A3184]">
                      {rew.discount}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rew.partner}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{rew.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {rew.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A3184]">
                  {rew.pointsCost} Puntos
                </span>

                {rew.claimed ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Canjeado ({rew.code})
                  </span>
                ) : (
                  <button
                    onClick={() => claimReward(rew.id)}
                    className="text-xs font-bold px-3 py-1.5 bg-[#4A3184] hover:bg-[#3b256d] text-white rounded-xl shadow-xs transition-colors"
                  >
                    Canjear
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
