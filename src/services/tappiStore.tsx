import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  PassengerProfile,
  DriverProfile,
  Company,
  Vehicle,
  Route,
  Trip,
  Transaction,
  Reward,
  ProposedRoute,
  Incident,
  AppNotification,
  Rating,
} from '../types';
import {
  mockCompany,
  mockCurrentUserPassenger,
  mockPassengerProfile,
  mockCurrentUserDriver,
  mockDriverProfile,
  mockRoutes,
  mockVehicles,
  mockActiveTrip,
  mockTripHistory,
  mockTransactions,
  mockRewards,
  mockProposedRoutes,
  mockIncidents,
  mockNotifications,
} from './mockData';
import confetti from 'canvas-confetti';

// Safe confetti wrapper for restricted or headless iframe contexts
const safeConfetti = (opts: Parameters<typeof confetti>[0]) => {
  try {
    confetti(opts);
  } catch (e) {
    // Graceful fallback if canvas is disabled or unsupported
    console.debug('Confetti effect skipped:', e);
  }
};

interface TappiContextType {
  // Roles & Navigation
  role: UserRole;
  currentRole: UserRole; // Alias for compatibility
  setRole: (role: UserRole) => void;
  deviceViewMode: 'mobile' | 'responsive';
  setDeviceViewMode: (mode: 'mobile' | 'responsive') => void;

  passengerTab: 'home' | 'trips' | 'wallet' | 'rewards' | 'profile';
  setPassengerTab: (tab: 'home' | 'trips' | 'wallet' | 'rewards' | 'profile') => void;

  driverTab: 'home' | 'active_trip' | 'passengers' | 'earnings' | 'profile';
  setDriverTab: (tab: 'home' | 'active_trip' | 'passengers' | 'earnings' | 'profile') => void;

  companyTab: 'dashboard' | 'fleet' | 'routes' | 'personnel' | 'finance' | 'incidents' | 'reports';
  setCompanyTab: (tab: 'dashboard' | 'fleet' | 'routes' | 'personnel' | 'finance' | 'incidents' | 'reports') => void;

  // Data
  company: Company;
  passengerUser: User;
  passengerProfile: PassengerProfile;
  driverUser: User;
  driverProfile: DriverProfile;
  routes: Route[];
  vehicles: Vehicle[];
  activeTrip: Trip | null;
  tripHistory: Trip[];
  transactions: Transaction[];
  rewards: Reward[];
  proposedRoutes: ProposedRoute[];
  incidents: Incident[];
  notifications: AppNotification[];

  // Modals & Overlays
  qrModalOpen: boolean;
  qrModalMode: 'passenger_scan_vehicle' | 'driver_scan_passenger' | 'passenger_show_badge';
  openQrModal: (mode?: 'passenger_scan_vehicle' | 'driver_scan_passenger' | 'passenger_show_badge') => void;
  closeQrModal: () => void;

  receiptModalOpen: boolean;
  activeReceiptTransaction: Transaction | null;
  openReceiptModal: (transaction: Transaction) => void;
  closeReceiptModal: () => void;

  ratingModalOpen: boolean;
  activeRatingTrip: Trip | null;
  openRatingModal: (trip: Trip) => void;
  closeRatingModal: () => void;
  submitRating: (score: number, tags: string[], comment?: string) => void;

  notifDrawerOpen: boolean;
  setNotifDrawerOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;

  // Core Actions
  rechargeWallet: (amount: number, method: 'yape' | 'plin' | 'visa') => void;
  payTripFare: (amount: number, method: 'wallet' | 'subsidy') => Transaction;
  processQrScan: (scannedCode: string) => { success: boolean; message: string; data?: any };
  claimReward: (rewardId: string) => void;
  proposeNewRoute: (route: { origin: string; destination: string; preferredTime: string; notes?: string }) => void;
  voteRouteProposal: (id: string) => void;
  reportIncident: (incident: { title: string; description: string; category: Incident['category']; severity: Incident['severity']; vehiclePlate?: string }) => void;
  resolveIncident: (id: string, note: string) => void;

  // Driver Actions
  startDriverTrip: (routeId: string) => void;
  advanceDriverStop: () => void;
  verifyPassengerBoarding: (passengerId: string) => void;
  finishDriverTrip: () => void;

