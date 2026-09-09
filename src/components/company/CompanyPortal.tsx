import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { CompanyDashboard } from './CompanyDashboard';
import { CompanyLiveFleet } from './CompanyLiveFleet';
import { CompanyRoutes } from './CompanyRoutes';
import { CompanyVehicles } from './CompanyVehicles';
import { CompanyPersonnel } from './CompanyPersonnel';
import { CompanyIncidents } from './CompanyIncidents';
import { CompanyReports } from './CompanyReports';
import {
  LayoutDashboard,
  Radio,
  Route as RouteIcon,
  Car,
  Users,
  AlertTriangle,
  BarChart3,
  Building,
} from 'lucide-react';

export const CompanyPortal: React.FC = () => {
  const { companyTab, setCompanyTab, incidents, company } = useTappi();

  const openIncidents = incidents.filter(i => i.status !== 'resuelta').length;

  const navItems = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'fleet', label: 'Monitoreo Satelital', icon: Radio },
    { id: 'routes', label: 'Rutas y Paraderos', icon: RouteIcon },
    { id: 'vehicles', label: 'Vehículos', icon: Car },
    { id: 'personnel', label: 'Conductores y Pasajeros', icon: Users },
    { id: 'incidents', label: 'Incidencias', icon: AlertTriangle, badge: openIncidents },
    { id: 'reports', label: 'Analítica y ESG', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[680px]">
      {/* SIDEBAR NAVIGATION (DESKTOP) / HORIZONTAL SCROLL (MOBILE) */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-4 sticky top-4">
          <div className="px-2 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Empresa Cliente
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Building className="w-4 h-4 text-[#4A3184]" />
              <h3 className="text-sm font-black text-slate-900">{company.name}</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">RUC {company.taxId}</span>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = companyTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCompanyTab(item.id as any)}
                  className={`flex-shrink-0 lg:w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#4A3184] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3A81A]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0">
        {companyTab === 'dashboard' && <CompanyDashboard />}
        {companyTab === 'fleet' && <CompanyLiveFleet />}
        {companyTab === 'routes' && <CompanyRoutes />}
        {companyTab === 'vehicles' && <CompanyVehicles />}
        {companyTab === 'personnel' && <CompanyPersonnel />}
        {companyTab === 'incidents' && <CompanyIncidents />}
        {companyTab === 'reports' && <CompanyReports />}
      </main>
    </div>
  );
};
