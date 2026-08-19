export type WorkerType = 
  | 'Delivery Rider'
  | 'Auto Driver'
  | 'Cab Driver'
  | 'E-commerce Delivery Partner'
  | 'Food Delivery Partner'
  | 'Other Gig Worker';

export type PlatformCompany = 
  | 'Swiggy'
  | 'Zomato'
  | 'Zepto'
  | 'Blinkit'
  | 'Uber'
  | 'Ola'
  | 'Rapido'
  | 'Amazon'
  | 'Flipkart'
  | 'Other';

export type VehicleType = 
  | 'Motorcycle'
  | 'Scooter'
  | 'Bicycle'
  | 'Auto Rickshaw'
  | 'Car'
  | 'Other';

export type WorkExperience = 
  | 'Less than 1 year'
  | '1–2 years'
  | '2–5 years'
  | '5+ years';

export type WorkingHoursPerDay = 
  | 'Less than 4 hours'
  | '4–6 hours'
  | '6–8 hours'
  | '8–10 hours'
  | 'More than 10 hours';

export type DailyIncomeRange = 
  | 'Below ₹500'
  | '₹500–₹800'
  | '₹800–₹1,200'
  | '₹1,200–₹1,500'
  | 'Above ₹1,500';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface RiderProfile {
  riderId: string; // e.g. CS-RDR-10248
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  
  // Work Details
  workerType: WorkerType;
  platform: PlatformCompany;
  vehicleType: VehicleType;
  experience: WorkExperience;
  workingHours: WorkingHoursPerDay;
  dailyIncomeRange: DailyIncomeRange;

  // Location & Risk
  city: string;
  state: string;
  area: string;
  pincode: string;
  preferredWorkingZone?: string;
  locationConsent: boolean;
  latitude?: number;
  longitude?: number;

  // Account & Emergency
  emergencyContact?: EmergencyContact;
  profileCompleted: number; // e.g. 85%
  protectionStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  planId: string;
  role: 'rider' | 'admin';

  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  phoneOrEmail: string;
  passwordHash: string;
  role: 'rider' | 'admin';
  riderId?: string;
  createdAt: string;
}