  // System
  triggerHapticFeedback: () => void;
}

const TappiContext = createContext<TappiContextType | undefined>(undefined);

export const TappiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('passenger');
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'responsive'>('mobile');

  const [passengerTab, setPassengerTab] = useState<'home' | 'trips' | 'wallet' | 'rewards' | 'profile'>('home');
  const [driverTab, setDriverTab] = useState<'home' | 'active_trip' | 'passengers' | 'earnings' | 'profile'>('home');
  const [companyTab, setCompanyTab] = useState<'dashboard' | 'fleet' | 'routes' | 'personnel' | 'finance' | 'incidents' | 'reports'>('dashboard');

  // Entities
  const [company] = useState<Company>(mockCompany);
  const [passengerUser] = useState<User>(mockCurrentUserPassenger);
  const [passengerProfile, setPassengerProfile] = useState<PassengerProfile>(mockPassengerProfile);
  const [driverUser] = useState<User>(mockCurrentUserDriver);
  const [driverProfile, setDriverProfile] = useState<DriverProfile>(mockDriverProfile);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(mockActiveTrip);
  const [tripHistory, setTripHistory] = useState<Trip[]>(mockTripHistory);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [proposedRoutes, setProposedRoutes] = useState<ProposedRoute[]>(mockProposedRoutes);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalMode, setQrModalMode] = useState<'passenger_scan_vehicle' | 'driver_scan_passenger' | 'passenger_show_badge'>('passenger_scan_vehicle');

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceiptTransaction, setActiveReceiptTransaction] = useState<Transaction | null>(null);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [activeRatingTrip, setActiveRatingTrip] = useState<Trip | null>(null);

  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // When switching to company, switch device view mode to responsive for wide experience
  useEffect(() => {
    if (role === 'company') {
      setDeviceViewMode('responsive');
    }
  }, [role]);

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // Safe fallback
      }
    }
  };

  const openQrModal = (mode: 'passenger_scan_vehicle' | 'driver_scan_passenger' | 'passenger_show_badge' = 'passenger_scan_vehicle') => {
    setQrModalMode(mode);
    setQrModalOpen(true);
  };

  const closeQrModal = () => setQrModalOpen(false);

  const openReceiptModal = (tx: Transaction) => {
    setActiveReceiptTransaction(tx);
    setReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setReceiptModalOpen(false);
    setActiveReceiptTransaction(null);
  };

  const openRatingModal = (trip: Trip) => {
    setActiveRatingTrip(trip);
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setActiveRatingTrip(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Recharging passenger wallet
  const rechargeWallet = (amount: number, method: 'yape' | 'plin' | 'visa') => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      passengerId: passengerUser.id,
      amount: amount,
      type: 'recharge',
      description: `Recarga digital vía ${method.toUpperCase()}`,
      date: 'Ahora mismo',
      status: 'completed',
      receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMethod: method,
    };

    setPassengerProfile(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
      points: prev.points + Math.floor(amount * 2),
    }));

    setTransactions(prev => [newTx, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `¡Recarga exitosa de S/ ${amount.toFixed(2)}!`,
        message: `Tu saldo actual de Billetera Tappi es S/ ${(passengerProfile.walletBalance + amount).toFixed(2)}.`,
        type: 'payment',
        timestamp: 'Hace 1 min',
        read: false,
      },
      ...prev,
    ]);

    safeConfetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    triggerHapticFeedback();
  };

  // Pay Trip Fare
  const payTripFare = (amount: number, method: 'wallet' | 'subsidy'): Transaction => {
    const receiptNum = `TP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      passengerId: passengerUser.id,
      tripId: activeTrip?.id,
      amount: -amount,
      type: 'payment',
      description: `Pasaje ${activeTrip?.routeName || 'Línea Corporativa'} (Placa ${activeTrip?.vehiclePlate || 'B8X-720'})`,
      date: 'Ahora mismo',
      status: 'completed',
      receiptNumber: receiptNum,
      paymentMethod: method === 'subsidy' ? 'corporate_subsidy' : 'tappi_wallet',
    };

    setPassengerProfile(prev => {
      if (method === 'subsidy') {
        return {
          ...prev,
          corporateSubsidy: Math.max(0, prev.corporateSubsidy - amount),
          points: prev.points + 25,
          savedCarbonKg: Number((prev.savedCarbonKg + 1.2).toFixed(1)),
        };
      } else {
        return {
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - amount),
          points: prev.points + 35,
          savedCarbonKg: Number((prev.savedCarbonKg + 1.2).toFixed(1)),
        };
      }
    });

    setTransactions(prev => [newTx, ...prev]);

    // Update driver earnings in real-time
    setDriverProfile(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + amount,
      totalEarnings: prev.totalEarnings + amount,
    }));

    // Trigger celebration
    safeConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#4A3184', '#AB2E81', '#F3A81A', '#10B981'],
    });
    triggerHapticFeedback();

    return newTx;
  };

  // QR Code Processing
  const processQrScan = (scannedCode: string) => {
    triggerHapticFeedback();

    // 1. Vehicle QR Scan by Passenger
    if (scannedCode.includes('TAPPI-VEH') || scannedCode.includes('B8X720') || scannedCode.includes('AYZ915')) {
      const matchingVehicle = vehicles.find(v => scannedCode.includes(v.plate.replace('-', '')) || scannedCode.includes(v.id)) || vehicles[0];

      // Auto-board passenger into the active trip
      if (activeTrip) {
        const fare = activeTrip.fare;
        const useSubsidy = passengerProfile.corporateSubsidy >= fare;
        const tx = payTripFare(fare, useSubsidy ? 'subsidy' : 'wallet');

        setActiveTrip(prev => {
          if (!prev) return null;
          const updatedPassengers = prev.passengers.map(p => {
            if (p.passengerId === passengerUser.id) {
              return { ...p, status: 'boarded' as const, boardedAt: 'Ahora mismo', paidWith: (useSubsidy ? 'subsidy' : 'wallet') as any };
            }
            return p;
          });
          return { ...prev, passengers: updatedPassengers };
        });

        closeQrModal();
        openReceiptModal(tx);

        return {
          success: true,
          message: `¡Bienvenido a bordo! Identificado con ${matchingVehicle.driverName} (${matchingVehicle.plate}).`,
          data: { vehicle: matchingVehicle, transaction: tx },
        };
      }

      return {
        success: true,
        message: `Vehículo ${matchingVehicle.brand} ${matchingVehicle.model} (${matchingVehicle.plate}) verificado.`,
        data: { vehicle: matchingVehicle },
      };
    }

    // 2. Driver scanning Passenger Badge
    if (scannedCode.includes('EMP-') || scannedCode.includes('PASSENGER')) {
      if (activeTrip) {
        const pIndex = activeTrip.passengers.findIndex(p => scannedCode.includes(p.employeeCode) || scannedCode.includes(p.passengerId));
        if (pIndex >= 0) {
          const p = activeTrip.passengers[pIndex];
          verifyPassengerBoarding(p.passengerId);
          closeQrModal();
          return {
            success: true,
            message: `Pasajero validado: ${p.passengerName} (${p.employeeCode}). Pasaje cobrado.`,
            data: p,
          };
        }
      }
      return {
        success: true,
        message: `Credencial verificada con éxito: ${scannedCode}`,
      };
    }

    return {
      success: true,
      message: `Código Tappi procesado: ${scannedCode}`,
    };
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.claimed) return;

    if (passengerProfile.points < reward.pointsCost) {
      alert(`Necesitas ${reward.pointsCost} puntos Tappi. Tienes ${passengerProfile.points}. ¡Realiza más viajes para acumularlos!`);
      return;
    }

    setPassengerProfile(prev => ({
      ...prev,
      points: prev.points - reward.pointsCost,
    }));

    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, claimed: true } : r));

    if (reward.id === 'rew-2') {
      // Direct cash to wallet
      rechargeWallet(15, 'yape');
    }

    safeConfetti({ particleCount: 70, spread: 80 });
    triggerHapticFeedback();
  };

  const proposeNewRoute = (newRoute: { origin: string; destination: string; preferredTime: string; notes?: string }) => {
    const proposal: ProposedRoute = {
      id: `prop-${Date.now()}`,
      passengerId: passengerUser.id,
      passengerName: passengerUser.name,
      companyName: 'TechCorp Perú',
      origin: newRoute.origin,
      destination: newRoute.destination,
      preferredDepartureTime: newRoute.preferredTime,
      estimatedPassengers: 1,
      votes: 1,
      status: 'review',
      createdAt: 'Hoy',
    };

    setProposedRoutes(prev => [proposal, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Propuesta de ruta enviada',
        message: `Tu propuesta de ruta "${newRoute.origin} ➔ ${newRoute.destination}" ha sido enviada al área de transporte corporativo.`,
        type: 'trip',
        timestamp: 'Ahora mismo',
        read: false,
      },
      ...prev,
    ]);

    safeConfetti({ particleCount: 40, spread: 50 });
  };

  const voteRouteProposal = (id: string) => {
    setProposedRoutes(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
    triggerHapticFeedback();
  };

  const reportIncident = (newInc: { title: string; description: string; category: Incident['category']; severity: Incident['severity']; vehiclePlate?: string }) => {
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      tripId: activeTrip?.id,
      reportedByRole: role,
      reporterName: role === 'passenger' ? passengerUser.name : (role === 'driver' ? driverUser.name : 'Central'),
      title: newInc.title,
      description: newInc.description,
      category: newInc.category,
      severity: newInc.severity,
      status: 'abierta',
      timestamp: 'Ahora mismo',
      vehiclePlate: newInc.vehiclePlate || activeTrip?.vehiclePlate,
    };

    setIncidents(prev => [incident, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Incidencia registrada (#${incident.id})`,
        message: `Se ha notificado al centro de control empresarial para su seguimiento inmediato.`,
        type: 'security',
        timestamp: 'Ahora mismo',
        read: false,
      },
      ...prev,
    ]);

    triggerHapticFeedback();
  };

  const resolveIncident = (id: string, note: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? {
      ...inc,
      status: 'resuelta',
      resolutionNote: note,
    } : inc));
  };

  // Driver trip methods
  const startDriverTrip = (routeId: string) => {
    const r = routes.find(rt => rt.id === routeId) || routes[0];
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      routeId: r.id,
      routeName: r.name,
      driverId: driverUser.id,
      driverName: driverUser.name,
      driverAvatar: driverUser.avatar,
      driverRating: driverProfile.rating,
      driverPhone: driverUser.phone,
      vehicleId: vehicles[0].id,
      vehiclePlate: vehicles[0].plate,
      vehicleModel: `${vehicles[0].brand} ${vehicles[0].model}`,
      status: 'in_progress',
      startTime: 'Ahora mismo',
      currentStopIndex: 0,
      capacity: vehicles[0].capacity,
      fare: r.fare,
      currentLat: r.stops[0].lat,
      currentLng: r.stops[0].lng,
      speedKmH: 35,
      etaNextStopMin: r.stops[1]?.etaMinutes || 10,
      passengers: [
        {
          passengerId: passengerUser.id,
          passengerName: passengerUser.name,
          avatar: passengerUser.avatar,
          employeeCode: passengerProfile.employeeCode,
          boardingStop: r.stops[0].name,
          destinationStop: r.stops[r.stops.length - 1].name,
          status: 'boarded',
          boardedAt: '08:00 AM',
          fare: r.fare,
          paidWith: 'subsidy',
        },
        {
          passengerId: 'usr-p2',
          passengerName: 'Andrés Valdivia Soto',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          employeeCode: 'EMP-3109',
          boardingStop: r.stops[0].name,
          destinationStop: r.stops[r.stops.length - 1].name,
          status: 'boarded',
          boardedAt: '08:02 AM',
          fare: r.fare,
          paidWith: 'wallet',
        },
        {
          passengerId: 'usr-p4',
          passengerName: 'Mateo Quispe Flores',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          employeeCode: 'EMP-9012',
          boardingStop: r.stops[1]?.name || 'Paradero 2',
          destinationStop: r.stops[r.stops.length - 1].name,
          status: 'registered',
          fare: r.fare,
          paidWith: 'wallet',
        },
      ],
    };

    setActiveTrip(newTrip);
    setDriverProfile(prev => ({ ...prev, status: 'on_trip' }));
    setDriverTab('active_trip');
    triggerHapticFeedback();
  };

  const advanceDriverStop = () => {
    if (!activeTrip) return;
    const currentRoute = routes.find(r => r.id === activeTrip.routeId) || routes[0];
    const nextIdx = activeTrip.currentStopIndex + 1;

    if (nextIdx >= currentRoute.stops.length) {
      finishDriverTrip();
      return;
    }

    const nextStop = currentRoute.stops[nextIdx];
    setActiveTrip(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentStopIndex: nextIdx,
        currentLat: nextStop.lat,
        currentLng: nextStop.lng,
        etaNextStopMin: currentRoute.stops[nextIdx + 1]?.etaMinutes || 0,
      };
    });

    triggerHapticFeedback();
  };

  const verifyPassengerBoarding = (pId: string) => {
    if (!activeTrip) return;

    setActiveTrip(prev => {
      if (!prev) return null;
      const updated = prev.passengers.map(p => {
        if (p.passengerId === pId) {
          return { ...p, status: 'boarded' as const, boardedAt: 'Ahora mismo' };
        }
        return p;
      });
      return { ...prev, passengers: updated };
    });

    setDriverProfile(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + activeTrip.fare,
      totalEarnings: prev.totalEarnings + activeTrip.fare,
    }));

    safeConfetti({ particleCount: 30, spread: 40 });
    triggerHapticFeedback();
  };

  const finishDriverTrip = () => {
    if (!activeTrip) return;

    const completed: Trip = {
      ...activeTrip,
      status: 'completed',
      endTime: 'Ahora mismo',
      speedKmH: 0,
    };

    setTripHistory(prev => [completed, ...prev]);
    setActiveTrip(null);
    setDriverProfile(prev => ({
      ...prev,
      status: 'available',
      totalTrips: prev.totalTrips + 1,
    }));

    setDriverTab('earnings');
    safeConfetti({ particleCount: 90, spread: 80 });
    triggerHapticFeedback();
  };

  const submitRating = (score: number, tags: string[], comment?: string) => {
    if (activeRatingTrip) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: '¡Gracias por calificar tu viaje!',
          message: `Has calificado a ${activeRatingTrip.driverName} con ${score} estrellas. Tu opinión ayuda a mantener un servicio seguro y de calidad.`,
          type: 'trip',
          timestamp: 'Ahora mismo',
          read: false,
        },
        ...prev,
      ]);
    }
    closeRatingModal();
    safeConfetti({ particleCount: 50, spread: 60 });
  };

  return (
    <TappiContext.Provider
      value={{
        role,
        currentRole: role,
        setRole,
        deviceViewMode,
        setDeviceViewMode,
        passengerTab,
        setPassengerTab,
        driverTab,
        setDriverTab,
        companyTab,
        setCompanyTab,
        company,
        passengerUser,
        passengerProfile,
        driverUser,
        driverProfile,
        routes,
        vehicles,
        activeTrip,
        tripHistory,
        transactions,
        rewards,
        proposedRoutes,
        incidents,
        notifications,
        qrModalOpen,
        qrModalMode,
        openQrModal,
        closeQrModal,
        receiptModalOpen,
        activeReceiptTransaction,
        openReceiptModal,
        closeReceiptModal,
        ratingModalOpen,
        activeRatingTrip,
        openRatingModal,
        closeRatingModal,
        submitRating,
        notifDrawerOpen,
        setNotifDrawerOpen,
        markNotificationRead,
        rechargeWallet,
        payTripFare,
        processQrScan,
        claimReward,
        proposeNewRoute,
        voteRouteProposal,
        reportIncident,
        resolveIncident,
        startDriverTrip,
        advanceDriverStop,
        verifyPassengerBoarding,
        finishDriverTrip,
        triggerHapticFeedback,
      }}
    >
      {children}
    </TappiContext.Provider>
  );
};

export const useTappi = () => {
  const context = useContext(TappiContext);
  if (!context) {
    throw new Error('useTappi must be used within a TappiProvider');
  }
  return context;
};
