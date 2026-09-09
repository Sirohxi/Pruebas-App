export type UserRole = 'passenger' | 'driver' | 'company';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export interface PassengerProfile {
  userId: string;
  employeeCode: string;
  department: string;
  assignedRouteIds: string[];
  homeStop: string;
  workStop: string;
  walletBalance: number;
  corporateSubsidy: number;
  points: number;
  savedCarbonKg: number;
}

export interface DriverProfile {
  userId: string;
  licenseNumber: string;
  licenseCategory: string;
  vehicleId: string;
  rating: number;
  totalTrips: number;
  onTimePercentage: number;
  status: 'available' | 'on_trip' | 'off_duty';
  todayEarnings: number;
  totalEarnings: number;
  experienceYears: number;
}

export interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  fleetSize: number;
  activeEmployees: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  occupiedSeats: number;
  companyId: string;
  driverId: string;
  driverName: string;
  status: 'active' | 'maintenance' | 'idle';
  fuelType: 'Gasolina' | 'GNV' | 'Diésel' | 'Eléctrico';
  soatExpiry: string;
  technicalReviewExpiry: string;
  currentLat: number;
  currentLng: number;
  qrCode: string;
}

export interface Stop {
  id: string;
  name: string;
  order: number;
  lat: number;
  lng: number;
  etaMinutes: number;
  address: string;
}

export interface Route {
  id: string;
  name: string;
  code: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  companyId: string;
  companyName: string;
  stops: Stop[];
  frequencyMinutes: number;
  operatingHours: string;
  activeBuses: number;
  coordinates: [number, number][]; // lat, lng polyline points
  color: string;
}

export interface TripPassenger {
  passengerId: string;
  passengerName: string;
  avatar: string;
  employeeCode: string;
  boardingStop: string;
  destinationStop: string;
  status: 'registered' | 'boarded' | 'completed' | 'absent';
  boardedAt?: string;
  fare: number;
  paidWith: 'wallet' | 'subsidy' | 'qr';
}

export interface Trip {
  id: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  driverPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  status: 'scheduled' | 'boarding' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  currentStopIndex: number;
  passengers: TripPassenger[];
  capacity: number;
  fare: number;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  etaNextStopMin: number;
}

export interface Transaction {
  id: string;
  passengerId: string;
  tripId?: string;
  amount: number;
  type: 'payment' | 'recharge' | 'subsidy' | 'cashback';
  description: string;
  date: string;
  status: 'completed' | 'pending';
  receiptNumber: string;
  paymentMethod: 'tappi_wallet' | 'yape' | 'plin' | 'visa' | 'corporate_subsidy';
}

export interface Rating {
  id: string;
  tripId: string;
  passengerId: string;
  driverId: string;
  score: number;
  tags: string[];
  comment?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discount: string;
  partner: string;
  logo: string;
  category: 'cafeteria' | 'viajes' | 'tecnologia' | 'bienestar';
  claimed: boolean;
  code?: string;
}

export interface ProposedRoute {
  id: string;
  passengerId: string;
  passengerName: string;
  companyName: string;
  origin: string;
  destination: string;
  preferredDepartureTime: string;
  estimatedPassengers: number;
  votes: number;
  status: 'review' | 'approved' | 'in_study';
  createdAt: string;
}

export interface Incident {
  id: string;
  tripId?: string;
  reportedByRole: UserRole;
  reporterName: string;
  title: string;
  description: string;
  category: 'retraso' | 'seguridad' | 'mecanico' | 'comportamiento' | 'otro';
  severity: 'baja' | 'media' | 'alta' | 'critica';
  status: 'abierta' | 'en_proceso' | 'resuelta';
  timestamp: string;
  vehiclePlate?: string;
  resolutionNote?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'trip' | 'payment' | 'security' | 'promo' | 'driver';
  timestamp: string;
  read: boolean;
}
