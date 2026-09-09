import React from 'react';
import { TappiProvider, useTappi } from './services/tappiStore';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { PassengerApp } from './components/passenger/PassengerApp';
import { DriverApp } from './components/driver/DriverApp';
import { CompanyPortal } from './components/company/CompanyPortal';
import { QrScannerModal } from './components/common/QrScannerModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { RatingModal } from './components/common/RatingModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Smartphone, Monitor } from 'lucide-react';

const TappiAppContent: React.FC = () => {
  const { role, deviceViewMode, setDeviceViewMode } = useTappi();

  // In company role, full screen is natural; in passenger/driver, mobile frame is default but toggleable
  const isMobileRole = role === 'passenger' || role === 'driver';
  const showMobileFrame = isMobileRole && deviceViewMode === 'mobile';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-purple-200">
      {/* Top Universal App Header & Role Switcher */}
      <RoleSwitcher />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col items-center">
        {/* If passenger or driver, show device frame view toggle */}
        {isMobileRole && (
          <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] text-slate-500 font-medium">
              Modo {role === 'passenger' ? 'Pasajero' : 'Conductor'}
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setDeviceViewMode('mobile')}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                  deviceViewMode === 'mobile'
                    ? 'bg-[#4A3184] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Celular Ergonomía Móvil"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Móvil</span>
              </button>
              <button
                onClick={() => setDeviceViewMode('responsive')}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                  deviceViewMode === 'responsive'
                    ? 'bg-[#4A3184] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Pantalla Completa"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Expandido</span>
              </button>
            </div>
          </div>
        )}

        {/* Content View by Role wrapped in ErrorBoundary */}
        <ErrorBoundary>
          {role === 'passenger' && (
            showMobileFrame ? (
              <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[40px] shadow-2xl border-4 sm:border-8 border-slate-900/90 overflow-hidden relative min-h-[720px] transition-all">
                {/* Speaker / Notch simulator */}
                <div className="hidden sm:flex justify-center pt-2 pb-1 bg-slate-900/90">
                  <div className="w-24 h-4 bg-black rounded-full"></div>
                </div>
                <PassengerApp />
              </div>
            ) : (
              <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 transition-all">
                <PassengerApp />
              </div>
            )
          )}

          {role === 'driver' && (
            showMobileFrame ? (
              <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[40px] shadow-2xl border-4 sm:border-8 border-slate-900/90 overflow-hidden relative min-h-[720px] transition-all">
                {/* Speaker / Notch simulator */}
                <div className="hidden sm:flex justify-center pt-2 pb-1 bg-slate-900/90">
                  <div className="w-24 h-4 bg-black rounded-full"></div>
                </div>
                <DriverApp />
              </div>
            ) : (
              <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 transition-all">
                <DriverApp />
              </div>
            )
          )}

          {role === 'company' && (
            <div className="w-full">
              <CompanyPortal />
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* GLOBAL MODALS */}
      <QrScannerModal />
      <ReceiptModal />
      <RatingModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <TappiProvider>
      <TappiAppContent />
    </TappiProvider>
  );
}
