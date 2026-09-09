import React from 'react';
import { useTappi } from '../../services/tappiStore';
import { X, Bell, Bus, CreditCard, Shield, Sparkles, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationDrawer: React.FC = () => {
  const { notifDrawerOpen, setNotifDrawerOpen, notifications, markNotificationRead } = useTappi();

  if (!notifDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return <Bus className="w-4 h-4 text-[#4A3184]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'security':
        return <Shield className="w-4 h-4 text-[#AB2E81]" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-[#F3A81A]" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#4A3184]" />
              <h3 className="font-bold text-slate-900 text-base">Notificaciones</h3>
            </div>
            <button
              onClick={() => setNotifDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No tienes notificaciones pendientes.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    n.read
                      ? 'bg-white border-slate-100 text-slate-600'
                      : 'bg-violet-50/70 border-violet-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold truncate">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <button
              onClick={() => {
                notifications.forEach(n => markNotificationRead(n.id));
              }}
              className="text-xs font-semibold text-[#4A3184] hover:text-[#3b256d] flex items-center justify-center gap-1.5 w-full py-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
