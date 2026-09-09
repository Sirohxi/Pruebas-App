import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { TappiLogo } from './TappiLogo';
import {
  Users,
  Car,
  Building2,
  Smartphone,
  Maximize2,
  Bell,
  Sparkles,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    role,
    setRole,
    deviceViewMode,
    setDeviceViewMode,
    passengerProfile,
    driverProfile,
    company,
    vehicles,
    notifications,
    setNotifDrawerOpen,
  } = useTappi();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeBusesCount = vehicles.filter(v => v.status === 'active').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <TappiLogo size="sm" withText subtitle="Transporte Colectivo & Personal" />
        </div>

        {/* Central Role Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner">
          <button
            id="role-btn-passenger"
            onClick={() => setRole('passenger')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              role === 'passenger'
                ? 'bg-white text-[#4A3184] shadow-xs ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#AB2E81]" />
            <span>Pasajero</span>
          </button>

          <button
            id="role-btn-driver"
            onClick={() => setRole('driver')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              role === 'driver'
                ? 'bg-white text-[#4A3184] shadow-xs ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#F3A81A]" />
            <span>Conductor</span>
          </button>

          <button
            id="role-btn-company"
            onClick={() => setRole('company')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              role === 'company'
                ? 'bg-white text-[#4A3184] shadow-xs ring-1 ring-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#4A3184]" />
            <span>Empresa</span>
          </button>
        </div>

        {/* Right tools: View mode toggle & Notification bell & Quick info */}
        <div className="flex items-center gap-2">
          {/* Quick Context Metric */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-violet-50 text-[#4A3184] border border-violet-100 rounded-full text-xs font-medium">
            {role === 'passenger' && (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#AB2E81]" />
                <span>Saldo Total: <strong className="font-bold">S/ {(passengerProfile.walletBalance + passengerProfile.corporateSubsidy).toFixed(2)}</strong></span>
              </>
            )}
            {role === 'driver' && (
              <>
                <Car className="w-3.5 h-3.5 text-[#F3A81A]" />
                <span>Ingresos Hoy: <strong className="font-bold">S/ {driverProfile.todayEarnings.toFixed(2)}</strong></span>
              </>
            )}
            {role === 'company' && (
              <>
                <Building2 className="w-3.5 h-3.5 text-[#4A3184]" />
                <span>{company.name.split(' ')[0]} • <strong>{activeBusesCount} en ruta</strong></span>
              </>
            )}
          </div>

          {/* Device Frame View Toggle for Mobile Roles */}
          {role !== 'company' && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                id="view-mode-mobile"
                onClick={() => setDeviceViewMode('mobile')}
                title="Vista Celular / Mockup"
                className={`p-1.5 rounded-md transition-all ${
                  deviceViewMode === 'mobile'
                    ? 'bg-white text-[#4A3184] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                id="view-mode-responsive"
                onClick={() => setDeviceViewMode('responsive')}
                title="Vista Pantalla Completa"
                className={`p-1.5 rounded-md transition-all ${
                  deviceViewMode === 'responsive'
                    ? 'bg-white text-[#4A3184] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Notifications Button */}
          <button
            id="btn-notifications-drawer"
            onClick={() => setNotifDrawerOpen(true)}
            className="relative p-2 text-slate-600 hover:text-[#4A3184] hover:bg-slate-100 rounded-xl transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#AB2E81] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
