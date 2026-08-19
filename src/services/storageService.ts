import { RiderProfile, UserAccount } from '../types/rider';
import { ClaimRecord } from '../types';

// Helper to hash passwords using SHA-256 via Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Keys
const RIDERS_KEY = 'climashield_riders_v1';
const ACCOUNTS_KEY = 'climashield_accounts_v1';
const CLAIMS_KEY = 'climashield_claims_v1';
const CURRENT_USER_KEY = 'climashield_session_user';

// Seed Initial Data if empty
const INITIAL_DEMO_RIDER: RiderProfile = {
  riderId: 'CS-RDR-10248',
  fullName: 'Ramesh Kumar',
  phone: '9876543210',
  email: 'ramesh.rider@climashield.in',
  dateOfBirth: '1995-08-15',
  gender: 'Male',
  workerType: 'Delivery Rider',
  platform: 'Swiggy',
  vehicleType: 'Motorcycle',
  experience: '2–5 years',
  workingHours: '8–10 hours',
  dailyIncomeRange: '₹800–₹1,200',
  city: 'Bengaluru',
  state: 'Karnataka',
  area: 'Indiranagar Zone Z-1',
  pincode: '560038',
  preferredWorkingZone: 'Indiranagar 100ft Rd & Koramangala',
  locationConsent: true,
  latitude: 12.9784,
  longitude: 77.6408,
  emergencyContact: {
    name: 'Sunita Kumar',
    relationship: 'Spouse',
    phone: '9876543211'
  },
  profileCompleted: 95,
  protectionStatus: 'ACTIVE',
  planId: 'PLAN-GOLD-300',
  role: 'rider',
  createdAt: '2026-01-10T10:00:00Z',
  updatedAt: '2026-08-14T12:00:00Z'
};

const INITIAL_DEMO_CLAIMS: ClaimRecord[] = [
  {
    id: 'CS-CLM-00124',
    timestamp: '14 Aug 2026, 15:30:00',
    amount: 250,
    upiTransactionId: 'UPI/2026/CS-984210',
    triggerReason: 'Extreme Heatwave - NOAA Wet Bulb Heat Index 44.2°C (>43°C limit)',
    temperature: 44,
    humidity: 55,
    rain: 0,
    status: 'INSTANT_CREDITED',
    geofenceZone: 'Indiranagar Hub (Zone Z-1)'
  },
  {
    id: 'CS-CLM-00098',
    timestamp: '02 Aug 2026, 17:15:00',
    amount: 250,
    upiTransactionId: 'UPI/2026/CS-881290',
    triggerReason: 'Torrential Rainfall Hazard - Precipitation Rate 38.5 mm/hr (>30 mm/hr limit)',
    temperature: 29,
    humidity: 88,
    rain: 38.5,
    status: 'INSTANT_CREDITED',
    geofenceZone: 'Koramangala Commercial Hub'
  }
];

export class StorageService {
  private static initialized = false;

  public static async init() {
    if (this.initialized) return;

    if (!localStorage.getItem(RIDERS_KEY)) {
      localStorage.setItem(RIDERS_KEY, JSON.stringify([INITIAL_DEMO_RIDER]));
    }

    if (!localStorage.getItem(CLAIMS_KEY)) {
      localStorage.setItem(CLAIMS_KEY, JSON.stringify(INITIAL_DEMO_CLAIMS));
    }

    if (!localStorage.getItem(ACCOUNTS_KEY)) {
      const riderHash = await hashPassword('Rider@123');
      const adminHash = await hashPassword('Admin@123');

      const accounts: UserAccount[] = [
        {
          id: 'acc_rider_1',
          phoneOrEmail: '9876543210',
          passwordHash: riderHash,
          role: 'rider',
          riderId: 'CS-RDR-10248',
          createdAt: new Date().toISOString()
        },
        {
          id: 'acc_rider_1_email',
          phoneOrEmail: 'ramesh.rider@climashield.in',
          passwordHash: riderHash,
          role: 'rider',
          riderId: 'CS-RDR-10248',
          createdAt: new Date().toISOString()
        },
        {
          id: 'acc_admin_1',
          phoneOrEmail: 'admin@climashield.in',
          passwordHash: adminHash,
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];

      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    this.initialized = true;
  }

  // Get all riders (for admin)
  public static getRiders(): RiderProfile[] {
    try {
      const data = localStorage.getItem(RIDERS_KEY);
      return data ? JSON.parse(data) : [INITIAL_DEMO_RIDER];
    } catch {
      return [INITIAL_DEMO_RIDER];
    }
  }

  // Get rider by ID
  public static getRiderById(riderId: string): RiderProfile | null {
    const riders = this.getRiders();
    return riders.find(r => r.riderId === riderId) || null;
  }

  // Get rider by phone or email
  public static getRiderByContact(contact: string): RiderProfile | null {
    const riders = this.getRiders();
    const clean = contact.trim().toLowerCase();
    return riders.find(r => r.phone === clean || r.email.toLowerCase() === clean) || null;
  }

  // Save/Update Rider
  public static saveRider(rider: RiderProfile) {
    const riders = this.getRiders();
    const idx = riders.findIndex(r => r.riderId === rider.riderId);
    if (idx >= 0) {
      riders[idx] = rider;
    } else {
      riders.push(rider);
    }
    localStorage.setItem(RIDERS_KEY, JSON.stringify(riders));
  }

  // Accounts & Authentication
  public static getAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveAccount(account: UserAccount) {
    const accounts = this.getAccounts();
    accounts.push(account);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // Unique Rider ID generator
  public static generateRiderId(): string {
    const riders = this.getRiders();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const candidate = `CS-RDR-${randomNum}`;
    if (riders.some(r => r.riderId === candidate)) {
      return this.generateRiderId();
    }
    return candidate;
  }

  // Claims
  public static getClaims(): ClaimRecord[] {
    try {
      const data = localStorage.getItem(CLAIMS_KEY);
      return data ? JSON.parse(data) : INITIAL_DEMO_CLAIMS;
    } catch {
      return INITIAL_DEMO_CLAIMS;
    }
  }

  public static addClaim(claim: ClaimRecord) {
    const claims = this.getClaims();
    claims.unshift(claim);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  }

  // Session
  public static setSession(user: { id: string; role: 'rider' | 'admin'; riderId?: string; name: string; email?: string }) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  public static getSession() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static clearSession() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
